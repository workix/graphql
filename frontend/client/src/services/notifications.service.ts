import graphqlClient from './graphql';

export interface NotificationModel {
  id: string | number;
  userId: string | number;
  type: string;
  title: string;
  body: string;
  read: boolean;
  data?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const notificationsService = {
  async getMyNotifications(
    userId: string | number,
    limit = 50,
    offset = 0
  ): Promise<NotificationModel[]> {
    const query = `
      query MyNotifications($userId: ID!, $limit: Int, $offset: Int) {
        myNotifications(userId: $userId, limit: $limit, offset: $offset) {
          id
          userId
          type
          title
          body
          read
          data
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ myNotifications: NotificationModel[] }>(query, {
        userId: String(userId),
        limit,
        offset
      });
      return data.myNotifications || [];
    } catch (err) {
      console.warn('Erro ao carregar notificações:', err);
      return [];
    }
  },

  async getUnreadCount(userId: string | number): Promise<number> {
    const query = `
      query UnreadNotificationsCount($userId: ID!) {
        unreadNotificationsCount(userId: $userId)
      }
    `;

    try {
      const data = await graphqlClient.request<{ unreadNotificationsCount: number }>(query, {
        userId: String(userId)
      });
      return data.unreadNotificationsCount ?? 0;
    } catch (err) {
      console.warn('Erro ao obter contagem de notificações não lidas:', err);
      return 0;
    }
  },

  async markAsRead(
    id: string | number,
    userId: string | number
  ): Promise<NotificationModel | null> {
    const mutation = `
      mutation MarkNotificationAsRead($id: ID!, $userId: ID!) {
        markNotificationAsRead(id: $id, userId: $userId) {
          id
          read
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ markNotificationAsRead: NotificationModel }>(mutation, {
        id: String(id),
        userId: String(userId)
      });
      return data.markNotificationAsRead || null;
    } catch {
      return null;
    }
  }
};

export default notificationsService;
