import graphqlClient from './graphql';

export interface AdminCandidateModel {
  id: string | number;
  name: string;
  birthDate?: string;
  cpf?: number;
  contact?: { mobilePhone?: number };
  locale?: { city?: string; state?: string };
  resume?: {
    id: string | number;
    carrerLevel?: string;
    objective?: string;
  };
}

export interface AdminPaginatedListCandidate {
  candidates: AdminCandidateModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const adminCandidatesService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: AdminPaginatedListCandidate }> {
    const query = `
      query AllCandidatesPaginated($page: Int!, $limit: Int!) {
        allCandidatesPaginated(page: $page, limit: $limit) {
          candidates {
            id
            name
            birthDate
            cpf
            contact {
              mobilePhone
            }
            locale {
              city
              state
            }
            resume {
              id
              carrerLevel
              objective
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allCandidatesPaginated: AdminPaginatedListCandidate }>(query, {
      page,
      limit
    });

    return { data: data.allCandidatesPaginated };
  },

  async delete(id: string | number): Promise<{ data: boolean }> {
    const query = `
      mutation DeleteCandidate($id: ID!) {
        deleteCandidate(id: $id)
      }
    `;

    const result = await graphqlClient.request<{ deleteCandidate: boolean }>(query, {
      id: String(id)
    });

    return { data: result.deleteCandidate };
  },

  async notify(userId: string | number, title: string, message: string): Promise<{ data: boolean }> {
    const query = `
      mutation NotifyCandidate($input: NotificationInput!) {
        notifyCandidate(input: $input)
      }
    `;

    const result = await graphqlClient.request<{ notifyCandidate: boolean }>(query, {
      input: {
        type: 'PUSH',
        userId: parseInt(String(userId), 10),
        title,
        message
      }
    });

    return { data: result.notifyCandidate };
  }
};
