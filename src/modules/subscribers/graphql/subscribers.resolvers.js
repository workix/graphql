import SubscriberDTO from '../../../dtos/SubscriberDTO';
import subscribersRepository from '../repository/subscribers.repo'

const subscribersResolvers = {
  Query: {
    allSubscribers: async (parent, args, ctx, info) => {
      let subscribers = await subscribersRepository(ctx.orm).findAll(info, args)
      subscribers = subscribers.map(s => new SubscriberDTO(s))
      return subscribers;
    },
    getSubscriberById: async (parent, args, ctx, info) => {
      const subscriber = await subscribersRepository(ctx.orm).findById(info, args)
      return new SubscriberDTO(subscriber);
    },
    allSubscribersPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await subscribersRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }
  },
  Mutation: {
    createSubscriber: async (parent, args, ctx, info) => {
      const subscriber = await subscribersRepository(ctx.orm).create(args)
      return new SubscriberDTO(subscriber);
    },
    deleteSubscriber: async (parent, args, ctx, info) => {
      const deleted = await subscribersRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateSubscriber: async (parent, args, ctx, info) => {
      const subscriber = await subscribersRepository(ctx.orm).update(args)
      return new SubscriberDTO(subscriber);
    },
    subscribeMail: async (parent, args, ctx, info) => {
      const subscribed = await subscribersRepository(ctx.orm).subscribeToggle(args)
      return subscribed;
    }
  },
}

export default subscribersResolvers;