import { describe, it, expect, beforeEach, vi } from 'vitest';
import formsAdminService from '../formsAdmin.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('formsAdminService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getFormsPaginated lista mensagens de contato recebidas', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allFormsPaginated: {
        forms: [{ id: '1', name: 'Maria Souza', email: 'maria@empresa.com', subject: 'Dúvida comercial' }],
        totalPages: 1,
        currentPage: 1,
        maxRows: 1
      }
    });

    const result = await formsAdminService.getFormsPaginated(1, 10);
    expect(result.forms).toHaveLength(1);
    expect(result.forms[0].name).toBe('Maria Souza');
  });

  it('deleteForm exclui mensagem de suporte', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ deleteForm: true });

    const result = await formsAdminService.deleteForm('1');
    expect(result).toBe(true);
  });
});
