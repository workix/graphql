import messagingRepository from '../../../src/modules/messaging/repository/messaging.repo';
import messagingResolvers from '../../../src/modules/messaging/graphql/messaging.resolvers';
import premiumRepository from '../../../src/modules/premium/repository/premium.repo';
import DirectMessageDTO from '../../../src/dtos/DirectMessageDTO';
import { DirectMessage, Connection } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  DirectMessage: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  Connection: {
    findOne: jest.fn()
  }
}));

jest.mock('../../../src/modules/premium/repository/premium.repo', () => jest.fn());

describe('Messaging Module Unit Tests (TDD)', () => {
  let mockCtx: any;
  let mockPubsub: any;
  let mockGetActiveSubscription: jest.Mock;
  let mockDecrementInMailCredit: jest.Mock;

  beforeEach(() => {
    mockPubsub = {
      publish: jest.fn().mockResolvedValue(true),
      asyncIterator: jest.fn().mockReturnValue('mock-async-iterator')
    };
    mockCtx = {
      orm: {
        Sequelize: { Op: { or: Symbol('or') } }
      },
      pubsub: mockPubsub
    };

    mockGetActiveSubscription = jest.fn().mockResolvedValue(null);
    mockDecrementInMailCredit = jest.fn();
    (premiumRepository as unknown as jest.Mock).mockReturnValue({
      getActiveSubscription: mockGetActiveSubscription,
      decrementInMailCredit: mockDecrementInMailCredit
    });
  });

  describe('messagingRepository', () => {
    it('should throw error when sending message to self', async () => {
      const repo = messagingRepository(mockCtx.orm, mockPubsub);
      await expect(repo.sendMessage(1, 1, 'Hello')).rejects.toThrow('Cannot send direct message to yourself');
    });

    it('should throw error when users are not connected and sender has no active premium subscription', async () => {
      (Connection.findOne as jest.Mock).mockResolvedValue(null);
      mockGetActiveSubscription.mockResolvedValue(null);
      const repo = messagingRepository(mockCtx.orm, mockPubsub);

      await expect(repo.sendMessage(1, 2, 'Hello')).rejects.toThrow('Must be connected to send direct messages');
      expect(mockDecrementInMailCredit).not.toHaveBeenCalled();
    });

    it('should throw error when users are not connected and sender has no InMail credits remaining', async () => {
      (Connection.findOne as jest.Mock).mockResolvedValue(null);
      mockGetActiveSubscription.mockResolvedValue({ id: 1, inmail_credits_remaining: 0 });
      const repo = messagingRepository(mockCtx.orm, mockPubsub);

      await expect(repo.sendMessage(1, 2, 'Hello')).rejects.toThrow('Must be connected to send direct messages');
      expect(mockDecrementInMailCredit).not.toHaveBeenCalled();
    });

    it('should send InMail and decrement credit when sender has an active premium subscription with credits', async () => {
      (Connection.findOne as jest.Mock).mockResolvedValue(null);
      mockGetActiveSubscription.mockResolvedValue({ id: 1, inmail_credits_remaining: 3 });
      const mockMsg = { id: 11, sender_id: 1, recipient_id: 2, content: 'InMail hello', read: false };
      (DirectMessage.create as jest.Mock).mockResolvedValue(mockMsg);

      const repo = messagingRepository(mockCtx.orm, mockPubsub);
      const result = await repo.sendMessage(1, 2, 'InMail hello');

      expect(mockDecrementInMailCredit).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMsg);
    });

    it('should send message and publish event to pubsub when connected', async () => {
      (Connection.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      const mockMsg = { id: 10, sender_id: 1, recipient_id: 2, content: 'Hello', read: false };
      (DirectMessage.create as jest.Mock).mockResolvedValue(mockMsg);

      const repo = messagingRepository(mockCtx.orm, mockPubsub);
      const result = await repo.sendMessage(1, 2, 'Hello');

      expect(result).toEqual(mockMsg);
      expect(mockPubsub.publish).toHaveBeenCalledWith('DIRECT_MESSAGE_ADDED_2', { directMessageAdded: mockMsg });
    });

    it('should get conversation messages', async () => {
      const mockMsgs = [{ id: 10, sender_id: 1, recipient_id: 2, content: 'Hi' }];
      (DirectMessage.findAll as jest.Mock).mockResolvedValue(mockMsgs);

      const repo = messagingRepository(mockCtx.orm);
      const res = await repo.getConversationMessages(1, 2);

      expect(res).toEqual(mockMsgs);
    });

    it('should mark message as read', async () => {
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockMsg = { id: 10, sender_id: 1, recipient_id: 2, content: 'Hi', read: false, update: mockUpdate };
      (DirectMessage.findOne as jest.Mock).mockResolvedValue(mockMsg);

      const repo = messagingRepository(mockCtx.orm);
      const res = await repo.markMessageAsRead(10, 2);

      expect(mockUpdate).toHaveBeenCalledWith({ read: true });
      expect(res.read).toBe(true);
    });

    it('should throw error when marking non-existing message as read', async () => {
      (DirectMessage.findOne as jest.Mock).mockResolvedValue(null);
      const repo = messagingRepository(mockCtx.orm);

      await expect(repo.markMessageAsRead(99, 2)).rejects.toThrow('Direct message 99 not found');
    });
  });

  describe('messagingResolvers', () => {
    it('should resolve queries, mutations and subscriptions', async () => {
      const mockMsg = { id: 10, sender_id: 1, recipient_id: 2, content: 'Hi', read: false };
      (Connection.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (DirectMessage.findAll as jest.Mock).mockResolvedValue([mockMsg]);
      (DirectMessage.create as jest.Mock).mockResolvedValue(mockMsg);
      (DirectMessage.findOne as jest.Mock).mockResolvedValue({ ...mockMsg, update: jest.fn().mockResolvedValue(true) });

      const q = messagingResolvers.Query;
      const m = messagingResolvers.Mutation;
      const s = messagingResolvers.Subscription;

      const msgs = await q.directMessages(null, { userId1: 1, userId2: 2 }, mockCtx, {});
      expect(msgs[0]).toBeInstanceOf(DirectMessageDTO);

      const sent = await m.sendDirectMessage(null, { senderId: 1, recipientId: 2, content: 'Hi' }, mockCtx, {});
      expect(sent).toBeInstanceOf(DirectMessageDTO);

      const read = await m.markDirectMessageAsRead(null, { messageId: 10, recipientId: 2 }, mockCtx, {});
      expect(read).toBeInstanceOf(DirectMessageDTO);

      const subIterator = s.directMessageAdded.subscribe(null, { recipientId: 2 }, mockCtx, {});
      expect(subIterator).toBe('mock-async-iterator');
      expect(mockPubsub.asyncIterator).toHaveBeenCalledWith(['DIRECT_MESSAGE_ADDED_2']);
    });
  });

  describe('DirectMessageDTO', () => {
    it('should handle null input gracefully', () => {
      const dto = new DirectMessageDTO(null);
      expect(dto.id).toBeUndefined();
      expect(dto.read).toBe(false);
    });
  });
});
