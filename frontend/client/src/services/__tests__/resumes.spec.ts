import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resumesService } from '../resumes';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('resumesService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll retorna todos os curriculos', async () => {
    const mockResumes = [
      { id: '1', carrerLevel: 'SENIOR', objective: 'Full Stack Engineer', presence: 'REMOTE' }
    ];
    (graphqlClient.request as any).mockResolvedValueOnce({ allResumes: mockResumes });

    const result = await resumesService.getAll();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].carrerLevel).toBe('SENIOR');
  });

  it('getPaginated retorna lista paginada de curriculos', async () => {
    const mockPaginated = {
      resumes: [{ id: '1', objective: 'DevOps Lead' }],
      totalPages: 2,
      currentPage: 1,
      maxRows: 10
    };
    (graphqlClient.request as any).mockResolvedValueOnce({ allResumesPaginated: mockPaginated });

    const result = await resumesService.getPaginated(1, 10);
    expect(result.data.totalPages).toBe(2);
    expect(result.data.resumes[0].objective).toBe('DevOps Lead');
  });

  it('getById busca curriculo por ID', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      getResumeById: { id: '5', carrerLevel: 'PLENO', objective: 'Frontend Developer' }
    });

    const result = await resumesService.getById('5');
    expect(result.data.id).toBe('5');
    expect(result.data.carrerLevel).toBe('PLENO');
  });

  it('create envia ResumeInput com experiencias e educacao', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createResume: { id: '12', objective: 'Tech Lead', carrerLevel: 'SENIOR', presence: 'HYBRID' }
    });

    const result = await resumesService.create({
      carrerLevel: 'SENIOR',
      objective: 'Tech Lead',
      presence: 'HYBRID',
      candidateId: 1,
      skills: [{ skillName: 'Vue.js', months: 36 }]
    });

    expect(result.data.id).toBe('12');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });
});
