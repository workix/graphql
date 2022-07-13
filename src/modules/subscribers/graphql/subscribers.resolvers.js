import subscribersRepository from '../repository/subscribers.repo'

const subscribersResolvers = {
  Query: {
    allSubscribers: async (parent, args, ctx, info) => {
      const subscribers = await subscribersRepository(ctx.orm).findAll(info, args)
      return subscribers;
    },
    getSubscriberById: async (parent, args, ctx, info) => {
      const subscriber = await subscribersRepository(ctx.orm).findById(info, args)
      return subscriber;
    },
    allSubscribersPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await subscribersRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }
  },
  Mutation: {
    createSubscriber: async (parent, args, ctx, info) => {
      const subscriber = await subscribersRepository(ctx.orm).create(args)
      return subscriber;
    },
    deleteSubscriber: async (parent, args, ctx, info) => {
      const deleted = await subscribersRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateSubscriber: async (parent, args, ctx, info) => {
      const subscriber = await subscribersRepository(ctx.orm).update(args)
      return subscriber;
    },
    subscribeMail: async (parent, args, ctx, info) => {
      const subscribed = await subscribersRepository(ctx.orm).subscribeToggle(args)
      return subscribed;
    }
  },
}

export default subscribersResolvers;