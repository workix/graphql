import premiumRepository from '../repository/premium.repo';
import SubscriptionPlanDTO from '../../../dtos/SubscriptionPlanDTO';
import UserSubscriptionDTO from '../../../dtos/UserSubscriptionDTO';
import { Plan, PlanFeature, Subscription } from '../../../models';
import { entitlementsService } from '../services/entitlements.service';

const premiumResolvers = {
  Query: {
    subscriptionPlans: async (parent: any, args: any, ctx: any, info: any) => {
      const plans = await premiumRepository(ctx.orm).getPlans();
      return plans.map((p: any) => new SubscriptionPlanDTO(p));
    },
    mySubscription: async (parent: any, args: any, ctx: any, info: any) => {
      const subscription = await premiumRepository(ctx.orm).getActiveSubscription(args.userId);
      return subscription ? new UserSubscriptionDTO(subscription) : null;
    },
    allPlans: async () => {
      return await Plan.findAll({
        where: { active: true },
        include: [{ model: PlanFeature, as: 'features' }]
      });
    },
    organizationSubscription: async (parent: any, args: any) => {
      const { subscription, plan } = await entitlementsService.getEffectivePlan(args.organizationId);
      if (!subscription) {
        return {
          id: null,
          organizationId: args.organizationId,
          planId: plan ? plan.id : null,
          status: 'free',
          cancelAtPeriodEnd: false,
          founderDiscountPct: 0.0,
          plan: plan
        };
      }
      return {
        id: subscription.id,
        organizationId: subscription.organization_id,
        planId: subscription.plan_id,
        status: subscription.status,
        gatewayCustomerId: subscription.gateway_customer_id,
        gatewaySubscriptionId: subscription.gateway_subscription_id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        trialEndsAt: subscription.trial_ends_at,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        founderDiscountPct: subscription.founder_discount_pct,
        plan: subscription.plan
      };
    },
    checkCapability: async (parent: any, args: any) => {
      return await entitlementsService.can(args.organizationId, args.featureKey, args.quantity || 1);
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
    },
    subscribeOrganizationToPlan: async (parent: any, args: any) => {
      const targetPlan = await Plan.findOne({ where: { code: args.planCode } });
      if (!targetPlan) {
        throw new Error(`Plano com código ${args.planCode} não encontrado`);
      }

      const now = new Date();
      const trialEnds = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 dias de trial sem cartão
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      let sub = await Subscription.findOne({ where: { organization_id: args.organizationId } });

      if (sub) {
        await sub.update({
          plan_id: targetPlan.id,
          status: 'active',
          current_period_start: now,
          current_period_end: periodEnd,
          founder_discount_pct: args.founderDiscountPct || sub.founder_discount_pct,
          updated_at: now
        });
      } else {
        sub = await Subscription.create({
          organization_id: args.organizationId,
          plan_id: targetPlan.id,
          status: 'trialing',
          trial_ends_at: trialEnds,
          current_period_start: now,
          current_period_end: periodEnd,
          founder_discount_pct: args.founderDiscountPct || 0.0
        });
      }

      const loaded = await Subscription.findByPk(sub.id, {
        include: [{ model: Plan, as: 'plan', include: [{ model: PlanFeature, as: 'features' }] }]
      });

      return {
        id: loaded.id,
        organizationId: loaded.organization_id,
        planId: loaded.plan_id,
        status: loaded.status,
        currentPeriodStart: loaded.current_period_start,
        currentPeriodEnd: loaded.current_period_end,
        trialEndsAt: loaded.trial_ends_at,
        cancelAtPeriodEnd: loaded.cancel_at_period_end,
        founderDiscountPct: loaded.founder_discount_pct,
        plan: loaded.plan
      };
    },
    pauseSubscription: async (parent: any, args: any) => {
      const sub = await Subscription.findByPk(args.subscriptionId);
      if (!sub) return false;
      await sub.update({ status: 'paused', updated_at: new Date() });
      return true;
    },
    cancelSubscription: async (parent: any, args: any) => {
      const sub = await Subscription.findByPk(args.subscriptionId);
      if (!sub) return false;
      await sub.update({ status: 'canceled', cancel_at_period_end: true, updated_at: new Date() });
      await entitlementsService.gracefulDowngrade(sub.organization_id);
      return true;
    }
  },
  Plan: {
    priceCents: (parent: any) => parent.price_cents || parent.priceCents || 0
  },
  PlanFeature: {
    planId: (parent: any) => parent.plan_id || parent.planId,
    featureKey: (parent: any) => parent.feature_key || parent.featureKey,
    limitValue: (parent: any) => parent.limit_value ?? parent.limitValue
  }
};

export default premiumResolvers;
