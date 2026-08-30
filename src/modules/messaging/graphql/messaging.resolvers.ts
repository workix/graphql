import messagingRepository from '../repository/messaging.repo';
import DirectMessageDTO from '../../../dtos/DirectMessageDTO';
import pubsub from '../../../subscriptions/pubsub';

const messagingResolvers = {
  Query: {
    directMessages: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await messagingRepository(ctx.orm, ctx.pubsub || pubsub).getConversationMessages(
        args.userId1,
        args.userId2,
        args.limit,
        args.offset
      );
      return list.map((m: any) => new DirectMessageDTO(m));
    }
  },
  Mutation: {
    sendDirectMessage: async (parent: any, args: any, ctx: any, info: any) => {
      const msg = await messagingRepository(ctx.orm, ctx.pubsub || pubsub).sendMessage(
        args.senderId,
        args.recipientId,
        args.content
      );
      return new DirectMessageDTO(msg);
    },
    markDirectMessageAsRead: async (parent: any, args: any, ctx: any, info: any) => {
      const msg = await messagingRepository(ctx.orm, ctx.pubsub || pubsub).markMessageAsRead(
        args.messageId,
        args.recipientId
      );
      return new DirectMessageDTO(msg);
    }
  },
  Subscription: {
    directMessageAdded: {
      subscribe: (parent: any, args: any, ctx: any, info: any) => {
        const ps = ctx?.pubsub || pubsub;
        return ps.asyncIterator([`DIRECT_MESSAGE_ADDED_${args.recipientId}`]);
      }
    }
  }
};

export default messagingResolvers;
