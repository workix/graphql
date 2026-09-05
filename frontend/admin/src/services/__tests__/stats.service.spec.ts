import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adminStatsService } from '../stats.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('adminStatsService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getStatistics retorna os contadores do dashboard', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      statisticsCount: {
        members: 150,
        jobs: 45,
        resumes: 120,
        companies: 25
      }
    });

    const result = await adminStatsService.getStatistics();
    expect(result.data.members).toBe(150);
    expect(result.data.jobs).toBe(45);
    expect(result.data.resumes).toBe(120);
    expect(result.data.companies).toBe(25);
  });
});
