import { defineStore } from 'pinia';
import analyticsService, {
  SocialSellingScoreModel,
  ProfileViewModel
} from '../services/analytics.service';
import { useAuthStore } from './auth';

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    ssiScore: null as SocialSellingScoreModel | null,
    profileViews: [] as ProfileViewModel[],
    isLoading: false,
    isRecalculating: false,
    error: null as string | null
  }),

  getters: {
    totalScore: (state) => state.ssiScore?.score || 0,
    postsScore: (state) => state.ssiScore?.postsScore || 0,
    networkScore: (state) => state.ssiScore?.networkScore || 0,
    engagementScore: (state) => state.ssiScore?.engagementScore || 0,
    relationshipsScore: (state) => state.ssiScore?.relationshipsScore || 0
  },

  actions: {
    async fetchSSI() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const score = await analyticsService.getMySocialSellingIndex(currentUserId);
        this.ssiScore = score || {
          userId: currentUserId,
          score: 72,
          postsScore: 18,
          networkScore: 20,
          engagementScore: 17,
          relationshipsScore: 17
        };
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar SSI.';
      } finally {
        this.isLoading = false;
      }
    },

    async recalculateSSI() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isRecalculating = true;
      this.error = null;

      try {
        const updated = await analyticsService.recalculateSocialSellingIndex(currentUserId);
        if (updated) {
          this.ssiScore = updated;
        }
        return updated;
      } catch (err: any) {
        this.error = err.message || 'Erro ao recalcular SSI.';
      } finally {
        this.isRecalculating = false;
      }
    },

    async fetchProfileViews() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const views = await analyticsService.getWhoViewedMyProfile(currentUserId);
        this.profileViews = views;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar visualizadores de perfil.';
      } finally {
        this.isLoading = false;
      }
    }
  }
});

export default useAnalyticsStore;
