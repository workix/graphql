import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth';
import AdminLoginView from '../../views/AdminLoginView.vue';
import AdminDashboardView from '../../views/AdminDashboardView.vue';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null);
    return () => {};
  })
}));

vi.mock('../../services/firebase', () => ({
  default: {}
}));

vi.mock('../../services/graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

import * as firebaseAuth from 'firebase/auth';
import graphqlClient from '../../services/graphql';

describe('E2E Frontend Admin: Autenticação Administrativa e Proteção de Rotas', () => {
  let router: any;
  let pinia: any;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
    vi.clearAllMocks();

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', name: 'AdminLogin', component: AdminLoginView },
        { path: '/dashboard', name: 'AdminDashboard', component: AdminDashboardView, meta: { requiresAuth: true } }
      ]
    });

    router.beforeEach((to: any, from: any, next: any) => {
      const authStore = useAdminAuthStore();
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'AdminLogin' });
      } else {
        next();
      }
    });

    await router.push('/dashboard');
    await router.isReady();
  });

  it('deve redirecionar para /login ao tentar acessar o dashboard sem autenticação', async () => {
    expect(router.currentRoute.value.name).toBe('AdminLogin');
  });

  it('deve realizar login administrativo com sucesso e conceder perfil ROLE_ADMIN', async () => {
    const authStore = useAdminAuthStore();

    (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValueOnce({
      user: { uid: 'fb-admin-1', email: 'admin@workix.com' }
    });

    (graphqlClient.request as any)
      .mockResolvedValueOnce({ doLogin: 'mock-admin-jwt' })
      .mockResolvedValueOnce({
        aboutMe: {
          user: { id: 3, email: 'admin@workix.com', uuid: 'u-3', firebaseUUID: 'fb-admin-1' }
        }
      })
      .mockResolvedValueOnce({
        allJAASRoles: [
          { role: 'ROLE_ADMIN' }
        ]
      });

    await authStore.loginWithFirebase('admin@workix.com', 'AdminPass123!');

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.isAdmin).toBe(true);
    expect(authStore.token).toBe('mock-admin-jwt');
    expect(localStorage.getItem('workix_admin_token')).toBe('mock-admin-jwt');
  });

  it('deve realizar logout administrativo e limpar credenciais', async () => {
    const authStore = useAdminAuthStore();
    authStore.setAdminAuth('mock-token', { id: 3, email: 'admin@workix.com', role: 'ROLE_ADMIN' });

    expect(authStore.isAuthenticated).toBe(true);
    await authStore.logout();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
    expect(localStorage.getItem('workix_admin_token')).toBeNull();
  });
});
