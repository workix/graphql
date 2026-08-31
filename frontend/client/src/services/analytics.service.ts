import graphqlClient from './graphql';

export interface SocialSellingScoreModel {
  id?: string | number;
  userId: string | number;
  score: number;
  postsScore: number;
  networkScore: number;
  engagementScore: number;
  relationshipsScore: number;
  calculatedAt?: string;
}

export interface ProfileViewModel {
  id: string | number;
  viewedId: string | number;
  viewerId: string | number;
  viewedAt?: string;
}

export interface PostAnalyticsModel {
  id?: string | number;
  postId: string | number;
  viewsCount: number;
  sharesCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export const analyticsService = {
  async getMySocialSellingIndex(userId: string | number): Promise<SocialSellingScoreModel | null> {
    const query = `
      query MySocialSellingIndex($userId: ID!) {
        mySocialSellingIndex(userId: $userId) {
          id
          userId
          score
          postsScore
          networkScore
          engagementScore
          relationshipsScore
          calculatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ mySocialSellingIndex: SocialSellingScoreModel }>(query, {
        userId: String(userId)
      });
      return data.mySocialSellingIndex || null;
    } catch (err) {
      console.warn('Erro ao carregar SSI:', err);
      return null;
    }
  },

  async recalculateSocialSellingIndex(userId: string | number): Promise<SocialSellingScoreModel | null> {
    const mutation = `
      mutation RecalculateSocialSellingIndex($userId: ID!) {
        recalculateSocialSellingIndex(userId: $userId) {
          id
          userId
          score
          postsScore
          networkScore
          engagementScore
          relationshipsScore
          calculatedAt
        }
      }
    `;

    const data = await graphqlClient.request<{ recalculateSocialSellingIndex: SocialSellingScoreModel }>(mutation, {
      userId: String(userId)
    });
    return data.recalculateSocialSellingIndex || null;
  },

  async getWhoViewedMyProfile(
    userId: string | number,
    limit = 50,
    offset = 0
  ): Promise<ProfileViewModel[]> {
    const query = `
      query WhoViewedMyProfile($userId: ID!, $limit: Int, $offset: Int) {
        whoViewedMyProfile(userId: $userId, limit: $limit, offset: $offset) {
          id
          viewedId
          viewerId
          viewedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ whoViewedMyProfile: ProfileViewModel[] }>(query, {
        userId: String(userId),
        limit,
        offset
      });
      return data.whoViewedMyProfile || [];
    } catch (err) {
      console.warn('Erro ao carregar visualizações de perfil:', err);
      return [];
    }
  },

  async getPostAnalytics(postId: string | number): Promise<PostAnalyticsModel | null> {
    const query = `
      query PostAnalytics($postId: ID!) {
        postAnalytics(postId: $postId) {
          id
          postId
          viewsCount
          sharesCount
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ postAnalytics: PostAnalyticsModel }>(query, {
        postId: String(postId)
      });
      return data.postAnalytics || null;
    } catch (err) {
      console.warn('Erro ao carregar métricas do post:', err);
      return null;
    }
  },

  async recordProfileView(viewedId: string | number, viewerId: string | number): Promise<boolean> {
    const mutation = `
      mutation RecordProfileView($viewedId: ID!, $viewerId: ID!) {
        recordProfileView(viewedId: $viewedId, viewerId: $viewerId) {
          id
          viewedAt
        }
      }
    `;

    try {
      await graphqlClient.request(mutation, {
        viewedId: String(viewedId),
        viewerId: String(viewerId)
      });
      return true;
    } catch {
      return false;
    }
  },

  async recordPostView(postId: string | number): Promise<boolean> {
    const mutation = `
      mutation RecordPostView($postId: ID!) {
        recordPostView(postId: $postId) {
          id
          viewsCount
        }
      }
    `;

    try {
      await graphqlClient.request(mutation, { postId: String(postId) });
      return true;
    } catch {
      return false;
    }
  }
};

export default analyticsService;
