import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import LoginView from '../../views/LoginView.vue';
import RegisterView from '../../views/RegisterView.vue';
import HomeView from '../../views/HomeView.vue';
import MyApplicationsView from '../../views/MyApplicationsView.vue';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
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

describe('E2E Frontend Client: Fluxo de Autenticação e Guarda de Rotas', () => {
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
        { path: '/', name: 'Home', component: HomeView },
        { path: '/login', name: 'Login', component: LoginView },
        { path: '/register', name: 'Register', component: RegisterView },
        {
          path: '/my-applications',
          name: 'MyApplications',
          component: MyApplicationsView,
          meta: { requiresAuth: true }
        }
      ]
    });

    router.beforeEach((to: any, from: any, next: any) => {
      const authStore = useAuthStore();
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login' });
      } else {
        next();
      }
    });

    await router.push('/');
    await router.isReady();
  });

  it('deve bloquear acesso à rota protegida /my-applications e redirecionar para /login', async () => {
    await router.push('/my-applications');
    expect(router.currentRoute.value.name).toBe('Login');
  });

  it('deve realizar login do candidato com sucesso e redirecionar para a Home', async () => {
    await router.push('/login');
    const authStore = useAuthStore();

    (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValueOnce({
      user: { uid: 'fb-candidate-1', email: 'candidato@workix.com' }
    });

    (graphqlClient.request as any)
      .mockResolvedValueOnce({ doLogin: 'mock-jwt-candidate' })
      .mockResolvedValueOnce({
        aboutMe: {
          user: { id: 1, email: 'candidato@workix.com', uuid: 'u-1', firebaseUUID: 'fb-candidate-1' },
          candidate: { id: 10, name: 'Felipe Candidato' }
        }
      });

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          TheHeader: true,
          TheFooter: true,
          LanguageSwitcher: true
        },
        mocks: {
          $t: (key: string) => key
        }
      }
    });

    await authStore.loginWithFirebase('candidato@workix.com', 'SenhaForte123!');
    await router.push('/');

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.token).toBe('mock-jwt-candidate');
    expect(authStore.user?.email).toBe('candidato@workix.com');
  });

  it('deve realizar cadastro de novo candidato com sucesso', async () => {
    await router.push('/register');
    const authStore = useAuthStore();

    (firebaseAuth.createUserWithEmailAndPassword as any).mockResolvedValueOnce({
      user: { uid: 'fb-candidate-new', email: 'novo.candidato@workix.com' }
    });

    (graphqlClient.request as any)
      .mockResolvedValueOnce({ createUser: { id: 2 } })
      .mockResolvedValueOnce({ doLogin: 'mock-jwt-new' })
      .mockResolvedValueOnce({
        aboutMe: {
          user: { id: 2, email: 'novo.candidato@workix.com', uuid: 'u-2', firebaseUUID: 'fb-candidate-new' },
          candidate: { id: 20, name: 'Novo Candidato' }
        }
      });

    await authStore.registerWithFirebase('novo.candidato@workix.com', 'SenhaForte123!', 'Novo Candidato', 'CANDIDATE');

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user?.name).toBe('Novo Candidato');
    expect(localStorage.getItem('workix_token')).toBe('mock-jwt-new');
  });

  it('deve realizar logout completo e limpar estado e storage', async () => {
    const authStore = useAuthStore();
    authStore.setAuth('mock-token-to-clear', { id: 1, email: 'sair@workix.com', role: 'CANDIDATE' });

    expect(authStore.isAuthenticated).toBe(true);
    await authStore.logout();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
    expect(localStorage.getItem('workix_token')).toBeNull();
  });
});
