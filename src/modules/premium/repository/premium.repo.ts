import { SubscriptionPlan, UserSubscription } from '../../../models';

export const computeExpiresAt = (billingPeriod: string, from: Date = new Date()): Date => {
  const date = new Date(from);
  if (billingPeriod === 'YEARLY') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date;
};

const isActiveAndNotExpired = (subscription: any): boolean => {
  if (!subscription || subscription.status !== 'ACTIVE') return false;
  return new Date(subscription.expires_at) > new Date();
};

const premiumRepository = (db: any) => {
  const createPlan = async (name: string, price: number, billingPeriod: string, inmailCreditsPerMonth = 0) => {
    return await SubscriptionPlan.create({
      name,
      price,
      billing_period: billingPeriod,
      inmail_credits_per_month: inmailCreditsPerMonth
    });
  };

  const getPlans = async () => {
    return await SubscriptionPlan.findAll();
  };

  const subscribeToPlan = async (userId: number, planId: number) => {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) {
      throw new Error(`Subscription plan ${planId} not found`);
    }

    const now = new Date();
    const expiresAt = computeExpiresAt(plan.billing_period, now);
    const fields = {
      plan_id: planId,
      status: 'ACTIVE',
      inmail_credits_remaining: plan.inmail_credits_per_month,
      started_at: now,
      expires_at: expiresAt
    };

    const existing = await UserSubscription.findOne({ where: { user_id: userId } });
    if (existing) {
      await existing.update(fields);
      return existing;
    }

    return await UserSubscription.create({ user_id: userId, ...fields });
  };

  const getActiveSubscription = async (userId: number) => {
    const subscription = await UserSubscription.findOne({ where: { user_id: userId } });
    return isActiveAndNotExpired(subscription) ? subscription : null;
  };

  const decrementInMailCredit = async (userId: number) => {
    const subscription = await getActiveSubscription(userId);
    if (!subscription || subscription.inmail_credits_remaining <= 0) {
      throw new Error('No InMail credits available');
    }

    await subscription.update({ inmail_credits_remaining: subscription.inmail_credits_remaining - 1 });
    return subscription;
  };

  return {
    createPlan,
    getPlans,
    subscribeToPlan,
    getActiveSubscription,
    decrementInMailCredit
  };
};

export default premiumRepository;
