import { describe, it, expect, beforeEach, vi } from 'vitest';
import plansAdminService from '../plansAdmin.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('plansAdminService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getPlans lista planos de assinatura premium', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      subscriptionPlans: [
        { id: '1', name: 'Recruiter Pro', price: 149.90, inmailCreditsPerMonth: 20 }
      ]
    });

    const plans = await plansAdminService.getPlans();
    expect(plans).toHaveLength(1);
    expect(plans[0].name).toBe('Recruiter Pro');
    expect(plans[0].price).toBe(149.90);
  });

  it('createPlan cria novo plano com creditos de InMail', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createSubscriptionPlan: { id: '5', name: 'Enterprise VIP', price: 299.90, inmailCreditsPerMonth: 100 }
    });

    const plan = await plansAdminService.createPlan({
      name: 'Enterprise VIP',
      price: 299.90,
      billingPeriod: 'MONTHLY',
      inmailCreditsPerMonth: 100
    });

    expect(plan?.id).toBe('5');
    expect(plan?.name).toBe('Enterprise VIP');
  });
});
