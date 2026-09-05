import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAdminAuthStore } from '../adminAuth';

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

describe('useAdminAuthStore (Admin)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('inicializa desautenticado por padrao', () => {
    const store = useAdminAuthStore();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isAdmin).toBe(false);
  });

  it('setAdminAuth persiste sessao administrativa', () => {
    const store = useAdminAuthStore();
    const adminData = { id: 1, email: 'admin@workix.com', role: 'ROLE_ADMIN' as const, name: 'Admin Root' };
    store.setAdminAuth('admin-jwt-token', adminData);

    expect(store.token).toBe('admin-jwt-token');
    expect(store.isAuthenticated).toBe(true);
    expect(store.isAdmin).toBe(true);
    expect(localStorage.getItem('workix_admin_token')).toBe('admin-jwt-token');
  });

  it('syncAdminBackendSession autentica com GraphQL', async () => {
    const store = useAdminAuthStore();
    (graphqlClient.request as any)
      .mockResolvedValueOnce({ doLogin: 'admin-jwt-123' })
      .mockResolvedValueOnce({ aboutMe: { user: { id: '1', email: 'admin@workix.com' } } });

    const admin = await store.syncAdminBackendSession('fb-adm-1', 'admin@workix.com');
    expect(admin.email).toBe('admin@workix.com');
    expect(store.token).toBe('admin-jwt-123');
    expect(store.isAdmin).toBe(true);
  });

  it('loginWithFirebase autentica no Firebase e sincroniza sessao', async () => {
    const store = useAdminAuthStore();
    (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValueOnce({
      user: { uid: 'fb-adm-9', email: 'admin@workix.com' }
    });
    (graphqlClient.request as any)
      .mockResolvedValueOnce({ doLogin: 'admin-jwt-token' })
      .mockResolvedValueOnce({ aboutMe: null });

    const admin = await store.loginWithFirebase('admin@workix.com', 'adminPass123');
    expect(admin.email).toBe('admin@workix.com');
  });

  it('logout remove token e dados de usuario do admin', async () => {
    const store = useAdminAuthStore();
    store.setAdminAuth('token-to-clear', { id: 1, email: 'adm@workix.com', role: 'ROLE_ADMIN' });
    expect(store.isAuthenticated).toBe(true);

    await store.logout();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('workix_admin_token')).toBeNull();
  });
});
