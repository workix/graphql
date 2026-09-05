import graphqlClient from './graphql';

export interface SelectiveProcessModel {
  id: string | number;
  activated?: boolean;
  startsIn?: string;
  expiresIn?: string;
  maxCandidates?: number;
  job?: {
    id: string | number;
    title?: string;
    company?: { name?: string };
  };
}

export interface PaginatedListSelectiveProcess {
  selectiveProcesses: SelectiveProcessModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export interface CandidateActiveProcessModel {
  id: string | number;
  selectiveProcessId?: string | number | null;
  jobId?: string | number | null;
  jobTitle?: string | null;
  companyId?: string | number | null;
  companyName?: string | null;
  companyLogo?: string | null;
  isConfidential?: boolean;
  status?: string | null;
  currentStage?: string | null;
  subscribedAt?: string | null;
  updatedAt?: string | null;
}

export interface CandidateActiveProcessesSummaryModel {
  hasActiveProcesses: boolean;
  totalCount: number;
  isRestricted: boolean;
  restrictionReason?: string | null;
}

export interface CandidateActiveProcessesResponse {
  candidateId: string | number;
  hasActiveProcesses: boolean;
  totalCount: number;
  isRestricted: boolean;
  processes: CandidateActiveProcessModel[];
}

export const selectiveProcessesService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListSelectiveProcess }> {
    const query = `
      query AllSelectiveProcessesPaginated($page: Int!, $limit: Int!) {
        allSelectiveProcessesPaginated(page: $page, limit: $limit) {
          selectiveProcesses {
            id
            activated
            startsIn
            expiresIn
            maxCandidates
            job {
              id
              title
              company {
                name
              }
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allSelectiveProcessesPaginated: PaginatedListSelectiveProcess }>(query, {
      page,
      limit
    });

    return { data: data.allSelectiveProcessesPaginated };
  },

  async getMySubscribed(): Promise<{ data: SelectiveProcessModel[] }> {
    const query = `
      query MySelectiveProcessesSubscribed {
        mySelectiveProcessesSubscribed {
          id
          activated
          startsIn
          expiresIn
          job {
            id
            title
            company {
              name
            }
          }
        }
      }
    `;

    const data = await graphqlClient.request<{ mySelectiveProcessesSubscribed: SelectiveProcessModel[] }>(query);
    return { data: data.mySelectiveProcessesSubscribed || [] };
  },

  async subscribe(spId: string | number, candidateId: string | number = 1): Promise<{ data: boolean }> {
    const query = `
      mutation SubscribeInSelectiveProcess($input: SubscribeInSelectiveProcessInput!) {
        subscribeInSelectiveProcess(input: $input)
      }
    `;

    const result = await graphqlClient.request<{ subscribeInSelectiveProcess: boolean }>(query, {
      input: {
        spId: String(spId),
        candidateId: String(candidateId)
      }
    });

    return { data: result.subscribeInSelectiveProcess };
  },

  async getCandidateActiveProcesses(candidateId: string | number): Promise<CandidateActiveProcessesResponse> {
    const query = `
      query CandidateActiveProcesses($candidateId: ID!) {
        candidateActiveProcesses(candidateId: $candidateId) {
          candidateId
          hasActiveProcesses
          totalCount
          isRestricted
          processes {
            id
            selectiveProcessId
            jobId
            jobTitle
            companyId
            companyName
            companyLogo
            isConfidential
            status
            currentStage
            subscribedAt
            updatedAt
          }
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ candidateActiveProcesses: CandidateActiveProcessesResponse }>(query, {
        candidateId: String(candidateId)
      });
      return data.candidateActiveProcesses;
    } catch (err: any) {
      return {
        candidateId,
        hasActiveProcesses: false,
        totalCount: 0,
        isRestricted: true,
        processes: []
      };
    }
  },

  async getCandidateActiveProcessesSummary(candidateId: string | number): Promise<CandidateActiveProcessesSummaryModel> {
    const query = `
      query CandidateActiveProcessesSummary($candidateId: ID!) {
        candidateActiveProcessesSummary(candidateId: $candidateId) {
          hasActiveProcesses
          totalCount
          isRestricted
          restrictionReason
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ candidateActiveProcessesSummary: CandidateActiveProcessesSummaryModel }>(query, {
        candidateId: String(candidateId)
      });
      return data.candidateActiveProcessesSummary;
    } catch (err: any) {
      return {
        hasActiveProcesses: false,
        totalCount: 0,
        isRestricted: true,
        restrictionReason: 'Erro ao carregar resumo de processos ativos'
      };
    }
  }
};
