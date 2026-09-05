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
    inmailCredits: (state) => state.mySubscription?.inmailCreditsRemaining ?? 0,
    candidatePlans: (state) => {
      const filtered = state.plansList.filter(
        (p) => p.name.toLowerCase().includes('candidato') || (!p.name.toLowerCase().includes('empresa') && p.price < 200)
      );
      if (filtered.length > 0) return filtered;
      return [
        {
          id: 1,
          name: 'Workix Free (Candidato)',
          price: 0,
          billingPeriod: 'MONTHLY',
          inmailCreditsPerMonth: 0
        },
        {
          id: 2,
          name: 'Workix Premium Mensal (Candidato)',
          price: 19.90,
          billingPeriod: 'MONTHLY',
          inmailCreditsPerMonth: 5
        },
        {
          id: 3,
          name: 'Workix Premium Anual (Candidato)',
          price: 199.00,
          billingPeriod: 'YEARLY',
          inmailCreditsPerMonth: 15
        }
      ];
    },
    companyPlans: (state) => {
      const filtered = state.plansList.filter(
        (p) => p.name.toLowerCase().includes('empresa') || p.name.toLowerCase().includes('starter') || p.name.toLowerCase().includes('pro') || p.name.toLowerCase().includes('business')
      );
      if (filtered.length > 0) return filtered;
      return [
        {
          id: 101,
          name: 'Workix Free (Empresas)',
          price: 0,
          billingPeriod: 'MONTHLY',
          inmailCreditsPerMonth: 0
        },
        {
          id: 4,
          name: 'Workix Starter (Empresas)',
          price: 79.00,
          billingPeriod: 'MONTHLY',
          inmailCreditsPerMonth: 10
        },
        {
          id: 5,
          name: 'Workix Pro (Empresas)',
          price: 249.00,
          billingPeriod: 'MONTHLY',
          inmailCreditsPerMonth: 60
        },
        {
          id: 6,
          name: 'Workix Business (Empresas)',
          price: 699.00,
          billingPeriod: 'MONTHLY',
          inmailCreditsPerMonth: 250
        }
      ];
    }
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
          this.plansList = [
            {
              id: 1,
              name: 'Workix Free (Candidato)',
              price: 0,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 0
            },
            {
              id: 2,
              name: 'Workix Premium Mensal (Candidato)',
              price: 19.90,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 5
            },
            {
              id: 3,
              name: 'Workix Premium Anual (Candidato)',
              price: 199.00,
              billingPeriod: 'YEARLY',
              inmailCreditsPerMonth: 15
            },
            {
              id: 4,
              name: 'Workix Starter (Empresas)',
              price: 79.00,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 10
            },
            {
              id: 5,
              name: 'Workix Pro (Empresas)',
              price: 249.00,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 60
            },
            {
              id: 6,
              name: 'Workix Business (Empresas)',
              price: 699.00,
              billingPeriod: 'MONTHLY',
              inmailCreditsPerMonth: 250
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
