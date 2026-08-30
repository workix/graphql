import premiumRepository from '../modules/premium/repository/premium.repo';

export const requirePlanResolver = (minPlan?: string) => (resolver: any) => {
  return async (parent: any, args: any, context: any, info: any) => {
    const subscription = await premiumRepository(context.orm).getActiveSubscription(context.user.id);

    if (!subscription) {
      throw new Error('Premium plan required for this action');
    }

    return resolver(parent, args, context, info);
  };
};
