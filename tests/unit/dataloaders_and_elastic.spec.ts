import { DataLoaderFactory } from '../../src/dataloader';
import { RequestedFields } from '../../src/RequestedFields';
import { matchAnyFields, createIndex, deleteIndex, updateIndex } from '../../src/modules/users/elasticSearch/users.elastic';
import client from '../../src/factory/elastic_search_factory';
import { User } from '../../src/models';

jest.mock('../../src/factory/elastic_search_factory', () => ({
  search: jest.fn(),
  index: jest.fn(),
  delete: jest.fn(),
  update: jest.fn()
}));

jest.mock('../../src/models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

describe('DataLoaders & ElasticSearch Unit Tests', () => {
  describe('DataLoaderFactory', () => {
    let mockDb: any;
    let mockInfo: any;
    let requestedFields: RequestedFields;

    beforeEach(() => {
      requestedFields = new RequestedFields();
      mockInfo = {
        fieldNodes: [
          {
            kind: 'Field',
            name: { value: 'item' },
            selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
          }
        ]
      };

      mockDb = {
        Author: { findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Author 1' }]) },
        BlogComment: { findAll: jest.fn().mockResolvedValue([{ id: 10, blog_id: 1, parent_id: 0, user_id: 2 }]) },
        BlogPicture: { findAll: jest.fn().mockResolvedValue([{ id: 20, blog_id: 1 }]) },
        BlogTag: { findAll: jest.fn().mockResolvedValue([{ id: 30, blog_id: 1 }]) },
        BlogCategory: { findAll: jest.fn().mockResolvedValue([{ id: 40, blog_id: 1 }]) },
        Blog: { findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Blog 1' }]) },
        User: { findAll: jest.fn().mockResolvedValue([{ id: 2, name: 'User 2' }]) },
        CompanyMedia: { findAll: jest.fn().mockResolvedValue([{ id: 50, company_id: 1 }]) },
        JAASRole: { findAll: jest.fn().mockResolvedValue([{ id: 60, user_id: 2 }]) },
        Company: { findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Company 1' }]) },
        Candidate: {
          findAll: jest.fn().mockResolvedValue([{ id: 1, user_id: 2 }]),
          sequelize: {
            query: jest.fn().mockResolvedValue([{ id: 1, title: 'Job 1' }])
          }
        },
        MemberMedia: { findAll: jest.fn().mockResolvedValue([{ id: 70, member_id: 1 }]) },
        Member: { findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Member 1' }]) },
        ResumeEducation: { findAll: jest.fn().mockResolvedValue([{ id: 80, resume_id: 1 }]) },
        ResumeExperience: { findAll: jest.fn().mockResolvedValue([{ id: 90, resume_id: 1 }]) },
        ResumeSkill: { findAll: jest.fn().mockResolvedValue([{ id: 100, resume_id: 1 }]) },
        Job: { findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Job 1' }]) },
        Resume: { findAll: jest.fn().mockResolvedValue([{ id: 1, candidate_id: 1 }]) },
        AuthorMedia: { findAll: jest.fn().mockResolvedValue([{ id: 110, author_id: 1 }]) }
      };
    });

    it('should initialize all DataLoaders via getLoaders()', async () => {
      const factory = new DataLoaderFactory(mockDb, requestedFields);
      const loaders = factory.getLoaders();

      expect(loaders).toHaveProperty('authorLoader');
      expect(loaders).toHaveProperty('commentsLoader');
      expect(loaders).toHaveProperty('picturesLoader');
      expect(loaders).toHaveProperty('usersLoader');
      expect(loaders).toHaveProperty('companiesLoader');
      expect(loaders).toHaveProperty('jobsLoader');
      expect(loaders).toHaveProperty('resumesLoader');
    });

    it('should batch load authors using authorLoader', async () => {
      const factory = new DataLoaderFactory(mockDb, requestedFields);
      const loaders = factory.getLoaders();
      const author = await loaders.authorLoader.load({ key: 1, info: mockInfo });
      expect(author).toEqual([{ id: 1, name: 'Author 1' }]);
    });

    it('should batch load comments using commentsLoader', async () => {
      const factory = new DataLoaderFactory(mockDb, requestedFields);
      const loaders = factory.getLoaders();
      const comments = await loaders.commentsLoader.load({ key: 1, info: mockInfo });
      expect(comments).toEqual([{ id: 10, blog_id: 1, parent_id: 0, user_id: 2 }]);
    });

    it('should batch load users using usersLoader', async () => {
      const factory = new DataLoaderFactory(mockDb, requestedFields);
      const loaders = factory.getLoaders();
      const user = await loaders.usersLoader.load({ key: 2, info: mockInfo });
      expect(user).toEqual([{ id: 2, name: 'User 2' }]);
    });
  });

  describe('Users ElasticSearch Service', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should matchAnyFields and transform raw hits to UserDTO array', async () => {
      (client.search as jest.Mock).mockResolvedValue({
        body: {
          hits: {
            hits: [
              {
                _id: 'doc-1',
                _score: 1.5,
                _source: { id: 1, name: 'Felipe', email: 'felipe@workix.com' }
              }
            ]
          }
        }
      });

      const results = await matchAnyFields('felipe');
      expect(client.search).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 'users',
          body: {
            query: {
              multi_match: {
                query: 'felipe',
                fields: ['email', 'firebase_uuid', 'firebase_message_token']
              }
            }
          }
        })
      );
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('doc-1');
      expect(results[0].score).toBe(1.5);
    });

    it('should createIndex for user', async () => {
      (client.index as jest.Mock).mockResolvedValue({ result: 'created' });

      const res = await createIndex({ uuid: 'u-123', name: 'John' });
      expect(client.index).toHaveBeenCalledWith({
        index: 'users',
        id: 'u-123',
        body: { uuid: 'u-123', name: 'John' }
      });
      expect(res).toEqual({ result: 'created' });
    });

    it('should deleteIndex by userId', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue({ id: 1, uuid: 'u-123' });
      (client.delete as jest.Mock).mockResolvedValue({ result: 'deleted' });

      const res = await deleteIndex(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(client.delete).toHaveBeenCalledWith({ index: 'users', id: 'u-123' });
      expect(res).toEqual({ result: 'deleted' });
    });

    it('should updateIndex for user', async () => {
      (client.update as jest.Mock).mockResolvedValue({ result: 'updated' });

      const res = await updateIndex({ uuid: 'u-123', name: 'John Updated' });
      expect(client.update).toHaveBeenCalledWith({
        index: 'users',
        type: '_doc',
        id: 'u-123',
        body: { doc: { uuid: 'u-123', name: 'John Updated' } }
      });
      expect(res).toEqual({ result: 'updated' });
    });
  });
});
