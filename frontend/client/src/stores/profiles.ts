import { defineStore } from 'pinia';
import profilesService, { UserProfileModel, ProfileInput, FeaturedItemModel } from '../services/profiles.service';
import { useAuthStore } from './auth';

export const useProfilesStore = defineStore('profiles', {
  state: () => ({
    myProfile: null as UserProfileModel | null,
    myFeaturedItems: [] as FeaturedItemModel[],
    currentViewingProfile: null as UserProfileModel | null,
    currentViewingFeatured: [] as FeaturedItemModel[],
    isLoading: false,
    isSaving: false,
    error: null as string | null
  }),

  actions: {
    async fetchMyProfile() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const [profile, featured] = await Promise.all([
          profilesService.getProfileByUserId(currentUserId),
          profilesService.getUserFeaturedItems(currentUserId)
        ]);

        this.myProfile = profile || {
          userId: currentUserId,
          headline: '',
          about: '',
          location: '',
          industry: '',
          openToWork: false
        };
        this.myFeaturedItems = featured;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar dados do perfil.';
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(input: ProfileInput) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isSaving = true;
      this.error = null;

      try {
        const updated = await profilesService.updateMyProfile(currentUserId, input);
        if (updated) {
          this.myProfile = updated;
        }
        return updated;
      } catch (err: any) {
        this.error = err.message || 'Erro ao salvar perfil.';
        throw err;
      } finally {
        this.isSaving = false;
      }
    },

    async fetchPublicProfile(userId: string | number) {
      this.isLoading = true;
      this.error = null;

      try {
        const [profile, featured] = await Promise.all([
          profilesService.getProfileByUserId(userId),
          profilesService.getUserFeaturedItems(userId)
        ]);

        this.currentViewingProfile = profile;
        this.currentViewingFeatured = featured;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar perfil público.';
      } finally {
        this.isLoading = false;
      }
    },

    async addFeatured(type: string, title: string, url?: string) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      try {
        const newItem = await profilesService.addFeaturedItem(currentUserId, type, title, url);
        if (newItem) {
          this.myFeaturedItems.unshift(newItem);
        }
        return newItem;
      } catch (err: any) {
        this.error = err.message || 'Erro ao adicionar item em destaque.';
        throw err;
      }
    },

    async deleteFeatured(id: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      try {
        const success = await profilesService.removeFeaturedItem(id, currentUserId);
        if (success) {
          this.myFeaturedItems = this.myFeaturedItems.filter(item => String(item.id) !== String(id));
        }
        return success;
      } catch (err: any) {
        this.error = err.message || 'Erro ao remover destaque.';
        throw err;
      }
    }
  }
});

export default useProfilesStore;
