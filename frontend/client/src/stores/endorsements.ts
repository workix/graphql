import { defineStore } from 'pinia';
import endorsementsService, {
  RecommendationModel,
  SkillWithEndorsements
} from '../services/endorsements.service';
import { useAuthStore } from './auth';

export const useEndorsementsStore = defineStore('endorsements', {
  state: () => ({
    skills: [
      { id: 1, name: 'TypeScript & JavaScript', endorsementsCount: 14, isEndorsedByMe: false },
      { id: 2, name: 'Vue.js & Pinia', endorsementsCount: 19, isEndorsedByMe: false },
      { id: 3, name: 'GraphQL & Apollo', endorsementsCount: 12, isEndorsedByMe: false },
      { id: 4, name: 'Node.js & Express / Nest', endorsementsCount: 11, isEndorsedByMe: false },
      { id: 5, name: 'Kotlin & Android Nativo', endorsementsCount: 8, isEndorsedByMe: false },
      { id: 6, name: 'Docker & Microservices', endorsementsCount: 7, isEndorsedByMe: false }
    ] as SkillWithEndorsements[],
    recommendations: [] as RecommendationModel[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    acceptedRecommendations: (state) =>
      state.recommendations.filter(r => r.status === 'ACCEPTED'),
    pendingRecommendations: (state) =>
      state.recommendations.filter(r => r.status === 'PENDING')
  },

  actions: {
    async fetchRecommendations(userId: string | number) {
      this.isLoading = true;
      this.error = null;

      try {
        const list = await endorsementsService.getUserRecommendations(userId);
        this.recommendations = list;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar recomendações.';
      } finally {
        this.isLoading = false;
      }
    },

    async toggleEndorseSkill(skillId: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      const skill = this.skills.find(s => String(s.id) === String(skillId));
      if (!skill) return;

      if (skill.isEndorsedByMe) {
        skill.isEndorsedByMe = false;
        skill.endorsementsCount = Math.max(0, skill.endorsementsCount - 1);
        await endorsementsService.unendorseSkill(skillId, currentUserId);
      } else {
        skill.isEndorsedByMe = true;
        skill.endorsementsCount++;
        await endorsementsService.endorseSkill(skillId, currentUserId);
      }
    },

    async sendRecommendation(recipientId: string | number, content: string) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      const created = await endorsementsService.createRecommendation(currentUserId, recipientId, content);
      if (created) {
        this.recommendations.unshift(created);
      }
      return created;
    },

    async moderateRecommendation(recommendationId: string | number, accept: boolean) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      const updated = await endorsementsService.respondToRecommendation(recommendationId, currentUserId, accept);
      if (updated) {
        const item = this.recommendations.find(r => String(r.id) === String(recommendationId));
        if (item) {
          item.status = accept ? 'ACCEPTED' : 'REJECTED';
        }
      }
      return updated;
    }
  }
});

export default useEndorsementsStore;
