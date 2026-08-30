import { Notification } from '../../../models';

const notificationsRepository = (db: any) => {
  const findMyNotifications = async (userId: number, limit: number = 20, offset: number = 0) => {
    return await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  };

  const countUnreadNotifications = async (userId: number) => {
    return await Notification.count({
      where: {
        user_id: userId,
        read: false
      }
    });
  };

  const markAsRead = async (id: number, userId: number) => {
    const notification = await Notification.findOne({
      where: { id, user_id: userId }
    });

    if (!notification) {
      throw new Error(`Notification with id ${id} not found for user ${userId}`);
    }

    await notification.update({ read: true });
    return notification;
  };

  return {
    findMyNotifications,
    countUnreadNotifications,
    markAsRead
  };
};

export default notificationsRepository;
