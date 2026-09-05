import { defineStore } from 'pinia';
import endorsementsService, {
  RecommendationModel,
  SkillWithEndorsements
} from '../services/endorsements.service';
import { useAuthStore } from './auth';

export const useEndorsementsStore = defineStore('endorsements', {
  state: () => ({
    skills: [] as SkillWithEndorsements[],
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
    async fetchSkills(userId: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id;
      try {
        const list = await endorsementsService.getUserSkillsWithEndorsements(userId, currentUserId);
        this.skills = list;
      } catch (err: any) {
        console.warn('Erro ao carregar competências:', err);
      }
    },

    async addSkill(userId: string | number, skillName: string) {
      try {
        const created = await endorsementsService.addUserSkill(userId, skillName);
        if (created) {
          const exists = this.skills.find(s => s.name.toLowerCase() === created.name.toLowerCase());
          if (!exists) {
            this.skills.push(created);
          }
        }
        return created;
      } catch (err: any) {
        console.warn('Erro ao adicionar competência:', err);
        return null;
      }
    },

    async removeSkill(userId: string | number, skillId: string | number) {
      try {
        const ok = await endorsementsService.removeUserSkill(userId, skillId);
        if (ok) {
          this.skills = this.skills.filter(s => String(s.id) !== String(skillId));
        }
        return ok;
      } catch (err: any) {
        console.warn('Erro ao remover competência:', err);
        return false;
      }
    },

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
