import postsRepository from '../../../src/modules/posts/repository/posts.repo';
import postsResolvers from '../../../src/modules/posts/graphql/posts.resolvers';
import PostDTO from '../../../src/dtos/PostDTO';
import PostReactionDTO from '../../../src/dtos/PostReactionDTO';
import PostCommentDTO from '../../../src/dtos/PostCommentDTO';
import { Post, PostReaction, PostComment, Connection } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Post: {
    create: jest.fn(),
    findAll: jest.fn()
  },
  PostReaction: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  PostComment: {
    create: jest.fn(),
    findAll: jest.fn()
  },
  Connection: {
    findAll: jest.fn()
  }
}));

describe('Posts Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      orm: {
        Sequelize: { Op: { or: Symbol('or') } }
      }
    };
  });

  describe('postsRepository', () => {
    it('should create post with mediaIds array', async () => {
      const mockPost = { id: 1, author_id: 10, content: 'Hello', media_ids: '[1,2]' };
      (Post.create as jest.Mock).mockResolvedValue(mockPost);

      const repo = postsRepository(mockCtx.orm);
      const created = await repo.createPost(10, 'Hello', [1, 2]);

      expect(created).toEqual(mockPost);
    });

    it('should get feed of user and connections', async () => {
      const mockConns = [{ user_id_1: 10, user_id_2: 20 }];
      (Connection.findAll as jest.Mock).mockResolvedValue(mockConns);

      const mockPosts = [{ id: 1, author_id: 20, content: 'Friend post' }];
      (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

      const repo = postsRepository(mockCtx.orm);
      const feed = await repo.getFeed(10);

      expect(feed).toEqual(mockPosts);
    });

    it('should throw error for invalid reaction type', async () => {
      const repo = postsRepository(mockCtx.orm);
      await expect(repo.reactToPost(1, 10, 'INVALID')).rejects.toThrow('Invalid reaction type INVALID');
    });

    it('should add reaction or update existing reaction or toggle remove reaction if same type', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });

      const mockExisting = { id: 1, post_id: 1, user_id: 10, type: 'LIKE', destroy: mockDestroy, update: mockUpdate };
      const repo = postsRepository(mockCtx.orm);

      // Toggle remove (same reaction type)
      (PostReaction.findOne as jest.Mock).mockResolvedValueOnce(mockExisting);
      const resToggle = await repo.reactToPost(1, 10, 'LIKE');
      expect(mockDestroy).toHaveBeenCalled();
      expect(resToggle).toBeNull();

      // Change reaction type
      (PostReaction.findOne as jest.Mock).mockResolvedValueOnce(mockExisting);
      const resChange = await repo.reactToPost(1, 10, 'CELEBRATE');
      expect(mockUpdate).toHaveBeenCalledWith({ type: 'CELEBRATE' });

      // Create new reaction
      (PostReaction.findOne as jest.Mock).mockResolvedValueOnce(null);
      (PostReaction.create as jest.Mock).mockResolvedValueOnce(mockExisting);
      const resNew = await repo.reactToPost(1, 10, 'LOVE');
      expect(resNew).toEqual(mockExisting);
    });

    it('should comment on post and query reactions/comments', async () => {
      const mockComment = { id: 1, post_id: 1, author_id: 10, content: 'Nice!' };
      (PostComment.create as jest.Mock).mockResolvedValue(mockComment);
      (PostComment.findAll as jest.Mock).mockResolvedValue([mockComment]);
      (PostReaction.findAll as jest.Mock).mockResolvedValue([{ id: 1, type: 'LIKE' }]);

      const repo = postsRepository(mockCtx.orm);

      const createdComment = await repo.commentOnPost(1, 10, 'Nice!');
      expect(createdComment).toEqual(mockComment);

      const comments = await repo.getPostComments(1);
      expect(comments).toEqual([mockComment]);

      const reactions = await repo.getPostReactions(1);
      expect(reactions).toHaveLength(1);
    });
  });

  describe('postsResolvers', () => {
    it('should resolve queries and mutations for posts', async () => {
      const mockPost = { id: 1, author_id: 10, content: 'Test', media_ids: null };
      const mockReaction = { id: 1, post_id: 1, user_id: 10, type: 'LIKE' };
      const mockComment = { id: 1, post_id: 1, author_id: 10, content: 'Comment' };

      (Connection.findAll as jest.Mock).mockResolvedValue([]);
      (Post.findAll as jest.Mock).mockResolvedValue([mockPost]);
      (Post.create as jest.Mock).mockResolvedValue(mockPost);
      (PostReaction.findAll as jest.Mock).mockResolvedValue([mockReaction]);
      (PostComment.findAll as jest.Mock).mockResolvedValue([mockComment]);
      (PostComment.create as jest.Mock).mockResolvedValue(mockComment);
      (PostReaction.findOne as jest.Mock).mockResolvedValue(null);
      (PostReaction.create as jest.Mock).mockResolvedValue(mockReaction);

      const q = postsResolvers.Query;
      const m = postsResolvers.Mutation;

      const feed = await q.socialFeed(null, { userId: 10 }, mockCtx, {});
      expect(feed[0]).toBeInstanceOf(PostDTO);

      const reactions = await q.postReactions(null, { postId: 1 }, mockCtx, {});
      expect(reactions[0]).toBeInstanceOf(PostReactionDTO);

      const comments = await q.postComments(null, { postId: 1 }, mockCtx, {});
      expect(comments[0]).toBeInstanceOf(PostCommentDTO);

      const createdPost = await m.createPost(null, { authorId: 10, content: 'Test' }, mockCtx, {});
      expect(createdPost).toBeInstanceOf(PostDTO);

      const reacted = await m.reactToPost(null, { postId: 1, userId: 10, type: 'LIKE' }, mockCtx, {});
      expect(reacted).toBeInstanceOf(PostReactionDTO);

      const commented = await m.commentOnPost(null, { postId: 1, authorId: 10, content: 'Comment' }, mockCtx, {});
      expect(commented).toBeInstanceOf(PostCommentDTO);
    });
  });

  describe('DTOs handling null and invalid json', () => {
    it('should handle null and malformed media_ids gracefully', () => {
      const pNull = new PostDTO(null);
      expect(pNull.id).toBeUndefined();

      const pInvalidJson = new PostDTO({ id: 1, media_ids: 'invalid-json' });
      expect(pInvalidJson.mediaIds).toEqual([]);

      const pArr = new PostDTO({ id: 1, media_ids: [1, 2] });
      expect(pArr.mediaIds).toEqual([1, 2]);

      const rNull = new PostReactionDTO(null);
      expect(rNull.id).toBeUndefined();

      const cNull = new PostCommentDTO(null);
      expect(cNull.id).toBeUndefined();
    });
  });
});
