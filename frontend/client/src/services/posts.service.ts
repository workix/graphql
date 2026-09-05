import graphqlClient from './graphql';

export interface PostModel {
  id: string | number;
  authorId: string | number;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  mediaIds?: (string | number)[];
  mediaUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
  reactionsCount?: number;
  commentsCount?: number;
  userReaction?: string | null;
}

export interface PostReactionModel {
  id: string | number;
  postId: string | number;
  userId: string | number;
  type: 'LIKE' | 'CELEBRATE' | 'SUPPORT' | 'LOVE' | 'INSIGHTFUL' | 'FUNNY' | string;
  createdAt?: string;
}

export interface PostCommentModel {
  id: string | number;
  postId: string | number;
  authorId: string | number;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  parentId?: string | number | null;
  replies?: PostCommentModel[];
  createdAt?: string;
}

export const postsService = {
  async getSocialFeed(userId: string | number, limit = 20, offset = 0): Promise<PostModel[]> {
    const query = `
      query SocialFeed($userId: ID!, $limit: Int, $offset: Int) {
        socialFeed(userId: $userId, limit: $limit, offset: $offset) {
          id
          authorId
          author {
            id
            name
            role
            photoUrl
          }
          content
          mediaIds
          reactionsCount
          commentsCount
          userReaction(userId: $userId)
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ socialFeed: any[] }>(query, {
        userId: String(userId),
        limit,
        offset
      });

      return (data.socialFeed || []).map((p) => ({
        id: p.id,
        authorId: p.authorId,
        authorName: p.author?.name,
        authorRole: p.author?.role,
        authorAvatar: p.author?.photoUrl,
        content: p.content,
        mediaIds: p.mediaIds,
        reactionsCount: p.reactionsCount || 0,
        commentsCount: p.commentsCount || 0,
        userReaction: p.userReaction || null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));
    } catch (err) {
      console.warn('Erro ao carregar socialFeed do GraphQL:', err);
      return [];
    }
  },

  async getRankedSocialFeed(userId: string | number, limit = 20, offset = 0): Promise<PostModel[]> {
    const query = `
      query RankedSocialFeed($userId: ID!, $limit: Int, $offset: Int) {
        rankedSocialFeed(userId: $userId, limit: $limit, offset: $offset) {
          id
          authorId
          author {
            id
            name
            role
            photoUrl
          }
          content
          mediaIds
          reactionsCount
          commentsCount
          userReaction(userId: $userId)
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ rankedSocialFeed: any[] }>(query, {
        userId: String(userId),
        limit,
        offset
      });

      if (!data.rankedSocialFeed) {
        return this.getSocialFeed(userId, limit, offset);
      }

      return data.rankedSocialFeed.map((p) => ({
        id: p.id,
        authorId: p.authorId,
        authorName: p.author?.name,
        authorRole: p.author?.role,
        authorAvatar: p.author?.photoUrl,
        content: p.content,
        mediaIds: p.mediaIds,
        reactionsCount: p.reactionsCount || 0,
        commentsCount: p.commentsCount || 0,
        userReaction: p.userReaction || null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));
    } catch (err) {
      console.warn('Fallback para socialFeed ao falhar rankedSocialFeed:', err);
      return this.getSocialFeed(userId, limit, offset);
    }
  },

  async getPostReactions(postId: string | number): Promise<PostReactionModel[]> {
    const query = `
      query PostReactions($postId: ID!) {
        postReactions(postId: $postId) {
          id
          postId
          userId
          type
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ postReactions: PostReactionModel[] }>(query, {
        postId: String(postId)
      });
      return data.postReactions || [];
    } catch (err) {
      console.warn('Erro ao obter reações do post:', err);
      return [];
    }
  },

  async getPostComments(postId: string | number): Promise<PostCommentModel[]> {
    const query = `
      query PostComments($postId: ID!) {
        postComments(postId: $postId) {
          id
          postId
          authorId
          author {
            id
            name
            role
            photoUrl
          }
          content
          parentId
          replies {
            id
            postId
            authorId
            author {
              id
              name
              role
              photoUrl
            }
            content
            parentId
            createdAt
          }
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ postComments: any[] }>(query, {
        postId: String(postId)
      });

      const rawComments = data.postComments || [];
      const commentsMap = new Map<string, PostCommentModel>();
      const topLevel: PostCommentModel[] = [];

      for (const c of rawComments) {
        const item: PostCommentModel = {
          id: c.id,
          postId: c.postId,
          authorId: c.authorId,
          authorName: c.author?.name,
          authorRole: c.author?.role,
          authorAvatar: c.author?.photoUrl,
          content: c.content,
          parentId: c.parentId || null,
          replies: (c.replies || []).map((r: any) => ({
            id: r.id,
            postId: r.postId,
            authorId: r.authorId,
            authorName: r.author?.name,
            authorRole: r.author?.role,
            authorAvatar: r.author?.photoUrl,
            content: r.content,
            parentId: r.parentId,
            createdAt: r.createdAt
          })),
          createdAt: c.createdAt
        };
        commentsMap.set(String(c.id), item);
      }

      for (const c of commentsMap.values()) {
        if (!c.parentId) {
          topLevel.push(c);
        } else {
          const parent = commentsMap.get(String(c.parentId));
          if (parent) {
            if (!parent.replies) parent.replies = [];
            if (!parent.replies.some((r) => String(r.id) === String(c.id))) {
              parent.replies.push(c);
            }
          } else {
            topLevel.push(c);
          }
        }
      }

      return topLevel;
    } catch (err) {
      console.warn('Erro ao obter comentários do post:', err);
      return [];
    }
  },

  async createPost(
    authorId: string | number,
    content: string,
    mediaIds: (string | number)[] = [],
    mentionedUserIds: (string | number)[] = []
  ): Promise<PostModel | null> {
    const mutation = `
      mutation CreatePost($authorId: ID!, $content: String!, $mediaIds: [ID], $mentionedUserIds: [ID]) {
        createPost(authorId: $authorId, content: $content, mediaIds: $mediaIds, mentionedUserIds: $mentionedUserIds) {
          id
          authorId
          content
          mediaIds
          reactionsCount
          commentsCount
          createdAt
          updatedAt
        }
      }
    `;

    const data = await graphqlClient.request<{ createPost: PostModel }>(mutation, {
      authorId: String(authorId),
      content,
      mediaIds: mediaIds.map(String),
      mentionedUserIds: mentionedUserIds.map(String)
    });

    return data.createPost;
  },

  async reactToPost(
    postId: string | number,
    userId: string | number,
    type: string
  ): Promise<PostReactionModel | null> {
    const mutation = `
      mutation ReactToPost($postId: ID!, $userId: ID!, $type: String!) {
        reactToPost(postId: $postId, userId: $userId, type: $type) {
          id
          postId
          userId
          type
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ reactToPost: PostReactionModel }>(mutation, {
      postId: String(postId),
      userId: String(userId),
      type
    });

    return data.reactToPost;
  },

  async commentOnPost(
    postId: string | number,
    authorId: string | number,
    content: string,
    parentId?: string | number | null
  ): Promise<PostCommentModel | null> {
    const mutation = `
      mutation CommentOnPost($postId: ID!, $authorId: ID!, $content: String!, $parentId: ID) {
        commentOnPost(postId: $postId, authorId: $authorId, content: $content, parentId: $parentId) {
          id
          postId
          authorId
          author {
            id
            name
            role
            photoUrl
          }
          content
          parentId
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ commentOnPost: any }>(mutation, {
      postId: String(postId),
      authorId: String(authorId),
      content,
      parentId: parentId ? String(parentId) : null
    });

    if (!data.commentOnPost) return null;

    const c = data.commentOnPost;
    return {
      id: c.id,
      postId: c.postId,
      authorId: c.authorId,
      authorName: c.author?.name,
      authorRole: c.author?.role,
      authorAvatar: c.author?.photoUrl,
      content: c.content,
      parentId: c.parentId || null,
      replies: [],
      createdAt: c.createdAt
    };
  }
};

export default postsService;
