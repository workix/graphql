import postsRepository from '../repository/posts.repo';
import hashtagsRepository from '../../hashtags/repository/hashtags.repo';
import PostDTO from '../../../dtos/PostDTO';
import PostReactionDTO from '../../../dtos/PostReactionDTO';
import PostCommentDTO from '../../../dtos/PostCommentDTO';
import UserDTO from '../../../dtos/UserDTO';

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
      const comment = await postsRepository(ctx.orm).commentOnPost(args.postId, args.authorId, args.content, args.parentId);
      return new PostCommentDTO(comment);
    }
  },
  Post: {
    author: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.authorId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.authorId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    reactionsCount: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return 0;
      return await postsRepository(ctx.orm).getReactionsCount(parent.id);
    },
    commentsCount: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return 0;
      return await postsRepository(ctx.orm).getCommentsCount(parent.id);
    },
    userReaction: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return null;
      const userId = args.userId || (ctx.user ? ctx.user.id : null);
      if (!userId) return null;
      return await postsRepository(ctx.orm).getUserReaction(parent.id, userId);
    },
    reactions: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return [];
      const reactions = await postsRepository(ctx.orm).getPostReactions(parent.id);
      return reactions.map((r: any) => new PostReactionDTO(r));
    },
    comments: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return [];
      const comments = await postsRepository(ctx.orm).getPostComments(parent.id);
      return comments.map((c: any) => new PostCommentDTO(c));
    }
  },
  PostReaction: {
    user: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.userId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    }
  },
  PostComment: {
    author: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.authorId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.authorId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    parent: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.parentId) return null;
      const comments = await postsRepository(ctx.orm).getPostComments(parent.postId);
      const found = comments.find((c: any) => c.id === parent.parentId);
      return found ? new PostCommentDTO(found) : null;
    },
    replies: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.id) return [];
      const replies = await postsRepository(ctx.orm).getCommentReplies(parent.id);
      return replies.map((r: any) => new PostCommentDTO(r));
    }
  }
};

export default postsResolvers;

