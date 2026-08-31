import graphqlClient from './graphql';

export interface AdminConnectionModel {
  id: string | number;
  userId1: string | number;
  userId2: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminConnectionRequestModel {
  id: string | number;
  requesterId: string | number;
  recipientId: string | number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const adminConnectionsService = {
  async getUserConnections(userId: string | number): Promise<AdminConnectionModel[]> {
    const query = `
      query MyConnections($userId: ID!) {
        myConnections(userId: $userId) {
          id
          userId1
          userId2
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ myConnections: AdminConnectionModel[] }>(query, {
        userId: String(userId)
      });
      return data.myConnections || [];
    } catch (err) {
      console.warn(`Erro ao carregar conexões do usuário ${userId}:`, err);
      return [];
    }
  },

  async getUserPendingRequests(userId: string | number): Promise<AdminConnectionRequestModel[]> {
    const query = `
      query PendingConnectionRequests($userId: ID!) {
        pendingConnectionRequests(userId: $userId) {
          id
          requesterId
          recipientId
          status
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ pendingConnectionRequests: AdminConnectionRequestModel[] }>(query, {
        userId: String(userId)
      });
      return data.pendingConnectionRequests || [];
    } catch (err) {
      console.warn(`Erro ao carregar solicitações de conexão do usuário ${userId}:`, err);
      return [];
    }
  },

  async getSocialDistanceDegree(userId1: string | number, userId2: string | number): Promise<string> {
    const query = `
      query SocialDistanceDegree($userId1: ID!, $userId2: ID!) {
        socialDistanceDegree(userId1: $userId1, userId2: $userId2)
      }
    `;

    try {
      const data = await graphqlClient.request<{ socialDistanceDegree: string }>(query, {
        userId1: String(userId1),
        userId2: String(userId2)
      });
      return data.socialDistanceDegree || '3rd+';
    } catch (err) {
      console.warn('Erro ao verificar distância social no Admin:', err);
      return '3rd+';
    }
  }
};

export default adminConnectionsService;
