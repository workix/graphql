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
  content: string;
  createdAt?: string;
}

export const postsService = {
  async getSocialFeed(userId: string | number, limit = 20, offset = 0): Promise<PostModel[]> {
    const query = `
      query SocialFeed($userId: ID!, $limit: Int, $offset: Int) {
        socialFeed(userId: $userId, limit: $limit, offset: $offset) {
          id
          authorId
          content
          mediaIds
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ socialFeed: PostModel[] }>(query, {
        userId: String(userId),
        limit,
        offset
      });
      return data.socialFeed || [];
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
          content
          mediaIds
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ rankedSocialFeed: PostModel[] }>(query, {
        userId: String(userId),
        limit,
        offset
      });
      return data.rankedSocialFeed || [];
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
          content
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ postComments: PostCommentModel[] }>(query, {
        postId: String(postId)
      });
      return data.postComments || [];
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
    content: string
  ): Promise<PostCommentModel | null> {
    const mutation = `
      mutation CommentOnPost($postId: ID!, $authorId: ID!, $content: String!) {
        commentOnPost(postId: $postId, authorId: $authorId, content: $content) {
          id
          postId
          authorId
          content
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ commentOnPost: PostCommentModel }>(mutation, {
      postId: String(postId),
      authorId: String(authorId),
      content
    });

    return data.commentOnPost;
  }
};

export default postsService;
