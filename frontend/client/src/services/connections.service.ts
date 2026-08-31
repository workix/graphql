import graphqlClient from './graphql';

export interface ConnectionModel {
  id: string | number;
  userId1: string | number;
  userId2: string | number;
  createdAt?: string;
  updatedAt?: string;
  // Campos complementares hidratados
  connectedUser?: {
    id: string | number;
    name: string;
    headline?: string;
    avatarUrl?: string;
    degree?: string;
  };
}

export interface ConnectionRequestModel {
  id: string | number;
  requesterId: string | number;
  recipientId: string | number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  requester?: {
    id: string | number;
    name: string;
    headline?: string;
    avatarUrl?: string;
  };
}

export const connectionsService = {
  async getMyConnections(userId: string | number): Promise<ConnectionModel[]> {
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
      const data = await graphqlClient.request<{ myConnections: ConnectionModel[] }>(query, {
        userId: String(userId)
      });
      return data.myConnections || [];
    } catch (err) {
      console.warn('Erro ao carregar conexões:', err);
      return [];
    }
  },

  async getPendingRequests(userId: string | number): Promise<ConnectionRequestModel[]> {
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
      const data = await graphqlClient.request<{ pendingConnectionRequests: ConnectionRequestModel[] }>(query, {
        userId: String(userId)
      });
      return data.pendingConnectionRequests || [];
    } catch (err) {
      console.warn('Erro ao carregar solicitações de conexão:', err);
      return [];
    }
  },

  async getSocialDistance(userId1: string | number, userId2: string | number): Promise<string> {
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
      console.warn('Erro ao calcular distância social:', err);
      return '3rd+';
    }
  },

  async sendConnectionRequest(requesterId: string | number, recipientId: string | number): Promise<ConnectionRequestModel | null> {
    const mutation = `
      mutation SendConnectionRequest($requesterId: ID!, $recipientId: ID!) {
        sendConnectionRequest(requesterId: $requesterId, recipientId: $recipientId) {
          id
          requesterId
          recipientId
          status
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ sendConnectionRequest: ConnectionRequestModel }>(mutation, {
      requesterId: String(requesterId),
      recipientId: String(recipientId)
    });
    return data.sendConnectionRequest || null;
  },

  async acceptConnectionRequest(requestId: string | number, recipientId: string | number): Promise<ConnectionModel | null> {
    const mutation = `
      mutation AcceptConnectionRequest($requestId: ID!, $recipientId: ID!) {
        acceptConnectionRequest(requestId: $requestId, recipientId: $recipientId) {
          id
          userId1
          userId2
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ acceptConnectionRequest: ConnectionModel }>(mutation, {
      requestId: String(requestId),
      recipientId: String(recipientId)
    });
    return data.acceptConnectionRequest || null;
  },

  async rejectConnectionRequest(requestId: string | number, recipientId: string | number): Promise<ConnectionRequestModel | null> {
    const mutation = `
      mutation RejectConnectionRequest($requestId: ID!, $recipientId: ID!) {
        rejectConnectionRequest(requestId: $requestId, recipientId: $recipientId) {
          id
          requesterId
          recipientId
          status
        }
      }
    `;

    const data = await graphqlClient.request<{ rejectConnectionRequest: ConnectionRequestModel }>(mutation, {
      requestId: String(requestId),
      recipientId: String(recipientId)
    });
    return data.rejectConnectionRequest || null;
  },

  async followUser(followerId: string | number, followingId: string | number): Promise<boolean> {
    const mutation = `
      mutation FollowUser($followerId: ID!, $followingId: ID!) {
        followUser(followerId: $followerId, followingId: $followingId)
      }
    `;

    try {
      const data = await graphqlClient.request<{ followUser: boolean }>(mutation, {
        followerId: String(followerId),
        followingId: String(followingId)
      });
      return !!data.followUser;
    } catch {
      return false;
    }
  },

  async unfollowUser(followerId: string | number, followingId: string | number): Promise<boolean> {
    const mutation = `
      mutation UnfollowUser($followerId: ID!, $followingId: ID!) {
        unfollowUser(followerId: $followerId, followingId: $followingId)
      }
    `;

    try {
      const data = await graphqlClient.request<{ unfollowUser: boolean }>(mutation, {
        followerId: String(followerId),
        followingId: String(followingId)
      });
      return !!data.unfollowUser;
    } catch {
      return false;
    }
  }
};

export default connectionsService;
