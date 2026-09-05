import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adminCompaniesService } from '../companies.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('adminCompaniesService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getPaginated retorna lista de empresas', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allCompaniesPaginated: {
        companies: [{ id: '1', name: 'Workix Corp', cnpj: '12.345.678/0001-90' }],
        totalPages: 1,
        currentPage: 1,
        maxRows: 10
      }
    });

    const result = await adminCompaniesService.getPaginated(1, 10);
    expect(result.data.companies).toHaveLength(1);
    expect(result.data.companies[0].name).toBe('Workix Corp');
  });

  it('create cadastra nova empresa', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createCompany: { id: '10', name: 'Startup Inovadora' }
    });

    const result = await adminCompaniesService.create({ name: 'Startup Inovadora' });
    expect(result.data.id).toBe('10');
  });

  it('update modifica dados cadastrais da empresa', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      updateCompany: { id: '10', name: 'Startup Inovadora LTDA' }
    });

    const result = await adminCompaniesService.update('10', { name: 'Startup Inovadora LTDA' });
    expect(result.data.name).toBe('Startup Inovadora LTDA');
  });

  it('delete exclui empresa', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ deleteCompany: true });

    const result = await adminCompaniesService.delete('10');
    expect(result.data).toBe(true);
  });
});
