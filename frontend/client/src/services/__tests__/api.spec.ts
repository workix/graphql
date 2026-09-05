import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import api from '../api';
import { useAuthStore } from '../../stores/auth';

describe('api client axios interceptors', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('adiciona cabecalho Authorization quando existe token na store', async () => {
    const authStore = useAuthStore();
    authStore.setAuth('jwt-valid-token', { id: 1, email: 'test@workix.com' });

    // Inspeciona interceptor de request
    const requestHandler = (api.interceptors.request as any).handlers[0]?.fulfilled;
    expect(requestHandler).toBeDefined();

    const config = { headers: {} as any };
    const result = requestHandler(config);

    expect(result.headers.Authorization).toBe('Bearer jwt-valid-token');
  });

  it('chama logout quando o interceptor de resposta recebe status 401', async () => {
    const authStore = useAuthStore();
    authStore.setAuth('jwt-expired', { id: 1, email: 'test@workix.com' });
    const logoutSpy = vi.spyOn(authStore, 'logout');

    const errorHandler = (api.interceptors.response as any).handlers[0]?.rejected;
    expect(errorHandler).toBeDefined();

    const error = { response: { status: 401 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
    expect(logoutSpy).toHaveBeenCalled();
  });
});
