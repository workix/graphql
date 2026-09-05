import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adminUsersService } from '../users.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('adminUsersService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getPaginated retorna lista paginada de usuarios', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allUsersPaginated: {
        users: [{ id: '1', email: 'user@workix.com', activated: true }],
        totalPages: 1,
        currentPage: 1,
        maxRows: 10
      }
    });

    const result = await adminUsersService.getPaginated(1, 10);
    expect(result.data.users).toHaveLength(1);
    expect(result.data.users[0].email).toBe('user@workix.com');
  });

  it('create cria novo usuario no backend', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createUser: { id: '99', email: 'novo@workix.com', activated: true }
    });

    const result = await adminUsersService.create({ email: 'novo@workix.com' });
    expect(result.data.id).toBe('99');
  });

  it('update modifica status e dados do usuario', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      updateUser: { id: '99', email: 'novo@workix.com', activated: false }
    });

    const result = await adminUsersService.update('99', { email: 'novo@workix.com', activated: false });
    expect(result.data.activated).toBe(false);
  });

  it('delete exclui usuario', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ deleteUser: true });

    const result = await adminUsersService.delete('99');
    expect(result.data).toBe(true);
  });
});
