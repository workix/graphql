import { Notification } from '../models';
import pubsub, { NOTIFICATION_ADDED } from '../subscriptions/pubsub';

export const processNotificationMessage = async (rawMessage: string, redisClient?: any): Promise<any> => {
  try {
    const data = JSON.parse(rawMessage);
    const { userId, type, title, body, payloadData } = data;

    if (!userId || !type || !title || !body) {
      throw new Error('Invalid notification payload: missing required fields');
    }

    const notification = await Notification.create({
      user_id: userId,
      type,
      title,
      body,
      read: false,
      data: payloadData ? JSON.stringify(payloadData) : null
    });

    if (redisClient) {
      await redisClient.del(`unread-notifications:${userId}`);
    }

    pubsub.publish(NOTIFICATION_ADDED, { notificationAdded: notification });

    return notification;
  } catch (error) {
    console.error('Error processing notification message:', error);
    return null;
  }
};

export const handleNotificationMessage = async (msg: any, redisClient?: any): Promise<any> => {
  if (!msg || !msg.content) return null;
  const contentStr = msg.content.toString();
  return await processNotificationMessage(contentStr, redisClient);
};
