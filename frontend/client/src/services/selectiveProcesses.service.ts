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
  }
};
