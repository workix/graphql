import analyticsRepository from '../repository/analytics.repo';
import ProfileViewDTO from '../../../dtos/ProfileViewDTO';
import PostAnalyticsDTO from '../../../dtos/PostAnalyticsDTO';

const analyticsResolvers = {
  Query: {
    whoViewedMyProfile: async (parent: any, args: any, ctx: any, info: any) => {
      const views = await analyticsRepository(ctx.orm).getProfileViews(args.userId, args.limit, args.offset);
      return views.map((v: any) => new ProfileViewDTO(v));
    },
    postAnalytics: async (parent: any, args: any, ctx: any, info: any) => {
      const analytics = await analyticsRepository(ctx.orm).getPostAnalytics(args.postId);
      return analytics ? new PostAnalyticsDTO(analytics) : null;
    }
  },
  Mutation: {
    recordProfileView: async (parent: any, args: any, ctx: any, info: any) => {
      const view = await analyticsRepository(ctx.orm).recordProfileView(args.viewedId, args.viewerId);
      return new ProfileViewDTO(view);
    },
    recordPostView: async (parent: any, args: any, ctx: any, info: any) => {
      const analytics = await analyticsRepository(ctx.orm).recordPostView(args.postId);
      return new PostAnalyticsDTO(analytics);
    },
    recordPostShare: async (parent: any, args: any, ctx: any, info: any) => {
      const analytics = await analyticsRepository(ctx.orm).recordPostShare(args.postId);
      return new PostAnalyticsDTO(analytics);
    }
  }
};

export default analyticsResolvers;
