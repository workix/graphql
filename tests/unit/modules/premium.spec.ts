import premiumRepository, { computeExpiresAt } from '../../../src/modules/premium/repository/premium.repo';
import premiumResolvers from '../../../src/modules/premium/graphql/premium.resolvers';
import { requirePlanResolver } from '../../../src/composable_resolvers/require-plan-resolver';
import SubscriptionPlanDTO from '../../../src/dtos/SubscriptionPlanDTO';
import UserSubscriptionDTO from '../../../src/dtos/UserSubscriptionDTO';
import { SubscriptionPlan, UserSubscription } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  SubscriptionPlan: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  UserSubscription: {
    create: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('Premium Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
    jest.clearAllMocks();
  });

  describe('computeExpiresAt', () => {
    it('should add 1 month for MONTHLY billing period', () => {
      const from = new Date('2026-01-15T00:00:00.000Z');
      const result = computeExpiresAt('MONTHLY', from);
      expect(result.getUTCMonth()).toBe(1);
      expect(result.getUTCFullYear()).toBe(2026);
    });

    it('should add 1 year for YEARLY billing period', () => {
      const from = new Date('2026-01-15T00:00:00.000Z');
      const result = computeExpiresAt('YEARLY', from);
      expect(result.getUTCFullYear()).toBe(2027);
    });

    it('should default to now when no reference date is provided', () => {
      const before = Date.now();
      const result = computeExpiresAt('MONTHLY');
      expect(result.getTime()).toBeGreaterThan(before);
    });
  });

  describe('premiumRepository', () => {
    it('should create a subscription plan', async () => {
      const mockPlan = { id: 1, name: 'Premium Career', price: 29.9, billing_period: 'MONTHLY', inmail_credits_per_month: 5 };
      (SubscriptionPlan.create as jest.Mock).mockResolvedValue(mockPlan);

      const repo = premiumRepository(mockCtx.orm);
      const res = await repo.createPlan('Premium Career', 29.9, 'MONTHLY', 5);

      expect(SubscriptionPlan.create).toHaveBeenCalledWith({
        name: 'Premium Career',
        price: 29.9,
        billing_period: 'MONTHLY',
        inmail_credits_per_month: 5
      });
      expect(res).toEqual(mockPlan);
    });

    it('should default inmailCreditsPerMonth to 0 when not provided', async () => {
      const mockPlan = { id: 2, name: 'Basic', price: 0, billing_period: 'MONTHLY', inmail_credits_per_month: 0 };
      (SubscriptionPlan.create as jest.Mock).mockResolvedValue(mockPlan);

      const repo = premiumRepository(mockCtx.orm);
      await repo.createPlan('Basic', 0, 'MONTHLY');

      expect(SubscriptionPlan.create).toHaveBeenCalledWith(expect.objectContaining({ inmail_credits_per_month: 0 }));
    });

    it('should list subscription plans', async () => {
      const mockPlans = [{ id: 1, name: 'Premium Career' }];
      (SubscriptionPlan.findAll as jest.Mock).mockResolvedValue(mockPlans);

      const repo = premiumRepository(mockCtx.orm);
      expect(await repo.getPlans()).toEqual(mockPlans);
    });

    it('should throw error when subscribing to a non-existing plan', async () => {
      (SubscriptionPlan.findByPk as jest.Mock).mockResolvedValue(null);

      const repo = premiumRepository(mockCtx.orm);
      await expect(repo.subscribeToPlan(1, 99)).rejects.toThrow('Subscription plan 99 not found');
    });

    it('should create a new subscription when user has none yet', async () => {
      const mockPlan = { id: 1, name: 'Premium Career', billing_period: 'MONTHLY', inmail_credits_per_month: 5 };
      const mockSubscription = { id: 1, user_id: 10, plan_id: 1, status: 'ACTIVE' };
      (SubscriptionPlan.findByPk as jest.Mock).mockResolvedValue(mockPlan);
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(null);
      (UserSubscription.create as jest.Mock).mockResolvedValue(mockSubscription);

      const repo = premiumRepository(mockCtx.orm);
      const res = await repo.subscribeToPlan(10, 1);

      expect(UserSubscription.create).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 10,
        plan_id: 1,
        status: 'ACTIVE',
        inmail_credits_remaining: 5
      }));
      expect(res).toEqual(mockSubscription);
    });

    it('should update existing subscription when user already has one', async () => {
      const mockPlan = { id: 2, name: 'Premium Business', billing_period: 'YEARLY', inmail_credits_per_month: 20 };
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockExisting = { id: 1, user_id: 10, plan_id: 1, status: 'EXPIRED', update: mockUpdate };

      (SubscriptionPlan.findByPk as jest.Mock).mockResolvedValue(mockPlan);
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(mockExisting);

      const repo = premiumRepository(mockCtx.orm);
      const res = await repo.subscribeToPlan(10, 2);

      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        plan_id: 2,
        status: 'ACTIVE',
        inmail_credits_remaining: 20
      }));
      expect(res.status).toBe('ACTIVE');
    });

    it('should return null when user has no subscription', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(null);

      const repo = premiumRepository(mockCtx.orm);
      expect(await repo.getActiveSubscription(10)).toBeNull();
    });

    it('should return null when subscription is not ACTIVE', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue({ id: 1, status: 'CANCELED', expires_at: new Date(Date.now() + 100000) });

      const repo = premiumRepository(mockCtx.orm);
      expect(await repo.getActiveSubscription(10)).toBeNull();
    });

    it('should return null when subscription is ACTIVE but expired', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue({ id: 1, status: 'ACTIVE', expires_at: new Date(Date.now() - 100000) });

      const repo = premiumRepository(mockCtx.orm);
      expect(await repo.getActiveSubscription(10)).toBeNull();
    });

    it('should return the subscription when ACTIVE and not expired', async () => {
      const mockSubscription = { id: 1, status: 'ACTIVE', expires_at: new Date(Date.now() + 100000) };
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription);

      const repo = premiumRepository(mockCtx.orm);
      expect(await repo.getActiveSubscription(10)).toEqual(mockSubscription);
    });

    it('should throw error when decrementing InMail credit without an active subscription', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(null);

      const repo = premiumRepository(mockCtx.orm);
      await expect(repo.decrementInMailCredit(10)).rejects.toThrow('No InMail credits available');
    });

    it('should throw error when decrementing InMail credit with no credits remaining', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue({ id: 1, status: 'ACTIVE', expires_at: new Date(Date.now() + 100000), inmail_credits_remaining: 0 });

      const repo = premiumRepository(mockCtx.orm);
      await expect(repo.decrementInMailCredit(10)).rejects.toThrow('No InMail credits available');
    });

    it('should decrement InMail credit when available', async () => {
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockSubscription = { id: 1, status: 'ACTIVE', expires_at: new Date(Date.now() + 100000), inmail_credits_remaining: 3, update: mockUpdate };
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription);

      const repo = premiumRepository(mockCtx.orm);
      const res = await repo.decrementInMailCredit(10);

      expect(mockUpdate).toHaveBeenCalledWith({ inmail_credits_remaining: 2 });
      expect(res.inmail_credits_remaining).toBe(2);
    });
  });

  describe('premiumResolvers', () => {
    it('should resolve queries and mutations for premium', async () => {
      const mockPlan = { id: 1, name: 'Premium Career', billing_period: 'MONTHLY', inmail_credits_per_month: 5 };
      const mockSubscription = {
        id: 1,
        user_id: 10,
        plan_id: 1,
        status: 'ACTIVE',
        expires_at: new Date(Date.now() + 100000),
        update: jest.fn().mockResolvedValue(true)
      };

      (SubscriptionPlan.findAll as jest.Mock).mockResolvedValue([mockPlan]);
      (SubscriptionPlan.create as jest.Mock).mockResolvedValue(mockPlan);
      (SubscriptionPlan.findByPk as jest.Mock).mockResolvedValue(mockPlan);
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription);
      (UserSubscription.create as jest.Mock).mockResolvedValue(mockSubscription);

      const q = premiumResolvers.Query;
      const m = premiumResolvers.Mutation;

      const plans = await q.subscriptionPlans(null, {}, mockCtx, {});
      expect(plans[0]).toBeInstanceOf(SubscriptionPlanDTO);

      const mySub = await q.mySubscription(null, { userId: 10 }, mockCtx, {});
      expect(mySub).toBeInstanceOf(UserSubscriptionDTO);

      const createdPlan = await m.createSubscriptionPlan(null, { name: 'Premium Career', price: 29.9, billingPeriod: 'MONTHLY', inmailCreditsPerMonth: 5 }, mockCtx, {});
      expect(createdPlan).toBeInstanceOf(SubscriptionPlanDTO);

      const subscribed = await m.subscribeToPlan(null, { userId: 10, planId: 1 }, mockCtx, {});
      expect(subscribed).toBeInstanceOf(UserSubscriptionDTO);
    });

    it('should return null for mySubscription when user has no active subscription', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(null);
      const q = premiumResolvers.Query;

      const res = await q.mySubscription(null, { userId: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('requirePlanResolver composable', () => {
    it('should call the wrapped resolver when the user has an active subscription', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue({ id: 1, status: 'ACTIVE', expires_at: new Date(Date.now() + 100000) });

      const inner = jest.fn().mockResolvedValue('ok');
      const guarded = requirePlanResolver()(inner);
      const ctx = { orm: {}, user: { id: 10 } };

      const res = await guarded(null, {}, ctx, {});

      expect(res).toBe('ok');
      expect(inner).toHaveBeenCalledWith(null, {}, ctx, {});
    });

    it('should reject when the user has no active subscription', async () => {
      (UserSubscription.findOne as jest.Mock).mockResolvedValue(null);

      const inner = jest.fn();
      const guarded = requirePlanResolver()(inner);
      const ctx = { orm: {}, user: { id: 10 } };

      await expect(guarded(null, {}, ctx, {})).rejects.toThrow('Premium plan required for this action');
      expect(inner).not.toHaveBeenCalled();
    });
  });

  describe('DTOs null check', () => {
    it('should handle null input gracefully', () => {
      const pNull = new SubscriptionPlanDTO(null);
      expect(pNull.id).toBeUndefined();

      const sNull = new UserSubscriptionDTO(null);
      expect(sNull.id).toBeUndefined();
    });

    it('should map camelCase fields when snake_case is absent', () => {
      const now = new Date();
      const p = new SubscriptionPlanDTO({
        id: 1,
        name: 'Premium',
        price: 10,
        billingPeriod: 'MONTHLY',
        inmailCreditsPerMonth: 5,
        createdAt: now,
        updatedAt: now
      });
      expect(p.billingPeriod).toBe('MONTHLY');
      expect(p.inmailCreditsPerMonth).toBe(5);
      expect(p.createdAt).toBe(now);
      expect(p.updatedAt).toBe(now);

      const s = new UserSubscriptionDTO({
        id: 1,
        userId: 10,
        planId: 1,
        status: 'ACTIVE',
        inmailCreditsRemaining: 3,
        startedAt: now,
        expiresAt: now,
        createdAt: now,
        updatedAt: now
      });
      expect(s.userId).toBe(10);
      expect(s.planId).toBe(1);
      expect(s.inmailCreditsRemaining).toBe(3);
      expect(s.startedAt).toBe(now);
      expect(s.expiresAt).toBe(now);
      expect(s.createdAt).toBe(now);
      expect(s.updatedAt).toBe(now);
    });
  });
});
