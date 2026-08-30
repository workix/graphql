import socialSellingRepository, { scaleScore } from '../../../src/modules/social_selling/repository/social_selling.repo';
import socialSellingResolvers from '../../../src/modules/social_selling/graphql/social_selling.resolvers';
import SocialSellingScoreDTO from '../../../src/dtos/SocialSellingScoreDTO';
import { Post, Connection, PostReaction, PostComment, DirectMessage, SocialSellingScore } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Post: {
    count: jest.fn(),
    findAll: jest.fn()
  },
  Connection: {
    count: jest.fn()
  },
  PostReaction: {
    count: jest.fn()
  },
  PostComment: {
    count: jest.fn()
  },
  DirectMessage: {
    count: jest.fn()
  },
  SocialSellingScore: {
    create: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('Social Selling Index Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: { Sequelize: { Op: { or: Symbol('or') } } } };
    jest.clearAllMocks();
  });

  describe('scaleScore', () => {
    it('should scale a count linearly with a factor', () => {
      expect(scaleScore(10, 2)).toBe(20);
    });

    it('should cap the score at 100', () => {
      expect(scaleScore(1000, 5)).toBe(100);
    });
  });

  describe('socialSellingRepository', () => {
    it('should calculate and create a new score when user has no engagement history', async () => {
      (Post.count as jest.Mock).mockResolvedValue(0);
      (Connection.count as jest.Mock).mockResolvedValue(0);
      (Post.findAll as jest.Mock).mockResolvedValue([]);
      (DirectMessage.count as jest.Mock).mockResolvedValue(0);
      (SocialSellingScore.findOne as jest.Mock).mockResolvedValue(null);
      const mockScore = { id: 1, user_id: 10, score: 0 };
      (SocialSellingScore.create as jest.Mock).mockResolvedValue(mockScore);

      const repo = socialSellingRepository(mockCtx.orm);
      const res = await repo.calculateScore(10);

      expect(PostReaction.count).not.toHaveBeenCalled();
      expect(PostComment.count).not.toHaveBeenCalled();
      expect(SocialSellingScore.create).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 10,
        score: 0,
        posts_score: 0,
        network_score: 0,
        engagement_score: 0,
        relationships_score: 0
      }));
      expect(res).toEqual(mockScore);
    });

    it('should include engagement counts when user has posts', async () => {
      (Post.count as jest.Mock).mockResolvedValue(4);
      (Connection.count as jest.Mock).mockResolvedValue(10);
      (Post.findAll as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);
      (PostReaction.count as jest.Mock).mockResolvedValue(5);
      (PostComment.count as jest.Mock).mockResolvedValue(3);
      (DirectMessage.count as jest.Mock).mockResolvedValue(6);
      (SocialSellingScore.findOne as jest.Mock).mockResolvedValue(null);
      const mockScore = { id: 1, user_id: 10 };
      (SocialSellingScore.create as jest.Mock).mockResolvedValue(mockScore);

      const repo = socialSellingRepository(mockCtx.orm);
      await repo.calculateScore(10);

      expect(SocialSellingScore.create).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 10,
        posts_score: 20,
        network_score: 20,
        engagement_score: 16,
        relationships_score: 12,
        score: 17
      }));
    });

    it('should update an existing score record instead of creating a new one', async () => {
      (Post.count as jest.Mock).mockResolvedValue(0);
      (Connection.count as jest.Mock).mockResolvedValue(0);
      (Post.findAll as jest.Mock).mockResolvedValue([]);
      (DirectMessage.count as jest.Mock).mockResolvedValue(0);

      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockExisting = { id: 1, user_id: 10, score: 40, update: mockUpdate };
      (SocialSellingScore.findOne as jest.Mock).mockResolvedValue(mockExisting);

      const repo = socialSellingRepository(mockCtx.orm);
      const res = await repo.calculateScore(10);

      expect(SocialSellingScore.create).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ score: 0 }));
      expect(res.score).toBe(0);
    });

    it('should fall back to the $or string operator when Sequelize.Op is unavailable', async () => {
      (Post.count as jest.Mock).mockResolvedValue(0);
      (Connection.count as jest.Mock).mockResolvedValue(0);
      (Post.findAll as jest.Mock).mockResolvedValue([]);
      (DirectMessage.count as jest.Mock).mockResolvedValue(0);
      (SocialSellingScore.findOne as jest.Mock).mockResolvedValue(null);
      (SocialSellingScore.create as jest.Mock).mockResolvedValue({ id: 1, user_id: 10 });

      const repo = socialSellingRepository({});
      await repo.calculateScore(10);

      expect(Connection.count).toHaveBeenCalledWith({ where: { $or: [{ user_id_1: 10 }, { user_id_2: 10 }] } });
    });

    it('should get the latest score for a user', async () => {
      const mockScore = { id: 1, user_id: 10, score: 42 };
      (SocialSellingScore.findOne as jest.Mock).mockResolvedValue(mockScore);

      const repo = socialSellingRepository(mockCtx.orm);
      expect(await repo.getLatestScore(10)).toEqual(mockScore);
    });
  });

  describe('socialSellingResolvers', () => {
    it('should resolve mySocialSellingIndex query and recalculateSocialSellingIndex mutation', async () => {
      const mockScore = { id: 1, user_id: 10, score: 42, update: jest.fn().mockResolvedValue(true) };
      (SocialSellingScore.findOne as jest.Mock).mockResolvedValue(mockScore);
      (Post.count as jest.Mock).mockResolvedValue(0);
      (Connection.count as jest.Mock).mockResolvedValue(0);
      (Post.findAll as jest.Mock).mockResolvedValue([]);
      (DirectMessage.count as jest.Mock).mockResolvedValue(0);
      (SocialSellingScore.create as jest.Mock).mockResolvedValue(mockScore);

      const q = socialSellingResolvers.Query;
      const m = socialSellingResolvers.Mutation;

      const score = await q.mySocialSellingIndex(null, { userId: 10 }, mockCtx, {});
      expect(score).toBeInstanceOf(SocialSellingScoreDTO);

      const recalculated = await m.recalculateSocialSellingIndex(null, { userId: 10 }, mockCtx, {});
      expect(recalculated).toBeInstanceOf(SocialSellingScoreDTO);
    });

    it('should return null for mySocialSellingIndex when no score was ever calculated', async () => {
      (SocialSellingScore.findOne as jest.Mock).mockResolvedValue(null);
      const q = socialSellingResolvers.Query;

      const res = await q.mySocialSellingIndex(null, { userId: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('DTO null check', () => {
    it('should handle null input gracefully', () => {
      expect(new SocialSellingScoreDTO(null).id).toBeUndefined();
    });

    it('should map camelCase fields when snake_case is absent', () => {
      const now = new Date();
      const dto = new SocialSellingScoreDTO({
        id: 1,
        userId: 10,
        score: 42,
        postsScore: 20,
        networkScore: 20,
        engagementScore: 16,
        relationshipsScore: 12,
        calculatedAt: now
      });
      expect(dto.userId).toBe(10);
      expect(dto.postsScore).toBe(20);
      expect(dto.networkScore).toBe(20);
      expect(dto.engagementScore).toBe(16);
      expect(dto.relationshipsScore).toBe(12);
      expect(dto.calculatedAt).toBe(now);
    });
  });
});
