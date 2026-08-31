import graphqlClient from './graphql';

export interface SkillEndorsementModel {
  id: string | number;
  skillId: string | number;
  endorserId: string | number;
  createdAt?: string;
}

export interface RecommendationModel {
  id: string | number;
  recommenderId: string | number;
  recipientId: string | number;
  content: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillWithEndorsements {
  id: string | number;
  name: string;
  endorsementsCount: number;
  isEndorsedByMe: boolean;
}

export const endorsementsService = {
  async getSkillEndorsements(skillId: string | number): Promise<SkillEndorsementModel[]> {
    const query = `
      query SkillEndorsements($skillId: ID!) {
        skillEndorsements(skillId: $skillId) {
          id
          skillId
          endorserId
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ skillEndorsements: SkillEndorsementModel[] }>(query, {
        skillId: String(skillId)
      });
      return data.skillEndorsements || [];
    } catch (err) {
      console.warn('Erro ao carregar endossos:', err);
      return [];
    }
  },

  async endorseSkill(skillId: string | number, endorserId: string | number): Promise<boolean> {
    const mutation = `
      mutation EndorseSkill($skillId: ID!, $endorserId: ID!) {
        endorseSkill(skillId: $skillId, endorserId: $endorserId)
      }
    `;

    try {
      const data = await graphqlClient.request<{ endorseSkill: boolean }>(mutation, {
        skillId: String(skillId),
        endorserId: String(endorserId)
      });
      return !!data.endorseSkill;
    } catch {
      return false;
    }
  },

  async unendorseSkill(skillId: string | number, endorserId: string | number): Promise<boolean> {
    const mutation = `
      mutation UnendorseSkill($skillId: ID!, $endorserId: ID!) {
        unendorseSkill(skillId: $skillId, endorserId: $endorserId)
      }
    `;

    try {
      const data = await graphqlClient.request<{ unendorseSkill: boolean }>(mutation, {
        skillId: String(skillId),
        endorserId: String(endorserId)
      });
      return !!data.unendorseSkill;
    } catch {
      return false;
    }
  },

  async getUserRecommendations(userId: string | number): Promise<RecommendationModel[]> {
    const query = `
      query UserRecommendations($userId: ID!) {
        userRecommendations(userId: $userId) {
          id
          recommenderId
          recipientId
          content
          status
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ userRecommendations: RecommendationModel[] }>(query, {
        userId: String(userId)
      });
      return data.userRecommendations || [];
    } catch (err) {
      console.warn('Erro ao carregar recomendações:', err);
      return [];
    }
  },

  async createRecommendation(
    recommenderId: string | number,
    recipientId: string | number,
    content: string
  ): Promise<RecommendationModel | null> {
    const mutation = `
      mutation CreateRecommendation($recommenderId: ID!, $recipientId: ID!, $content: String!) {
        createRecommendation(recommenderId: $recommenderId, recipientId: $recipientId, content: $content) {
          id
          recommenderId
          recipientId
          content
          status
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ createRecommendation: RecommendationModel }>(mutation, {
      recommenderId: String(recommenderId),
      recipientId: String(recipientId),
      content
    });
    return data.createRecommendation || null;
  },

  async respondToRecommendation(
    recommendationId: string | number,
    recipientId: string | number,
    accept: boolean
  ): Promise<RecommendationModel | null> {
    const mutation = `
      mutation RespondToRecommendation($recommendationId: ID!, $recipientId: ID!, $accept: Boolean!) {
        respondToRecommendation(recommendationId: $recommendationId, recipientId: $recipientId, accept: $accept) {
          id
          status
          updatedAt
        }
      }
    `;

    const data = await graphqlClient.request<{ respondToRecommendation: RecommendationModel }>(mutation, {
      recommendationId: String(recommendationId),
      recipientId: String(recipientId),
      accept
    });
    return data.respondToRecommendation || null;
  }
};

export default endorsementsService;
