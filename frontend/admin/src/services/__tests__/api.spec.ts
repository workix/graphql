import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import api from '../api';
import { useAdminAuthStore } from '../../stores/adminAuth';

describe('api client axios interceptors (Admin)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('injeta Authorization com token admin no request', () => {
    const adminStore = useAdminAuthStore();
    adminStore.setAdminAuth('admin-secret-jwt', { id: 1, email: 'admin@workix.com', role: 'ROLE_ADMIN' });

    const requestHandler = (api.interceptors.request as any).handlers[0]?.fulfilled;
    expect(requestHandler).toBeDefined();

    const config = { headers: {} as any };
    const result = requestHandler(config);

    expect(result.headers.Authorization).toBe('Bearer admin-secret-jwt');
  });

  it('desloga admin se receber erro 401 do servidor', async () => {
    const adminStore = useAdminAuthStore();
    adminStore.setAdminAuth('admin-expired', { id: 1, email: 'admin@workix.com', role: 'ROLE_ADMIN' });
    const logoutSpy = vi.spyOn(adminStore, 'logout');

    const errorHandler = (api.interceptors.response as any).handlers[0]?.rejected;
    const error = { response: { status: 401 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
    expect(logoutSpy).toHaveBeenCalled();
  });
});
