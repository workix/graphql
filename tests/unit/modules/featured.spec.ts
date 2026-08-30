import featuredRepository from '../../../src/modules/featured/repository/featured.repo';
import featuredResolvers from '../../../src/modules/featured/graphql/featured.resolvers';
import FeaturedItemDTO from '../../../src/dtos/FeaturedItemDTO';
import PostDTO from '../../../src/dtos/PostDTO';
import { FeaturedItem, Post, Connection } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  FeaturedItem: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  Post: {
    findAll: jest.fn()
  },
  Connection: {
    findAll: jest.fn()
  }
}));

describe('Featured Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      orm: {
        Sequelize: { Op: { or: Symbol('or') } }
      }
    };
  });

  describe('featuredRepository', () => {
    it('should throw error for invalid featured item type', async () => {
      const repo = featuredRepository(mockCtx.orm);
      await expect(repo.addFeaturedItem(10, 'INVALID', 'Title')).rejects.toThrow('Invalid featured item type INVALID');
    });

    it('should add valid featured item', async () => {
      const mockItem = { id: 1, user_id: 10, type: 'POST', title: 'My Top Post' };
      (FeaturedItem.create as jest.Mock).mockResolvedValue(mockItem);

      const repo = featuredRepository(mockCtx.orm);
      const res = await repo.addFeaturedItem(10, 'POST', 'My Top Post');

      expect(res).toEqual(mockItem);
    });

    it('should remove featured item', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      (FeaturedItem.findOne as jest.Mock).mockResolvedValue({ destroy: mockDestroy });

      const repo = featuredRepository(mockCtx.orm);
      expect(await repo.removeFeaturedItem(1, 10)).toBe(true);

      (FeaturedItem.findOne as jest.Mock).mockResolvedValue(null);
      expect(await repo.removeFeaturedItem(99, 10)).toBe(false);
    });

    it('should get user featured items', async () => {
      const mockItems = [{ id: 1, user_id: 10, type: 'ARTICLE', title: 'My Article' }];
      (FeaturedItem.findAll as jest.Mock).mockResolvedValue(mockItems);

      const repo = featuredRepository(mockCtx.orm);
      expect(await repo.getUserFeaturedItems(10)).toEqual(mockItems);
    });

    it('should get ranked social feed prioritizing direct connections', async () => {
      const mockConns = [{ user_id_1: 10, user_id_2: 20 }];
      (Connection.findAll as jest.Mock).mockResolvedValue(mockConns);

      const mockPosts = [
        { dataValues: { id: 1, author_id: 30, content: 'Non-friend' }, created_at: new Date() },
        { dataValues: { id: 2, author_id: 20, content: 'Friend post' }, created_at: new Date() }
      ];
      (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

      const repo = featuredRepository(mockCtx.orm);
      const ranked = await repo.getRankedFeed(10);

      expect(ranked[0].id).toBe(2); // Friend post ranked first
    });
  });

  describe('featuredResolvers', () => {
    it('should resolve queries and mutations for featured items and ranked feed', async () => {
      const mockItem = { id: 1, user_id: 10, type: 'LINK', title: 'My Site' };
      const mockPost = { id: 1, author_id: 10, content: 'Post', dataValues: { id: 1, author_id: 10, content: 'Post' } };

      (FeaturedItem.findAll as jest.Mock).mockResolvedValue([mockItem]);
      (Connection.findAll as jest.Mock).mockResolvedValue([]);
      (Post.findAll as jest.Mock).mockResolvedValue([mockPost]);
      (FeaturedItem.create as jest.Mock).mockResolvedValue(mockItem);
      (FeaturedItem.findOne as jest.Mock).mockResolvedValue({ destroy: jest.fn().mockResolvedValue(true) });

      const q = featuredResolvers.Query;
      const m = featuredResolvers.Mutation;

      const items = await q.userFeaturedItems(null, { userId: 10 }, mockCtx, {});
      expect(items[0]).toBeInstanceOf(FeaturedItemDTO);

      const feed = await q.rankedSocialFeed(null, { userId: 10 }, mockCtx, {});
      expect(feed[0]).toBeInstanceOf(PostDTO);

      const added = await m.addFeaturedItem(null, { userId: 10, type: 'LINK', title: 'My Site' }, mockCtx, {});
      expect(added).toBeInstanceOf(FeaturedItemDTO);

      const removed = await m.removeFeaturedItem(null, { id: 1, userId: 10 }, mockCtx, {});
      expect(removed).toBe(true);
    });
  });

  describe('FeaturedItemDTO null check', () => {
    it('should handle null input gracefully', () => {
      const dto = new FeaturedItemDTO(null);
      expect(dto.id).toBeUndefined();
    });
  });
});
