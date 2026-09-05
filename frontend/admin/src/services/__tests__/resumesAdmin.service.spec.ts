import { describe, it, expect, beforeEach, vi } from 'vitest';
import resumesAdminService from '../resumesAdmin.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('resumesAdminService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllResumes retorna lista de curriculos do GraphQL', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allResumes: [{ id: '10', title: 'Tech Lead Cloud' }]
    });

    const resumes = await resumesAdminService.getAllResumes();
    expect(resumes).toHaveLength(1);
    expect(resumes[0].title).toBe('Tech Lead Cloud');
  });

  it('deleteResume remove curriculo do sistema', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ deleteResume: true });

    const result = await resumesAdminService.deleteResume('10');
    expect(result).toBe(true);
  });
});
