import postsRepository from '../repository/posts.repo';
import hashtagsRepository from '../../hashtags/repository/hashtags.repo';
import PostDTO from '../../../dtos/PostDTO';
import PostReactionDTO from '../../../dtos/PostReactionDTO';
import PostCommentDTO from '../../../dtos/PostCommentDTO';

const postsResolvers = {
  Query: {
    socialFeed: async (parent: any, args: any, ctx: any, info: any) => {
      const posts = await postsRepository(ctx.orm).getFeed(args.userId, args.limit, args.offset);
      return posts.map((p: any) => new PostDTO(p));
    },
    postReactions: async (parent: any, args: any, ctx: any, info: any) => {
      const reactions = await postsRepository(ctx.orm).getPostReactions(args.postId);
      return reactions.map((r: any) => new PostReactionDTO(r));
    },
    postComments: async (parent: any, args: any, ctx: any, info: any) => {
      const comments = await postsRepository(ctx.orm).getPostComments(args.postId);
      return comments.map((c: any) => new PostCommentDTO(c));
    }
  },
  Mutation: {
    createPost: async (parent: any, args: any, ctx: any, info: any) => {
      const post = await postsRepository(ctx.orm).createPost(args.authorId, args.content, args.mediaIds);
      await hashtagsRepository(ctx.orm, ctx.mqserver).processPostContent(
        post.id,
        args.authorId,
        args.content,
        args.mentionedUserIds
      );
      return new PostDTO(post);
    },
    reactToPost: async (parent: any, args: any, ctx: any, info: any) => {
      const reaction = await postsRepository(ctx.orm).reactToPost(args.postId, args.userId, args.type);
      return reaction ? new PostReactionDTO(reaction) : null;
    },
    commentOnPost: async (parent: any, args: any, ctx: any, info: any) => {
      const comment = await postsRepository(ctx.orm).commentOnPost(args.postId, args.authorId, args.content);
      return new PostCommentDTO(comment);
    }
  }
};

export default postsResolvers;
