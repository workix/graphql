import premiumRepository from '../repository/premium.repo';
import SubscriptionPlanDTO from '../../../dtos/SubscriptionPlanDTO';
import UserSubscriptionDTO from '../../../dtos/UserSubscriptionDTO';

const premiumResolvers = {
  Query: {
    subscriptionPlans: async (parent: any, args: any, ctx: any, info: any) => {
      const plans = await premiumRepository(ctx.orm).getPlans();
      return plans.map((p: any) => new SubscriptionPlanDTO(p));
    },
    mySubscription: async (parent: any, args: any, ctx: any, info: any) => {
      const subscription = await premiumRepository(ctx.orm).getActiveSubscription(args.userId);
      return subscription ? new UserSubscriptionDTO(subscription) : null;
    }
  },
  Mutation: {
    createSubscriptionPlan: async (parent: any, args: any, ctx: any, info: any) => {
      const plan = await premiumRepository(ctx.orm).createPlan(
        args.name,
        args.price,
        args.billingPeriod,
        args.inmailCreditsPerMonth
      );
      return new SubscriptionPlanDTO(plan);
    },
    subscribeToPlan: async (parent: any, args: any, ctx: any, info: any) => {
      const subscription = await premiumRepository(ctx.orm).subscribeToPlan(args.userId, args.planId);
      return new UserSubscriptionDTO(subscription);
    }
  }
};

export default premiumResolvers;
