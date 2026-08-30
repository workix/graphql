import hashtagsRepository, { extractHashtags } from '../../../src/modules/hashtags/repository/hashtags.repo';
import hashtagsResolvers from '../../../src/modules/hashtags/graphql/hashtags.resolvers';
import HashtagDTO from '../../../src/dtos/HashtagDTO';
import PostDTO from '../../../src/dtos/PostDTO';
import { Hashtag, PostHashtag, Mention, Post } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Hashtag: {
    findOrCreate: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  PostHashtag: {
    create: jest.fn(),
    findAll: jest.fn()
  },
  Mention: {
    create: jest.fn()
  },
  Post: {
    findAll: jest.fn()
  }
}));

describe('Hashtags Module Unit Tests (TDD)', () => {
  let mockCtx: any;
  let mockMqserver: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
    mockMqserver = { publishInQueue: jest.fn().mockResolvedValue(undefined) };
    jest.clearAllMocks();
  });

  describe('extractHashtags', () => {
    it('should extract unique lowercase hashtags from content', () => {
      const tags = extractHashtags('Hello #World, learning #GraphQL and #graphql again, no dupes! #World');
      expect(tags).toEqual(['world', 'graphql']);
    });

    it('should return empty array when there are no hashtags', () => {
      expect(extractHashtags('Just a plain post with no tags')).toEqual([]);
    });
  });

  describe('hashtagsRepository', () => {
    it('should attach hashtags found in content, reusing existing hashtag records', async () => {
      const mockHashtag = { id: 1, tag: 'graphql' };
      (Hashtag.findOrCreate as jest.Mock).mockResolvedValue([mockHashtag, true]);
      (PostHashtag.create as jest.Mock).mockResolvedValue({ id: 1, post_id: 10, hashtag_id: 1 });

      const repo = hashtagsRepository(mockCtx.orm);
      const tags = await repo.attachHashtags(10, 'Learning #GraphQL today');

      expect(Hashtag.findOrCreate).toHaveBeenCalledWith({ where: { tag: 'graphql' }, defaults: { tag: 'graphql' } });
      expect(PostHashtag.create).toHaveBeenCalledWith({ post_id: 10, hashtag_id: 1 });
      expect(tags).toEqual(['graphql']);
    });

    it('should not touch hashtag models when content has no hashtags', async () => {
      const repo = hashtagsRepository(mockCtx.orm);
      const tags = await repo.attachHashtags(10, 'No tags here');

      expect(Hashtag.findOrCreate).not.toHaveBeenCalled();
      expect(PostHashtag.create).not.toHaveBeenCalled();
      expect(tags).toEqual([]);
    });

    it('should attach mentions and publish a notification for each mentioned user', async () => {
      (Mention.create as jest.Mock).mockResolvedValue({ id: 1, post_id: 10, mentioned_user_id: 5 });

      const repo = hashtagsRepository(mockCtx.orm, mockMqserver);
      const mentions = await repo.attachMentions(10, 1, [5, 6]);

      expect(Mention.create).toHaveBeenNthCalledWith(1, { post_id: 10, mentioned_user_id: 5 });
      expect(Mention.create).toHaveBeenNthCalledWith(2, { post_id: 10, mentioned_user_id: 6 });
      expect(mockMqserver.publishInQueue).toHaveBeenCalledTimes(2);

      const [queue, payload] = mockMqserver.publishInQueue.mock.calls[0];
      expect(queue).toBe('notifications');
      expect(JSON.parse(payload)).toMatchObject({ userId: 5, type: 'MENTION', payloadData: { postId: 10, authorId: 1 } });
      expect(mentions).toEqual([5, 6]);
    });

    it('should not fail when mqserver is not provided', async () => {
      (Mention.create as jest.Mock).mockResolvedValue({ id: 1 });

      const repo = hashtagsRepository(mockCtx.orm);
      await expect(repo.attachMentions(10, 1, [5])).resolves.toEqual([5]);
    });

    it('should skip mention processing when no mentionedUserIds are provided', async () => {
      const repo = hashtagsRepository(mockCtx.orm, mockMqserver);
      const mentions = await repo.attachMentions(10, 1);

      expect(Mention.create).not.toHaveBeenCalled();
      expect(mockMqserver.publishInQueue).not.toHaveBeenCalled();
      expect(mentions).toEqual([]);
    });

    it('should process hashtags and mentions together via processPostContent', async () => {
      const mockHashtag = { id: 1, tag: 'graphql' };
      (Hashtag.findOrCreate as jest.Mock).mockResolvedValue([mockHashtag, true]);
      (PostHashtag.create as jest.Mock).mockResolvedValue({ id: 1 });
      (Mention.create as jest.Mock).mockResolvedValue({ id: 1 });

      const repo = hashtagsRepository(mockCtx.orm, mockMqserver);
      const result = await repo.processPostContent(10, 1, 'Loving #GraphQL @mention', [5]);

      expect(result).toEqual({ tags: ['graphql'], mentions: [5] });
    });

    it('should process content with no mentionedUserIds argument at all', async () => {
      const repo = hashtagsRepository(mockCtx.orm, mockMqserver);
      const result = await repo.processPostContent(10, 1, 'No tags or mentions here');

      expect(result).toEqual({ tags: [], mentions: [] });
      expect(Mention.create).not.toHaveBeenCalled();
    });

    it('should return posts for an existing hashtag', async () => {
      const mockHashtag = { id: 1, tag: 'graphql' };
      const mockLinks = [{ id: 1, post_id: 10, hashtag_id: 1 }];
      const mockPosts = [{ id: 10, content: 'Loving #GraphQL' }];

      (Hashtag.findOne as jest.Mock).mockResolvedValue(mockHashtag);
      (PostHashtag.findAll as jest.Mock).mockResolvedValue(mockLinks);
      (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

      const repo = hashtagsRepository(mockCtx.orm);
      const posts = await repo.getPostsByHashtag('GraphQL');

      expect(Hashtag.findOne).toHaveBeenCalledWith({ where: { tag: 'graphql' } });
      expect(posts).toEqual(mockPosts);
    });

    it('should return empty array when hashtag does not exist', async () => {
      (Hashtag.findOne as jest.Mock).mockResolvedValue(null);

      const repo = hashtagsRepository(mockCtx.orm);
      expect(await repo.getPostsByHashtag('unknown')).toEqual([]);
    });

    it('should return empty array when hashtag exists but has no linked posts', async () => {
      (Hashtag.findOne as jest.Mock).mockResolvedValue({ id: 2, tag: 'empty' });
      (PostHashtag.findAll as jest.Mock).mockResolvedValue([]);

      const repo = hashtagsRepository(mockCtx.orm);
      expect(await repo.getPostsByHashtag('empty')).toEqual([]);
      expect(Post.findAll).not.toHaveBeenCalled();
    });

    it('should list hashtags attached to a post', async () => {
      const mockLinks = [{ id: 1, post_id: 10, hashtag_id: 1 }];
      const mockHashtags = [{ id: 1, tag: 'graphql' }];

      (PostHashtag.findAll as jest.Mock).mockResolvedValue(mockLinks);
      (Hashtag.findAll as jest.Mock).mockResolvedValue(mockHashtags);

      const repo = hashtagsRepository(mockCtx.orm);
      const hashtags = await repo.getPostHashtags(10);

      expect(hashtags).toEqual(mockHashtags);
    });

    it('should return empty array of hashtags when post has none', async () => {
      (PostHashtag.findAll as jest.Mock).mockResolvedValue([]);

      const repo = hashtagsRepository(mockCtx.orm);
      expect(await repo.getPostHashtags(10)).toEqual([]);
      expect(Hashtag.findAll).not.toHaveBeenCalled();
    });
  });

  describe('hashtagsResolvers', () => {
    it('should resolve postsByHashtag and postHashtags queries', async () => {
      const mockHashtag = { id: 1, tag: 'graphql' };
      const mockPost = { id: 10, content: 'Loving #GraphQL' };

      (Hashtag.findOne as jest.Mock).mockResolvedValue(mockHashtag);
      (PostHashtag.findAll as jest.Mock).mockResolvedValue([{ id: 1, post_id: 10, hashtag_id: 1 }]);
      (Post.findAll as jest.Mock).mockResolvedValue([mockPost]);
      (Hashtag.findAll as jest.Mock).mockResolvedValue([mockHashtag]);

      const q = hashtagsResolvers.Query;

      const posts = await q.postsByHashtag(null, { tag: 'graphql' }, mockCtx, {});
      expect(posts[0]).toBeInstanceOf(PostDTO);

      const hashtags = await q.postHashtags(null, { postId: 10 }, mockCtx, {});
      expect(hashtags[0]).toBeInstanceOf(HashtagDTO);
    });
  });

  describe('DTO null check', () => {
    it('should handle null input gracefully', () => {
      const hNull = new HashtagDTO(null);
      expect(hNull.id).toBeUndefined();
    });

    it('should map camelCase fields when snake_case is absent', () => {
      const now = new Date();
      const h = new HashtagDTO({ id: 1, tag: 'graphql', createdAt: now });
      expect(h.tag).toBe('graphql');
      expect(h.createdAt).toBe(now);
    });
  });
});
