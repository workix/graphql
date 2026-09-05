import { describe, it, expect, beforeEach, vi } from 'vitest';
import selectiveProcessesAdminService from '../selectiveProcessesAdmin.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('selectiveProcessesAdminService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getSelectiveProcessesPaginated lista processos seletivos do admin', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      allSelectiveProcessesPaginated: {
        selectiveProcesses: [
          { id: '1', activated: true, maxCandidates: 50, job: { id: '10', title: 'Tech Lead' } }
        ],
        totalPages: 1,
        currentPage: 1,
        maxRows: 1
      }
    });

    const result = await selectiveProcessesAdminService.getSelectiveProcessesPaginated(1, 10);
    expect(result.selectiveProcesses).toHaveLength(1);
    expect(result.selectiveProcesses[0].job?.title).toBe('Tech Lead');
  });

  it('deleteSelectiveProcess exclui processo seletivo', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({ deleteSelectiveProcess: true });

    const result = await selectiveProcessesAdminService.deleteSelectiveProcess('1');
    expect(result).toBe(true);
  });
});
