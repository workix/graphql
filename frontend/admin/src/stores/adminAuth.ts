import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AdminUser {
  id: number;
  email: string;
  name?: string;
  role: 'ROLE_ADMIN' | 'ROLE_OPERATOR';
}

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref<string | null>(localStorage.getItem('workix_admin_token'));
  const user = ref<AdminUser | null>(
    localStorage.getItem('workix_admin_user')
      ? JSON.parse(localStorage.getItem('workix_admin_user')!)
      : null
  );

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'ROLE_ADMIN');

  function setAdminAuth(newToken: string, newAdminUser: AdminUser) {
    token.value = newToken;
    user.value = newAdminUser;
    localStorage.setItem('workix_admin_token', newToken);
    localStorage.setItem('workix_admin_user', JSON.stringify(newAdminUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('workix_admin_token');
    localStorage.removeItem('workix_admin_user');
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    setAdminAuth,
    logout
  };
});
