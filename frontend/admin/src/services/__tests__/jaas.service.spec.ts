import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adminJAASService } from '../jaas.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('adminJAASService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUsersPaginated lista usuarios JAAS com suas respectivas roles', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allJAASUsersPaginated: {
        jaasUsers: [{ id: '1', login: 'admin', roles: [{ name: 'ROLE_ADMIN' }] }],
        totalPages: 1,
        currentPage: 1,
        maxRows: 10
      }
    });

    const result = await adminJAASService.getUsersPaginated(1, 10);
    expect(result.data.jaasUsers).toHaveLength(1);
    expect(result.data.jaasUsers[0].roles?.[0].name).toBe('ROLE_ADMIN');
  });

  it('getRolesPaginated lista permissoes/roles cadastradas', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allJAASRolesPaginated: {
        jaasRoles: [{ name: 'ROLE_ADMIN' }, { name: 'ROLE_RECRUITER' }],
        totalPages: 1,
        currentPage: 1,
        maxRows: 10
      }
    });

    const result = await adminJAASService.getRolesPaginated(1, 10);
    expect(result.data.jaasRoles).toHaveLength(2);
  });

  it('createRole cadastra novo papel de acesso', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createJAASRole: { name: 'ROLE_AUDITOR' }
    });

    const result = await adminJAASService.createRole('ROLE_AUDITOR');
    expect(result.data.name).toBe('ROLE_AUDITOR');
  });

  it('deleteRole exclui papel de acesso', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ deleteJAASRole: true });

    const result = await adminJAASService.deleteRole('ROLE_AUDITOR');
    expect(result.data).toBe(true);
  });
});
