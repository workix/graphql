import graphqlClient from './graphql';

export interface AdminSocialPostModel {
  id: string | number;
  authorId: string | number;
  content: string;
  mediaIds?: (string | number)[];
  createdAt?: string;
  updatedAt?: string;
  reactionsCount?: number;
  commentsCount?: number;
}

export interface AdminPostCommentModel {
  id: string | number;
  postId: string | number;
  authorId: string | number;
  content: string;
  createdAt?: string;
}

export interface AdminPostReactionModel {
  id: string | number;
  postId: string | number;
  userId: string | number;
  type: string;
  createdAt?: string;
}

export const adminSocialPostsService = {
  async getPosts(userId = 1, limit = 50, offset = 0): Promise<AdminSocialPostModel[]> {
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
      const data = await graphqlClient.request<{ socialFeed: AdminSocialPostModel[] }>(query, {
        userId: String(userId),
        limit,
        offset
      });
      return data.socialFeed || [];
    } catch (err) {
      console.warn('Erro ao carregar socialFeed no Admin:', err);
      return [];
    }
  },

  async getComments(postId: string | number): Promise<AdminPostCommentModel[]> {
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
      const data = await graphqlClient.request<{ postComments: AdminPostCommentModel[] }>(query, {
        postId: String(postId)
      });
      return data.postComments || [];
    } catch (err) {
      console.warn(`Erro ao carregar comentários do post ${postId} no Admin:`, err);
      return [];
    }
  },

  async getReactions(postId: string | number): Promise<AdminPostReactionModel[]> {
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
      const data = await graphqlClient.request<{ postReactions: AdminPostReactionModel[] }>(query, {
        postId: String(postId)
      });
      return data.postReactions || [];
    } catch (err) {
      console.warn(`Erro ao carregar reações do post ${postId} no Admin:`, err);
      return [];
    }
  }
};

export default adminSocialPostsService;
