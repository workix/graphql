import { handleNotificationMessage, processNotificationMessage } from '../../../src/workers/notification_consumer';
import notificationsRepository from '../../../src/modules/notifications/repository/notifications.repo';
import notificationsResolvers from '../../../src/modules/notifications/graphql/notifications.resolvers';
import NotificationDTO from '../../../src/dtos/NotificationDTO';
import { Notification } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Notification: {
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('Notifications Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
  });

  describe('notification_consumer worker', () => {
    it('should process notification message and publish event', async () => {
      const mockCreated = { id: 1, user_id: 10, type: 'LIKE', title: 'New Like', body: 'Someone liked your post', read: false };
      (Notification.create as jest.Mock).mockResolvedValue(mockCreated);

      const mockRedis = { del: jest.fn().mockResolvedValue(1) };
      const rawPayload = JSON.stringify({ userId: 10, type: 'LIKE', title: 'New Like', body: 'Someone liked your post', payloadData: { postId: 99 } });

      const res = await processNotificationMessage(rawPayload, mockRedis);

      expect(res).toEqual(mockCreated);
      expect(mockRedis.del).toHaveBeenCalledWith('unread-notifications:10');
    });

    it('should handle notification message from rabbitmq queue message', async () => {
      const mockCreated = { id: 2, user_id: 5, type: 'COMMENT', title: 'Comment', body: 'New comment', read: false };
      (Notification.create as jest.Mock).mockResolvedValue(mockCreated);

      const msg = { content: Buffer.from(JSON.stringify({ userId: 5, type: 'COMMENT', title: 'Comment', body: 'New comment' })) };
      const res = await handleNotificationMessage(msg);

      expect(res).toEqual(mockCreated);
    });

    it('should return null for invalid JSON or missing fields', async () => {
      expect(await handleNotificationMessage(null)).toBeNull();
      expect(await handleNotificationMessage({})).toBeNull();

      const invalidPayload = JSON.stringify({ userId: 1 });
      const res = await processNotificationMessage(invalidPayload);
      expect(res).toBeNull();
    });
  });

  describe('notificationsRepository', () => {
    it('should findMyNotifications with default limit and offset, and countUnreadNotifications', async () => {
      const mockList = [{ id: 1, user_id: 10, title: 'Test' }];
      (Notification.findAll as jest.Mock).mockResolvedValue(mockList);
      (Notification.count as jest.Mock).mockResolvedValue(3);

      const repo = notificationsRepository(mockCtx.orm);
      const listDefault = await repo.findMyNotifications(10);
      const listCustom = await repo.findMyNotifications(10, 10, 0);
      const count = await repo.countUnreadNotifications(10);

      expect(listDefault).toEqual(mockList);
      expect(listCustom).toEqual(mockList);
      expect(count).toBe(3);
    });

    it('should mark notification as read', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(true);
      const mockItem = { id: 1, user_id: 10, read: false, update: mockUpdate };
      (Notification.findOne as jest.Mock).mockResolvedValue(mockItem);

      const repo = notificationsRepository(mockCtx.orm);
      const result = await repo.markAsRead(1, 10);

      expect(mockUpdate).toHaveBeenCalledWith({ read: true });
      expect(result).toEqual(mockItem);
    });

    it('should throw error when notification to mark as read is missing', async () => {
      (Notification.findOne as jest.Mock).mockResolvedValue(null);

      const repo = notificationsRepository(mockCtx.orm);
      await expect(repo.markAsRead(99, 10)).rejects.toThrow('Notification with id 99 not found for user 10');
    });
  });

  describe('notificationsResolvers', () => {
    it('should resolve myNotifications, unreadNotificationsCount and markNotificationAsRead', async () => {
      const mockItem = { id: 1, user_id: 10, title: 'Notif 1', read: true, update: jest.fn().mockResolvedValue(true) };
      (Notification.findAll as jest.Mock).mockResolvedValue([mockItem]);
      (Notification.count as jest.Mock).mockResolvedValue(5);
      (Notification.findOne as jest.Mock).mockResolvedValue(mockItem);

      const q = notificationsResolvers.Query;
      const m = notificationsResolvers.Mutation;
      const s = notificationsResolvers.Subscription;

      const items = await q.myNotifications(null, { userId: 10, limit: 10, offset: 0 }, mockCtx, {});
      expect(items[0]).toBeInstanceOf(NotificationDTO);

      const count = await q.unreadNotificationsCount(null, { userId: 10 }, mockCtx, {});
      expect(count).toBe(5);

      const marked = await m.markNotificationAsRead(null, { id: 1, userId: 10 }, mockCtx, {});
      expect(marked).toBeInstanceOf(NotificationDTO);

      const subIterator = s.notificationAdded.subscribe();
      expect(subIterator).toBeDefined();
    });
  });

  describe('NotificationDTO', () => {
    it('should handle null input gracefully', () => {
      const dto = new NotificationDTO(null);
      expect(dto.id).toBeUndefined();
      expect(dto.read).toBe(false);
    });
  });
});
