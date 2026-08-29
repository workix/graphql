import blogsRepository from '../../../src/modules/blogs/repository/blogs.repo';
import commentsRepository from '../../../src/modules/blogs/repository/comments.repo';
import authorsRepository from '../../../src/modules/authors/repository/authors.repo';
import membersRepository from '../../../src/modules/members/repository/members.repo';
import formsRepository from '../../../src/modules/forms/repository/forms.repo';
import subscribersRepository from '../../../src/modules/subscribers/repository/subscribers.repo';
import testimonialsRepository from '../../../src/modules/testimonials/repository/testimonials.repo';
import { Blog, BlogCategory, Comment, BlogTag, BlogPicture, Author, AuthorMedia, Member, MemberMedia, Form, Subscriber, Testimonial } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Blog: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  BlogCategory: {
    findAll: jest.fn()
  },
  Comment: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  BlogTag: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  BlogPicture: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  Author: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  AuthorMedia: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  Member: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  MemberMedia: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  Form: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  Subscriber: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  Testimonial: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  }
}));

describe('Modules - Blogs, Authors, Members, Forms, Subscribers & Testimonials Repositories', () => {
  let mockDb: any;
  let mockInfo: any;

  beforeEach(() => {
    mockDb = {
      sequelize: {
        transaction: jest.fn().mockImplementation(async (cb: any) => cb({})),
        query: jest.fn().mockResolvedValue([{ year: '2026', month: '08' }])
      }
    };

    mockInfo = {
      fieldNodes: [
        {
          kind: 'Field',
          name: { value: 'blogs' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        }
      ]
    };
  });

  describe('blogsRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = blogsRepository(mockDb);
    });

    it('should findAll, findById, findAllCategories, findAllTimePeriods, and findAllRecents', async () => {
      (Blog.findAll as jest.Mock).mockResolvedValue([{ id: 1, title: 'Post 1' }]);
      (Blog.findOne as jest.Mock).mockResolvedValue({ id: 1, title: 'Post 1' });
      (BlogCategory.findAll as jest.Mock).mockResolvedValue([{ category: 'Tech' }]);

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1, title: 'Post 1' }]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1, title: 'Post 1' });
      expect(await repo.findAllCategories(mockInfo, {})).toEqual(['Tech']);
      expect(await repo.findAllRecents(mockInfo, { start: 0, max: 5 })).toEqual([{ id: 1, title: 'Post 1' }]);
      expect(await repo.findAllTimePeriods(mockInfo, {})).toEqual([{ year: '2026', month: '08' }]);
    });

    it('should create blog with tags and pictures', async () => {
      const mockBlog = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Blog.create as jest.Mock).mockResolvedValue(mockBlog);

      const input = {
        title: 'Post 1',
        tags: [{ name: 'TS' }],
        pictures: [{ url: 'http://pic.png' }]
      };

      const result = await repo.create({ input });
      expect(result).toBe(mockBlog);
      expect(Blog.create).toHaveBeenCalled();
    });

    it('should destroy blog', async () => {
      (Blog.destroy as jest.Mock).mockResolvedValue(1);
      expect(await repo.destroy({ id: 1 })).toBe(true);
    });

    it('should update blog with tags and pictures or throw if missing', async () => {
      (Blog.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Blog with id: 99 not found');

      (Blog.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Blog.update as jest.Mock).mockResolvedValue([[1], []]);
      (Blog.findOne as jest.Mock).mockResolvedValue({ id: 1, title: 'Updated' });

      const input = {
        title: 'Updated',
        tags: [{ name: 'JS' }],
        pictures: [{ url: 'http://new.png' }]
      };

      const updated = await repo.update({ id: 1, input });
      expect(updated).toEqual({ id: 1, title: 'Updated' });
      expect(BlogTag.destroy).toHaveBeenCalled();
      expect(BlogPicture.destroy).toHaveBeenCalled();
    });

    it('should findAllPaginated blogs', async () => {
      (Blog.count as jest.Mock).mockResolvedValue(25);
      (Blog.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(3);
    });
  });

  describe('commentsRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = commentsRepository(mockDb);
    });

    it('should findAll, findById, create, destroy, update, and findAllPaginated comments', async () => {
      const mockComment = { id: 1, reload: jest.fn().mockResolvedValue({}), destroy: jest.fn().mockResolvedValue({}) };
      (Comment.findAll as jest.Mock).mockResolvedValue([mockComment]);
      (Comment.findOne as jest.Mock).mockResolvedValue(mockComment);
      (Comment.create as jest.Mock).mockResolvedValue(mockComment);
      (Comment.destroy as jest.Mock).mockResolvedValue(1);
      (Comment.findByPk as jest.Mock).mockResolvedValue(mockComment);
      (Comment.update as jest.Mock).mockResolvedValue([[1], []]);
      (Comment.count as jest.Mock).mockResolvedValue(5);
      (Blog.findOne as jest.Mock).mockResolvedValue({ id: 1, addComment: jest.fn().mockResolvedValue({}), removeComment: jest.fn().mockResolvedValue({}) });

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([mockComment]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual(mockComment);
      expect(await repo.create({ input: { blogId: 1, content: 'Nice' } })).toBe(mockComment);
      expect(await repo.destroy({ id: 1 })).toBe(true);
      expect(await repo.update({ id: 1, input: { content: 'Updated' } })).toEqual(mockComment);

      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(1);
    });

    it('should throw error when updating missing comment', async () => {
      (Comment.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Comment with id: 99 not found');
    });
  });

  describe('authorsRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = authorsRepository(mockDb);
    });

    it('should findAll, findById, destroy, and findAllPaginated authors', async () => {
      (Author.findAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'Author 1' }]);
      (Author.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Author 1' });
      (Author.destroy as jest.Mock).mockResolvedValue(1);
      (Author.count as jest.Mock).mockResolvedValue(10);

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1, name: 'Author 1' }]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1, name: 'Author 1' });
      expect(await repo.destroy({ id: 1 })).toBe(true);

      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(1);
    });

    it('should create author with medias options', async () => {
      const mockAuthor = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Author.create as jest.Mock).mockResolvedValue(mockAuthor);

      expect(await repo.create({ input: { name: 'Author', medias: [{ url: 'http://link' }] } })).toBe(mockAuthor);
      expect(Author.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ include: { model: AuthorMedia, as: 'medias' } })
      );
    });

    it('should update author with medias or throw if missing', async () => {
      (Author.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Author with id: 99 not found');

      (Author.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Author.update as jest.Mock).mockResolvedValue([[1], []]);
      (Author.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Updated Author' });

      const updated = await repo.update({ id: 1, input: { name: 'Updated Author', medias: [{ media: 'twitter', url: 'http://t.co' }] } });
      expect(updated).toEqual({ id: 1, name: 'Updated Author' });
      expect(AuthorMedia.destroy).toHaveBeenCalled();
      expect(AuthorMedia.create).toHaveBeenCalled();
    });
  });

  describe('membersRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = membersRepository(mockDb);
    });

    it('should findAll, findById, destroy, and findAllPaginated members', async () => {
      (Member.findAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'Member 1' }]);
      (Member.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Member 1' });
      (Member.destroy as jest.Mock).mockResolvedValue(1);
      (Member.count as jest.Mock).mockResolvedValue(8);

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1, name: 'Member 1' }]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1, name: 'Member 1' });
      expect(await repo.destroy({ id: 1 })).toBe(true);

      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(1);
    });

    it('should create and update member with medias', async () => {
      const mockMember = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Member.create as jest.Mock).mockResolvedValue(mockMember);
      (Member.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Member.update as jest.Mock).mockResolvedValue([[1], []]);
      (Member.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Member Updated' });

      expect(await repo.create({ input: { name: 'Member 1', medias: [{ url: 'http://m.com' }] } })).toBe(mockMember);
      expect(Member.create).toHaveBeenCalled();

      const updated = await repo.update({ id: 1, input: { name: 'Member Updated', medias: [{ media: 'in', url: 'http://in.com' }] } });
      expect(updated).toEqual({ id: 1, name: 'Member Updated' });
      expect(MemberMedia.destroy).toHaveBeenCalled();
      expect(MemberMedia.create).toHaveBeenCalled();
    });

    it('should throw error when updating missing member', async () => {
      (Member.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Member with id: 99 not found');
    });
  });

  describe('formsRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = formsRepository(mockDb);
    });

    it('should findAll, findById, create, destroy, update, and findAllPaginated forms', async () => {
      const mockForm = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Form.findAll as jest.Mock).mockResolvedValue([mockForm]);
      (Form.findOne as jest.Mock).mockResolvedValue(mockForm);
      (Form.create as jest.Mock).mockResolvedValue(mockForm);
      (Form.destroy as jest.Mock).mockResolvedValue(1);
      (Form.findByPk as jest.Mock).mockResolvedValue(mockForm);
      (Form.update as jest.Mock).mockResolvedValue([[1], []]);
      (Form.count as jest.Mock).mockResolvedValue(3);

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([mockForm]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual(mockForm);
      expect(await repo.create({ input: { message: 'Contact' } })).toBe(mockForm);
      expect(await repo.destroy({ id: 1 })).toBe(true);
      expect(await repo.update({ id: 1, input: { message: 'Updated' } })).toEqual(mockForm);

      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(1);
    });

    it('should throw error when updating missing form', async () => {
      (Form.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Form with id: 99 not found');
    });
  });

  describe('subscribersRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = subscribersRepository(mockDb);
    });

    it('should findAll, findById, create, destroy, update, and findAllPaginated subscribers', async () => {
      const mockSub = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Subscriber.findAll as jest.Mock).mockResolvedValue([mockSub]);
      (Subscriber.findOne as jest.Mock).mockResolvedValue(mockSub);
      (Subscriber.create as jest.Mock).mockResolvedValue(mockSub);
      (Subscriber.destroy as jest.Mock).mockResolvedValue(1);
      (Subscriber.findByPk as jest.Mock).mockResolvedValue(mockSub);
      (Subscriber.update as jest.Mock).mockResolvedValue([[1], []]);
      (Subscriber.count as jest.Mock).mockResolvedValue(12);

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([mockSub]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual(mockSub);
      expect(await repo.create({ input: { email: 'sub@workix.com' } })).toBe(mockSub);
      expect(await repo.destroy({ id: 1 })).toBe(true);
      expect(await repo.update({ id: 1, input: { email: 'sub2@workix.com' } })).toEqual(mockSub);

      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(2);
    });

    it('should throw error when updating missing subscriber', async () => {
      (Subscriber.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Subscriber with id: 99 not found');
    });
  });

  describe('testimonialsRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = testimonialsRepository(mockDb);
    });

    it('should findAll, findById, create, destroy, update, and findAllPaginated testimonials', async () => {
      const mockTestimonial = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Testimonial.findAll as jest.Mock).mockResolvedValue([mockTestimonial]);
      (Testimonial.findOne as jest.Mock).mockResolvedValue(mockTestimonial);
      (Testimonial.create as jest.Mock).mockResolvedValue(mockTestimonial);
      (Testimonial.destroy as jest.Mock).mockResolvedValue(1);
      (Testimonial.findByPk as jest.Mock).mockResolvedValue(mockTestimonial);
      (Testimonial.update as jest.Mock).mockResolvedValue([[1], []]);
      (Testimonial.count as jest.Mock).mockResolvedValue(6);

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([mockTestimonial]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual(mockTestimonial);
      expect(await repo.create({ input: { content: 'Great platform' } })).toBe(mockTestimonial);
      expect(await repo.destroy({ id: 1 })).toBe(true);
      expect(await repo.update({ id: 1, input: { content: 'Updated' } })).toEqual(mockTestimonial);

      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(1);
    });

    it('should throw error when updating missing testimonial', async () => {
      (Testimonial.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Testimonial with id: 99 not found');
    });
  });
});
