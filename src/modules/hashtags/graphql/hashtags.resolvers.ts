import hashtagsRepository from '../repository/hashtags.repo';
import HashtagDTO from '../../../dtos/HashtagDTO';
import PostDTO from '../../../dtos/PostDTO';

const hashtagsResolvers = {
  Query: {
    postsByHashtag: async (parent: any, args: any, ctx: any, info: any) => {
      const posts = await hashtagsRepository(ctx.orm).getPostsByHashtag(args.tag, args.limit, args.offset);
      return posts.map((p: any) => new PostDTO(p));
    },
    postHashtags: async (parent: any, args: any, ctx: any, info: any) => {
      const hashtags = await hashtagsRepository(ctx.orm).getPostHashtags(args.postId);
      return hashtags.map((h: any) => new HashtagDTO(h));
    }
  }
};

export default hashtagsResolvers;
