import graphqlClient from './graphql';

export interface SubscriptionPlanModel {
  id: string | number;
  name: string;
  price: number;
  billingPeriod?: string;
  inmailCreditsPerMonth?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSubscriptionModel {
  id: string | number;
  userId: string | number;
  planId: string | number;
  status: string;
  inmailCreditsRemaining?: number;
  startedAt?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const premiumService = {
  async getSubscriptionPlans(): Promise<SubscriptionPlanModel[]> {
    const query = `
      query GetSubscriptionPlans {
        subscriptionPlans {
          id
          name
          price
          billingPeriod
          inmailCreditsPerMonth
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ subscriptionPlans: SubscriptionPlanModel[] }>(query);
      return data.subscriptionPlans || [];
    } catch (err) {
      console.warn('Erro ao carregar planos de assinatura:', err);
      return [];
    }
  },

  async getMySubscription(userId: string | number): Promise<UserSubscriptionModel | null> {
    const query = `
      query GetMySubscription($userId: ID!) {
        mySubscription(userId: $userId) {
          id
          userId
          planId
          status
          inmailCreditsRemaining
          startedAt
          expiresAt
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ mySubscription: UserSubscriptionModel }>(query, {
        userId: String(userId)
      });
      return data.mySubscription || null;
    } catch (err) {
      console.warn('Erro ao carregar assinatura ativa:', err);
      return null;
    }
  },

  async subscribeToPlan(
    userId: string | number,
    planId: string | number
  ): Promise<UserSubscriptionModel | null> {
    const mutation = `
      mutation SubscribeToPlan($userId: ID!, $planId: ID!) {
        subscribeToPlan(userId: $userId, planId: $planId) {
          id
          userId
          planId
          status
          inmailCreditsRemaining
          startedAt
          expiresAt
        }
      }
    `;

    const data = await graphqlClient.request<{ subscribeToPlan: UserSubscriptionModel }>(mutation, {
      userId: String(userId),
      planId: String(planId)
    });
    return data.subscribeToPlan || null;
  },

  async createSubscriptionPlan(
    name: string,
    price: number,
    billingPeriod = 'MONTHLY',
    inmailCreditsPerMonth = 5
  ): Promise<SubscriptionPlanModel | null> {
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

    const data = await graphqlClient.request<{ createSubscriptionPlan: SubscriptionPlanModel }>(mutation, {
      name,
      price,
      billingPeriod,
      inmailCreditsPerMonth
    });
    return data.createSubscriptionPlan || null;
  }
};

export default premiumService;
