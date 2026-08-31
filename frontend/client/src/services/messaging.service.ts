import graphqlClient from './graphql';

export interface DirectMessageModel {
  id: string | number;
  senderId: string | number;
  recipientId: string | number;
  content: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationSummary {
  contactId: string | number;
  contactName: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
}

export const messagingService = {
  async getDirectMessages(
    userId1: string | number,
    userId2: string | number,
    limit = 50,
    offset = 0
  ): Promise<DirectMessageModel[]> {
    const query = `
      query DirectMessages($userId1: ID!, $userId2: ID!, $limit: Int, $offset: Int) {
        directMessages(userId1: $userId1, userId2: $userId2, limit: $limit, offset: $offset) {
          id
          senderId
          recipientId
          content
          read
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ directMessages: DirectMessageModel[] }>(query, {
        userId1: String(userId1),
        userId2: String(userId2),
        limit,
        offset
      });
      return data.directMessages || [];
    } catch (err) {
      console.warn('Erro ao carregar mensagens diretas:', err);
      return [];
    }
  },

  async sendDirectMessage(
    senderId: string | number,
    recipientId: string | number,
    content: string
  ): Promise<DirectMessageModel | null> {
    const mutation = `
      mutation SendDirectMessage($senderId: ID!, $recipientId: ID!, $content: String!) {
        sendDirectMessage(senderId: $senderId, recipientId: $recipientId, content: $content) {
          id
          senderId
          recipientId
          content
          read
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ sendDirectMessage: DirectMessageModel }>(mutation, {
      senderId: String(senderId),
      recipientId: String(recipientId),
      content
    });
    return data.sendDirectMessage || null;
  },

  async markAsRead(
    messageId: string | number,
    recipientId: string | number
  ): Promise<DirectMessageModel | null> {
    const mutation = `
      mutation MarkDirectMessageAsRead($messageId: ID!, $recipientId: ID!) {
        markDirectMessageAsRead(messageId: $messageId, recipientId: $recipientId) {
          id
          read
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ markDirectMessageAsRead: DirectMessageModel }>(mutation, {
        messageId: String(messageId),
        recipientId: String(recipientId)
      });
      return data.markDirectMessageAsRead || null;
    } catch {
      return null;
    }
  }
};

export default messagingService;
