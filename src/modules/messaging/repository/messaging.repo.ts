import { DirectMessage, Connection } from '../../../models';

const messagingRepository = (db: any, pubsub?: any) => {
  const sendMessage = async (senderId: number, recipientId: number, content: string) => {
    if (senderId === recipientId) {
      throw new Error('Cannot send direct message to yourself');
    }

    const connection = await Connection.findOne({
      where: {
        [db.Sequelize.Op?.or || '$or']: [
          { user_id_1: Math.min(senderId, recipientId), user_id_2: Math.max(senderId, recipientId) }
        ]
      }
    });

    if (!connection) {
      throw new Error('Must be connected to send direct messages');
    }

    const message = await DirectMessage.create({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      read: false
    });

    if (pubsub) {
      await pubsub.publish(`DIRECT_MESSAGE_ADDED_${recipientId}`, { directMessageAdded: message });
    }

    return message;
  };

  const getConversationMessages = async (userId1: number, userId2: number, limit = 50, offset = 0) => {
    const messages = await DirectMessage.findAll({
      where: {
        [db.Sequelize.Op?.or || '$or']: [
          { sender_id: userId1, recipient_id: userId2 },
          { sender_id: userId2, recipient_id: userId1 }
        ]
      },
      order: [['created_at', 'ASC']],
      limit,
      offset
    });
    return messages;
  };

  const markMessageAsRead = async (messageId: number, recipientId: number) => {
    const message = await DirectMessage.findOne({
      where: { id: messageId, recipient_id: recipientId }
    });

    if (!message) {
      throw new Error(`Direct message ${messageId} not found`);
    }

    await message.update({ read: true });
    return message;
  };

  return {
    sendMessage,
    getConversationMessages,
    markMessageAsRead
  };
};

export default messagingRepository;
