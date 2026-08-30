import featuredRepository from '../repository/featured.repo';
import FeaturedItemDTO from '../../../dtos/FeaturedItemDTO';
import PostDTO from '../../../dtos/PostDTO';

const featuredResolvers = {
  Query: {
    userFeaturedItems: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await featuredRepository(ctx.orm).getUserFeaturedItems(args.userId);
      return list.map((i: any) => new FeaturedItemDTO(i));
    },
    rankedSocialFeed: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await featuredRepository(ctx.orm).getRankedFeed(args.userId, args.limit, args.offset);
      return list.map((p: any) => new PostDTO(p));
    }
  },
  Mutation: {
    addFeaturedItem: async (parent: any, args: any, ctx: any, info: any) => {
      const item = await featuredRepository(ctx.orm).addFeaturedItem(
        args.userId,
        args.type,
        args.title,
        args.url,
        args.mediaId
      );
      return new FeaturedItemDTO(item);
    },
    removeFeaturedItem: async (parent: any, args: any, ctx: any, info: any) => {
      const res = await featuredRepository(ctx.orm).removeFeaturedItem(args.id, args.userId);
      return res;
    }
  }
};

export default featuredResolvers;
