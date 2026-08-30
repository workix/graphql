import notificationsRepository from '../repository/notifications.repo';
import NotificationDTO from '../../../dtos/NotificationDTO';
import pubsub, { NOTIFICATION_ADDED } from '../../../subscriptions/pubsub';

const notificationsResolvers = {
  Query: {
    myNotifications: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await notificationsRepository(ctx.orm).findMyNotifications(args.userId, args.limit, args.offset);
      return list.map((item: any) => new NotificationDTO(item));
    },
    unreadNotificationsCount: async (parent: any, args: any, ctx: any, info: any) => {
      const count = await notificationsRepository(ctx.orm).countUnreadNotifications(args.userId);
      return count;
    }
  },
  Mutation: {
    markNotificationAsRead: async (parent: any, args: any, ctx: any, info: any) => {
      const item = await notificationsRepository(ctx.orm).markAsRead(args.id, args.userId);
      return new NotificationDTO(item);
    }
  },
  Subscription: {
    notificationAdded: {
      subscribe: () => (pubsub as any).asyncIterableIterator([NOTIFICATION_ADDED])
    }
  }
};

export default notificationsResolvers;
