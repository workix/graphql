import { entitlementsService } from '../../src/modules/premium/services/entitlements.service';
import { Plan, PlanFeature, Subscription, SubscriptionOverride, UsageCounter, Job } from '../../src/models';

describe('Entitlements Service - can() Authorization Engine', () => {
  beforeAll(async () => {
    // Seed test plans
    const now = new Date();
    await Plan.findOrCreate({
      where: { code: 'free_v1' },
      defaults: { id: 101, code: 'free_v1', name: 'Free', price_cents: 0, active: true }
    });
    await Plan.findOrCreate({
      where: { code: 'starter_v1' },
      defaults: { id: 102, code: 'starter_v1', name: 'Starter', price_cents: 7900, active: true }
    });
    await Plan.findOrCreate({
      where: { code: 'pro_v1' },
      defaults: { id: 103, code: 'pro_v1', name: 'Pro', price_cents: 24900, active: true }
    });

    // Seed plan features
    await PlanFeature.findOrCreate({
      where: { plan_id: 101, feature_key: 'max_active_jobs' },
      defaults: { plan_id: 101, feature_key: 'max_active_jobs', limit_value: 1, enabled: true }
    });
    await PlanFeature.findOrCreate({
      where: { plan_id: 102, feature_key: 'max_active_jobs' },
      defaults: { plan_id: 102, feature_key: 'max_active_jobs', limit_value: 3, enabled: true }
    });
    await PlanFeature.findOrCreate({
      where: { plan_id: 102, feature_key: 'contact_credits' },
      defaults: { plan_id: 102, feature_key: 'contact_credits', limit_value: 10, enabled: true }
    });
  });

  it('deve permitir 1 vaga ativa no plano Free padrão', async () => {
    const orgId = 9991;
    const result = await entitlementsService.can(orgId, 'max_active_jobs', 1);
    expect(result.allow).toBe(true);
    expect(result.limit).toBe(1);
  });

  it('deve negar recurso não habilitado no plano e sugerir upgrade', async () => {
    const orgId = 9992;
    const result = await entitlementsService.can(orgId, 'contact_credits', 1);
    expect(result.allow).toBe(false);
    expect(result.upgradeTo).toBe('starter_v1');
  });

  it('deve respeitar subscription override de fundador ou cortesia', async () => {
    const orgId = 9993;
    const sub = await Subscription.create({
      organization_id: orgId,
      plan_id: 101,
      status: 'active'
    });

    await SubscriptionOverride.create({
      subscription_id: sub.id,
      feature_key: 'contact_credits',
      limit_value: 50,
      reason: 'Bônus fundador'
    });

    const result = await entitlementsService.can(orgId, 'contact_credits', 5);
    expect(result.allow).toBe(true);
    expect(result.limit).toBe(50);
  });
});
