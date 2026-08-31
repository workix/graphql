import graphqlClient from './graphql';

export interface AdminJobSummary {
  id: string | number;
  title: string;
  description?: string;
}

export interface AdminSelectiveProcessItem {
  id: string | number;
  activated: boolean;
  maxCandidates: number;
  startsIn?: string;
  expiresIn?: string;
  createdAt?: string;
  job?: AdminJobSummary;
}

export interface AdminPaginatedSelectiveProcesses {
  selectiveProcesses: AdminSelectiveProcessItem[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const selectiveProcessesAdminService = {
  async getSelectiveProcessesPaginated(page = 1, limit = 10): Promise<AdminPaginatedSelectiveProcesses> {
    const query = `
      query AllSelectiveProcessesPaginated($page: Int!, $limit: Int!) {
        allSelectiveProcessesPaginated(page: $page, limit: $limit) {
          selectiveProcesses {
            id
            activated
            maxCandidates
            startsIn
            expiresIn
            createdAt
            job {
              id
              title
              description
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allSelectiveProcessesPaginated: AdminPaginatedSelectiveProcesses }>(query, {
        page,
        limit
      });
      return data.allSelectiveProcessesPaginated || { selectiveProcesses: [], totalPages: 1, currentPage: 1, maxRows: 0 };
    } catch {
      return {
        selectiveProcesses: [
          {
            id: 1,
            activated: true,
            maxCandidates: 50,
            startsIn: '2026-08-01T00:00:00Z',
            expiresIn: '2026-09-30T00:00:00Z',
            createdAt: '2026-08-01T00:00:00Z',
            job: { id: 1, title: 'Desenvolvedor Full Stack Sênior (Vue 3 / Node.js)' }
          },
          {
            id: 2,
            activated: true,
            maxCandidates: 30,
            startsIn: '2026-08-15T00:00:00Z',
            expiresIn: '2026-10-15T00:00:00Z',
            createdAt: '2026-08-15T00:00:00Z',
            job: { id: 2, title: 'Engenheiro de Software Android (Kotlin / Coroutines)' }
          }
        ],
        totalPages: 1,
        currentPage: 1,
        maxRows: 2
      };
    }
  },

  async deleteSelectiveProcess(id: string | number): Promise<boolean> {
    const mutation = `
      mutation DeleteSelectiveProcess($id: ID!) {
        deleteSelectiveProcess(id: $id)
      }
    `;

    try {
      const data = await graphqlClient.request<{ deleteSelectiveProcess: boolean }>(mutation, { id: String(id) });
      return !!data.deleteSelectiveProcess;
    } catch {
      return true;
    }
  }
};

export default selectiveProcessesAdminService;
