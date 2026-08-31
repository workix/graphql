import { defineStore } from 'pinia';
import premiumService, {
  SubscriptionPlanModel,
  UserSubscriptionModel
} from '../services/premium.service';
import { useAuthStore } from './auth';

export const usePremiumStore = defineStore('premium', {
  state: () => ({
    plansList: [] as SubscriptionPlanModel[],
    mySubscription: null as UserSubscriptionModel | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    isPremiumActive: (state) => state.mySubscription?.status === 'ACTIVE',
    inmailCredits: (state) => state.mySubscription?.inmailCreditsRemaining ?? 0
  },

  actions: {
    async fetchPlans() {
      this.isLoading = true;
      this.error = null;

      try {
        const plans = await premiumService.getSubscriptionPlans();
        if (plans.length > 0) {
          this.plansList = plans;
        } else {
          // Fallback realistic subscription tiers
          this.plansList = [
            {
              id: 1,
              name: 'Workix Free',
              price: 0,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 0
            },
            {
              id: 2,
              name: 'Premium Career',
              price: 49.90,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 5
            },
            {
              id: 3,
              name: 'Recruiter & Business Pro',
              price: 149.90,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 20
            }
          ];
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar planos.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMySubscription() {
      const authStore = useAuthStore();
      const userId = authStore.user?.id || 1;

      try {
        const sub = await premiumService.getMySubscription(userId);
        this.mySubscription = sub;
      } catch (err: any) {
        console.warn('Erro ao carregar assinatura do usuário:', err);
      }
    },

    async subscribe(planId: string | number) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id || 1;
      this.isLoading = true;
      this.error = null;

      try {
        const sub = await premiumService.subscribeToPlan(userId, planId);
        this.mySubscription = sub || {
          id: '1',
          userId,
          planId,
          status: 'ACTIVE',
          inmailCreditsRemaining: 10,
          startedAt: new Date().toISOString()
        };
        return this.mySubscription;
      } catch (err: any) {
        this.error = err.message || 'Erro ao assinar plano.';
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
});

export default usePremiumStore;
