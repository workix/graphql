import messagingResolvers from '../../src/modules/messaging/graphql/messaging.resolvers';
import notificationsResolvers from '../../src/modules/notifications/graphql/notifications.resolvers';
import endorsementsResolvers from '../../src/modules/endorsements/graphql/endorsements.resolvers';

describe('DataLoaders for Messaging, Notifications and Endorsements (TDD)', () => {
  describe('DirectMessage Field Resolvers', () => {
    it('should resolve sender and recipient for DirectMessage via usersLoader', async () => {
      const mockUserLoad = jest.fn().mockImplementation(({ key }: { key: number }) => {
        return Promise.resolve([{ id: key, email: `user${key}@test.com` }]);
      });
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockUserLoad }
        }
      };

      const parentMsg = { id: 1, senderId: 501, recipientId: 502, content: 'Hey!' };
      const sender = await (messagingResolvers as any).DirectMessage.sender(parentMsg, {}, ctx, {});
      const recipient = await (messagingResolvers as any).DirectMessage.recipient(parentMsg, {}, ctx, {});

      expect(mockUserLoad).toHaveBeenCalledWith({ key: 501, info: {} });
      expect(mockUserLoad).toHaveBeenCalledWith({ key: 502, info: {} });
      expect(sender.id).toBe(501);
      expect(recipient.id).toBe(502);
    });
  });

  describe('Notification Field Resolvers', () => {
    it('should resolve user for Notification via usersLoader', async () => {
      const mockUserLoad = jest.fn().mockResolvedValue([{ id: 601, email: 'user601@test.com' }]);
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockUserLoad }
        }
      };

      const parentNotification = { id: 10, userId: 601, title: 'New Alert' };
      const user = await (notificationsResolvers as any).Notification.user(parentNotification, {}, ctx, {});

      expect(mockUserLoad).toHaveBeenCalledWith({ key: 601, info: {} });
      expect(user.id).toBe(601);
    });
  });

  describe('Endorsements and Recommendations Field Resolvers', () => {
    it('should resolve endorser for SkillEndorsement via usersLoader', async () => {
      const mockUserLoad = jest.fn().mockResolvedValue([{ id: 701, email: 'endorser@test.com' }]);
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockUserLoad }
        }
      };

      const parentEndorsement = { id: 20, skillId: 1, endorserId: 701 };
      const endorser = await (endorsementsResolvers as any).SkillEndorsement.endorser(parentEndorsement, {}, ctx, {});

      expect(mockUserLoad).toHaveBeenCalledWith({ key: 701, info: {} });
      expect(endorser.id).toBe(701);
    });

    it('should resolve recommender and recipient for Recommendation via usersLoader', async () => {
      const mockUserLoad = jest.fn().mockImplementation(({ key }: { key: number }) => {
        return Promise.resolve([{ id: key, email: `user${key}@test.com` }]);
      });
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockUserLoad }
        }
      };

      const parentRec = { id: 30, recommenderId: 801, recipientId: 802, content: 'Highly recommended!' };
      const recommender = await (endorsementsResolvers as any).Recommendation.recommender(parentRec, {}, ctx, {});
      const recipient = await (endorsementsResolvers as any).Recommendation.recipient(parentRec, {}, ctx, {});

      expect(mockUserLoad).toHaveBeenCalledWith({ key: 801, info: {} });
      expect(mockUserLoad).toHaveBeenCalledWith({ key: 802, info: {} });
      expect(recommender.id).toBe(801);
      expect(recipient.id).toBe(802);
    });
  });
});
