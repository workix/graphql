import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  role?: string;
  firebase_uuid?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('workix_token'));
  const user = ref<UserProfile | null>(
    localStorage.getItem('workix_user')
      ? JSON.parse(localStorage.getItem('workix_user')!)
      : null
  );

  const isAuthenticated = computed(() => !!token.value);
  const isCandidate = computed(() => user.value?.role === 'CANDIDATE' || !user.value?.role);
  const isCompany = computed(() => user.value?.role === 'COMPANY');

  function setAuth(newToken: string, newUserProfile: UserProfile) {
    token.value = newToken;
    user.value = newUserProfile;
    localStorage.setItem('workix_token', newToken);
    localStorage.setItem('workix_user', JSON.stringify(newUserProfile));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('workix_token');
    localStorage.removeItem('workix_user');
  }

  return {
    token,
    user,
    isAuthenticated,
    isCandidate,
    isCompany,
    setAuth,
    logout
  };
});
