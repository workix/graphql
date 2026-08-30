import analyticsRepository from '../../../src/modules/analytics/repository/analytics.repo';
import analyticsResolvers from '../../../src/modules/analytics/graphql/analytics.resolvers';
import ProfileViewDTO from '../../../src/dtos/ProfileViewDTO';
import PostAnalyticsDTO from '../../../src/dtos/PostAnalyticsDTO';
import { ProfileView, PostAnalytics } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  ProfileView: {
    create: jest.fn(),
    findAll: jest.fn()
  },
  PostAnalytics: {
    create: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('Analytics Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
    jest.clearAllMocks();
  });

  describe('analyticsRepository', () => {
    it('should record a profile view from another user', async () => {
      const mockView = { id: 1, viewed_id: 1, viewer_id: 2 };
      (ProfileView.create as jest.Mock).mockResolvedValue(mockView);

      const repo = analyticsRepository(mockCtx.orm);
      const res = await repo.recordProfileView(1, 2);

      expect(ProfileView.create).toHaveBeenCalledWith({ viewed_id: 1, viewer_id: 2 });
      expect(res).toEqual(mockView);
    });

    it('should throw error when user views their own profile', async () => {
      const repo = analyticsRepository(mockCtx.orm);

      await expect(repo.recordProfileView(1, 1)).rejects.toThrow('Cannot record a view of your own profile');
      expect(ProfileView.create).not.toHaveBeenCalled();
    });

    it('should list who viewed a profile', async () => {
      const mockViews = [{ id: 1, viewed_id: 1, viewer_id: 2 }];
      (ProfileView.findAll as jest.Mock).mockResolvedValue(mockViews);

      const repo = analyticsRepository(mockCtx.orm);
      const res = await repo.getProfileViews(1);

      expect(res).toEqual(mockViews);
    });

    it('should create post analytics on first view', async () => {
      const mockAnalytics = { id: 1, post_id: 10, views_count: 1, shares_count: 0 };
      (PostAnalytics.findOne as jest.Mock).mockResolvedValue(null);
      (PostAnalytics.create as jest.Mock).mockResolvedValue(mockAnalytics);

      const repo = analyticsRepository(mockCtx.orm);
      const res = await repo.recordPostView(10);

      expect(PostAnalytics.create).toHaveBeenCalledWith({ post_id: 10, views_count: 1, shares_count: 0 });
      expect(res).toEqual(mockAnalytics);
    });

    it('should increment views_count when post analytics already exists', async () => {
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockAnalytics = { id: 1, post_id: 10, views_count: 3, shares_count: 1, update: mockUpdate };
      (PostAnalytics.findOne as jest.Mock).mockResolvedValue(mockAnalytics);

      const repo = analyticsRepository(mockCtx.orm);
      const res = await repo.recordPostView(10);

      expect(mockUpdate).toHaveBeenCalledWith({ views_count: 4 });
      expect(res.views_count).toBe(4);
    });

    it('should create post analytics on first share', async () => {
      const mockAnalytics = { id: 1, post_id: 10, views_count: 0, shares_count: 1 };
      (PostAnalytics.findOne as jest.Mock).mockResolvedValue(null);
      (PostAnalytics.create as jest.Mock).mockResolvedValue(mockAnalytics);

      const repo = analyticsRepository(mockCtx.orm);
      const res = await repo.recordPostShare(10);

      expect(PostAnalytics.create).toHaveBeenCalledWith({ post_id: 10, views_count: 0, shares_count: 1 });
      expect(res).toEqual(mockAnalytics);
    });

    it('should increment shares_count when post analytics already exists', async () => {
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockAnalytics = { id: 1, post_id: 10, views_count: 3, shares_count: 1, update: mockUpdate };
      (PostAnalytics.findOne as jest.Mock).mockResolvedValue(mockAnalytics);

      const repo = analyticsRepository(mockCtx.orm);
      const res = await repo.recordPostShare(10);

      expect(mockUpdate).toHaveBeenCalledWith({ shares_count: 2 });
      expect(res.shares_count).toBe(2);
    });

    it('should get post analytics by post id', async () => {
      const mockAnalytics = { id: 1, post_id: 10, views_count: 3, shares_count: 1 };
      (PostAnalytics.findOne as jest.Mock).mockResolvedValue(mockAnalytics);

      const repo = analyticsRepository(mockCtx.orm);
      const res = await repo.getPostAnalytics(10);

      expect(res).toEqual(mockAnalytics);
    });
  });

  describe('analyticsResolvers', () => {
    it('should resolve queries and mutations for analytics', async () => {
      const mockView = { id: 1, viewed_id: 1, viewer_id: 2 };
      const mockAnalytics = {
        id: 1,
        post_id: 10,
        views_count: 1,
        shares_count: 0,
        update: jest.fn().mockResolvedValue(true)
      };

      (ProfileView.create as jest.Mock).mockResolvedValue(mockView);
      (ProfileView.findAll as jest.Mock).mockResolvedValue([mockView]);
      (PostAnalytics.findOne as jest.Mock).mockResolvedValue(mockAnalytics);
      (PostAnalytics.create as jest.Mock).mockResolvedValue(mockAnalytics);

      const q = analyticsResolvers.Query;
      const m = analyticsResolvers.Mutation;

      const views = await q.whoViewedMyProfile(null, { userId: 1 }, mockCtx, {});
      expect(views[0]).toBeInstanceOf(ProfileViewDTO);

      const analytics = await q.postAnalytics(null, { postId: 10 }, mockCtx, {});
      expect(analytics).toBeInstanceOf(PostAnalyticsDTO);

      const recordedView = await m.recordProfileView(null, { viewedId: 1, viewerId: 2 }, mockCtx, {});
      expect(recordedView).toBeInstanceOf(ProfileViewDTO);

      const viewed = await m.recordPostView(null, { postId: 10 }, mockCtx, {});
      expect(viewed).toBeInstanceOf(PostAnalyticsDTO);

      const shared = await m.recordPostShare(null, { postId: 10 }, mockCtx, {});
      expect(shared).toBeInstanceOf(PostAnalyticsDTO);
    });

    it('should return null for postAnalytics query when no analytics exist yet', async () => {
      (PostAnalytics.findOne as jest.Mock).mockResolvedValue(null);
      const q = analyticsResolvers.Query;

      const res = await q.postAnalytics(null, { postId: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('DTOs null check', () => {
    it('should handle null input gracefully', () => {
      const vNull = new ProfileViewDTO(null);
      expect(vNull.id).toBeUndefined();

      const aNull = new PostAnalyticsDTO(null);
      expect(aNull.id).toBeUndefined();
    });

    it('should map camelCase fields when snake_case is absent', () => {
      const now = new Date();
      const v = new ProfileViewDTO({ id: 2, viewedId: 5, viewerId: 6, viewedAt: now });
      expect(v.viewedId).toBe(5);
      expect(v.viewerId).toBe(6);
      expect(v.viewedAt).toBe(now);

      const a = new PostAnalyticsDTO({
        id: 3,
        postId: 10,
        viewsCount: 4,
        sharesCount: 1,
        createdAt: now,
        updatedAt: now
      });
      expect(a.postId).toBe(10);
      expect(a.viewsCount).toBe(4);
      expect(a.sharesCount).toBe(1);
      expect(a.createdAt).toBe(now);
      expect(a.updatedAt).toBe(now);
    });
  });
});
