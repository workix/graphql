import { describe, it, expect, beforeEach, vi } from 'vitest';
import { jobsService } from '../jobs';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('jobsService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll retorna array de vagas', async () => {
    const mockJobs = [
      { id: '1', title: 'Desenvolvedor Frontend', description: 'Vue.js e TypeScript', categories: ['CLT'] }
    ];
    (graphqlClient.request as any).mockResolvedValueOnce({ allJobs: mockJobs });

    const result = await jobsService.getAll();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Desenvolvedor Frontend');
  });

  it('getPaginated retorna lista paginada de vagas com totalPages', async () => {
    const mockPaginated = {
      jobs: [{ id: '1', title: 'Tech Lead' }],
      totalPages: 3,
      currentPage: 1,
      maxRows: 10
    };
    (graphqlClient.request as any).mockResolvedValueOnce({ allJobsPaginated: mockPaginated });

    const result = await jobsService.getPaginated({ page: 1, limit: 10 });
    expect(result.data.totalPages).toBe(3);
    expect(result.data.jobs).toHaveLength(1);
  });

  it('getById busca vaga por ID', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      getJobById: { id: '10', title: 'Engenheiro de Software' }
    });

    const result = await jobsService.getById('10');
    expect(result.data.id).toBe('10');
    expect(result.data.title).toBe('Engenheiro de Software');
  });

  it('create envia JobInput formatado para o GraphQL', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createJob: { id: '20', title: 'Product Manager', employmentType: 'CLT' }
    });

    const result = await jobsService.create({
      title: 'Product Manager',
      description: 'Gestão de produto',
      employmentType: 'CLT',
      companyId: 1
    });

    expect(result.data.id).toBe('20');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });

  it('subscribe inscreve candidato na vaga via GraphQL mutation', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ subscribeInJob: true });

    const result = await jobsService.subscribe('1', '5');
    expect(result.data).toBe(true);
  });
});
