import { entitlementsService } from '../../src/modules/premium/services/entitlements.service';
import { Plan, PlanFeature, Subscription, SubscriptionOverride, UsageCounter, Job, Purchase } from '../../src/models';

jest.mock('../../src/models', () => ({
  Plan: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  PlanFeature: {
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  Subscription: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  SubscriptionOverride: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  UsageCounter: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  Job: {
    count: jest.fn(),
    findAll: jest.fn()
  },
  Purchase: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('Entitlements Service - can() Authorization Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve permitir 1 vaga ativa no plano Free padrão', async () => {
    const orgId = 9991;
    (Subscription.findOne as jest.Mock).mockResolvedValue(null);
    (Plan.findOne as jest.Mock).mockResolvedValue({ id: 1, code: 'free_v1', name: 'Free' });
    (PlanFeature.findOne as jest.Mock).mockResolvedValue({ plan_id: 1, feature_key: 'max_active_jobs', limit_value: 1, enabled: true });
    (Job.count as jest.Mock).mockResolvedValue(0);

    const result = await entitlementsService.can(orgId, 'max_active_jobs', 1);
    expect(result.allow).toBe(true);
    expect(result.limit).toBe(1);
  });

  it('deve negar recurso não habilitado no plano e sugerir upgrade', async () => {
    const orgId = 9992;
    (Subscription.findOne as jest.Mock).mockResolvedValue(null);
    (Plan.findOne as jest.Mock).mockResolvedValue({ id: 1, code: 'free_v1', name: 'Free' });
    (PlanFeature.findOne as jest.Mock).mockResolvedValue(null);

    const result = await entitlementsService.can(orgId, 'contact_credits', 1);
    expect(result.allow).toBe(false);
    expect(result.upgradeTo).toBe('starter_v1');
  });

  it('deve respeitar subscription override de fundador ou cortesia', async () => {
    const orgId = 9993;
    const mockSub = { id: 50, organization_id: orgId, plan: { id: 1, code: 'free_v1', name: 'Free' } };
    (Subscription.findOne as jest.Mock).mockResolvedValue(mockSub);
    (SubscriptionOverride.findOne as jest.Mock).mockResolvedValue({ limit_value: 50 });
    (UsageCounter.findOne as jest.Mock).mockResolvedValue({ used: 5 });

    const result = await entitlementsService.can(orgId, 'contact_credits', 5);
    expect(result.allow).toBe(true);
    expect(result.limit).toBe(50);
  });
});
