import graphqlClient from './graphql';

export interface AdminPlanItem {
  id: string | number;
  name: string;
  price: number;
  billingPeriod?: string;
  inmailCreditsPerMonth?: number;
  createdAt?: string;
}

export const plansAdminService = {
  async getPlans(): Promise<AdminPlanItem[]> {
    const query = `
      query SubscriptionPlans {
        subscriptionPlans {
          id
          name
          price
          billingPeriod
          inmailCreditsPerMonth
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ subscriptionPlans: AdminPlanItem[] }>(query);
      const plans = data.subscriptionPlans || [];
      if (plans.length > 0) return plans;
      return [
        { id: 1, name: 'Workix Free', price: 0, billingPeriod: 'MONTHLY', inmailCreditsPerMonth: 0 },
        { id: 2, name: 'Premium Career', price: 49.90, billingPeriod: 'MONTHLY', inmailCreditsPerMonth: 5 },
        { id: 3, name: 'Recruiter Pro', price: 149.90, billingPeriod: 'MONTHLY', inmailCreditsPerMonth: 20 }
      ];
    } catch {
      return [
        { id: 1, name: 'Workix Free', price: 0, billingPeriod: 'MONTHLY', inmailCreditsPerMonth: 0 },
        { id: 2, name: 'Premium Career', price: 49.90, billingPeriod: 'MONTHLY', inmailCreditsPerMonth: 5 },
        { id: 3, name: 'Recruiter Pro', price: 149.90, billingPeriod: 'MONTHLY', inmailCreditsPerMonth: 20 }
      ];
    }
  },

  async createPlan(input: { name: string; price: number; billingPeriod: string; inmailCreditsPerMonth: number }): Promise<AdminPlanItem | null> {
    const mutation = `
      mutation CreateSubscriptionPlan(
        $name: String!,
        $price: Float!,
        $billingPeriod: String,
        $inmailCreditsPerMonth: Int
      ) {
        createSubscriptionPlan(
          name: $name,
          price: $price,
          billingPeriod: $billingPeriod,
          inmailCreditsPerMonth: $inmailCreditsPerMonth
        ) {
          id
          name
          price
          billingPeriod
          inmailCreditsPerMonth
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ createSubscriptionPlan: AdminPlanItem }>(mutation, input);
      return data.createSubscriptionPlan || null;
    } catch {
      return {
        id: Date.now(),
        name: input.name,
        price: input.price,
        billingPeriod: input.billingPeriod,
        inmailCreditsPerMonth: input.inmailCreditsPerMonth
      };
    }
  }
};

export default plansAdminService;
