import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adminJobsService } from '../jobs.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('adminJobsService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getPaginated retorna lista paginada de vagas para gestao', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allJobsPaginated: {
        jobs: [{ id: '1', title: 'Tech Lead', activated: true }],
        totalPages: 2,
        currentPage: 1,
        maxRows: 10
      }
    });

    const result = await adminJobsService.getPaginated({ page: 1, limit: 10 });
    expect(result.data.jobs).toHaveLength(1);
    expect(result.data.totalPages).toBe(2);
  });

  it('create cadastra nova vaga no painel admin', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createJob: { id: '50', title: 'Engenheiro de Dados', employmentType: 'PJ' }
    });

    const result = await adminJobsService.create({
      title: 'Engenheiro de Dados',
      description: 'Pipeline ETL',
      employmentType: 'PJ'
    });

    expect(result.data.id).toBe('50');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });

  it('update atualiza vaga existente', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      updateJob: { id: '50', title: 'Engenheiro de Dados Sênior', activated: true }
    });

    const result = await adminJobsService.update('50', {
      title: 'Engenheiro de Dados Sênior',
      activated: true
    });

    expect(result.data.title).toBe('Engenheiro de Dados Sênior');
  });

  it('delete remove vaga via GraphQL mutation', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ deleteJob: true });

    const result = await adminJobsService.delete('50');
    expect(result.data).toBe(true);
  });
});
