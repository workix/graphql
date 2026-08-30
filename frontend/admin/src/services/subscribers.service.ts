import graphqlClient from './graphql';

export interface SubscriberModel {
  id: string | number;
  email: string;
  createdAt?: string;
}

export interface PaginatedListSubscriber {
  subscribers: SubscriberModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const adminSubscribersService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListSubscriber }> {
    const query = `
      query AllSubscribersPaginated($page: Int!, $limit: Int!) {
        allSubscribersPaginated(page: $page, limit: $limit) {
          subscribers {
            id
            email
            createdAt
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allSubscribersPaginated: PaginatedListSubscriber }>(query, {
      page,
      limit
    });

    return { data: data.allSubscribersPaginated };
  },

  async delete(id: string | number): Promise<{ data: boolean }> {
    const query = `
      mutation DeleteSubscriber($id: ID!) {
        deleteSubscriber(id: $id)
      }
    `;

    const result = await graphqlClient.request<{ deleteSubscriber: boolean }>(query, {
      id: String(id)
    });

    return { data: result.deleteSubscriber };
  }
};
