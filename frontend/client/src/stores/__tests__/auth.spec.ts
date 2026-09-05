import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
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

describe('useAuthStore (Client)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('inicializa com estado desautenticado quando localStorage esta vazio', () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isCandidate).toBe(true);
    expect(store.isCompany).toBe(false);
  });

  it('setAuth persiste token e usuario no estado e localStorage', () => {
    const store = useAuthStore();
    const mockUser = { id: 1, email: 'user@workix.com', role: 'CANDIDATE', name: 'User Test' };
    store.setAuth('jwt-123', mockUser);

    expect(store.token).toBe('jwt-123');
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(localStorage.getItem('workix_token')).toBe('jwt-123');
    expect(JSON.parse(localStorage.getItem('workix_user')!)).toEqual(mockUser);
  });

  it('syncBackendSession sincroniza com GraphQL e define role COMPANY para empresa', async () => {
    const store = useAuthStore();
    (graphqlClient.request as any)
      .mockResolvedValueOnce({ doLogin: 'mock-jwt-token' })
      .mockResolvedValueOnce({
        aboutMe: {
          user: { id: '10', email: 'empresa@workix.com' },
          company: { id: '5', name: 'Empresa Alpha' }
        }
      });

    const profile = await store.syncBackendSession('fb-123', 'empresa@workix.com');
    expect(profile.name).toBe('Empresa Alpha');
    expect(profile.role).toBe('COMPANY');
    expect(store.token).toBe('mock-jwt-token');
    expect(store.isCompany).toBe(true);
    expect(store.isCandidate).toBe(false);
  });

  it('loginWithFirebase autentica com sucesso e chama syncBackendSession', async () => {
    const store = useAuthStore();
    (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValueOnce({
      user: { uid: 'uid-candidate-1', email: 'candidato@workix.com' }
    });
    (graphqlClient.request as any)
      .mockResolvedValueOnce({ doLogin: 'cand-jwt' })
      .mockResolvedValueOnce({ aboutMe: null });

    const profile = await store.loginWithFirebase('candidato@workix.com', 'secret123');
    expect(profile.email).toBe('candidato@workix.com');
    expect(store.token).toBe('cand-jwt');
  });

  it('logout limpa estado e localStorage', async () => {
    const store = useAuthStore();
    store.setAuth('token-to-delete', { id: 1, email: 'test@workix.com' });
    expect(store.isAuthenticated).toBe(true);

    await store.logout();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('workix_token')).toBeNull();
  });

  it('initAuthListener escuta mudancas de sessao Firebase', () => {
    const store = useAuthStore();
    store.initAuthListener();
    expect(store.isAuthInitialized).toBe(true);
  });
});
