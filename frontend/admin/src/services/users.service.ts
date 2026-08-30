import graphqlClient from './graphql';

export interface AdminUserModel {
  id: string | number;
  email: string;
  activated: boolean;
  verified?: boolean;
  createdAt?: string;
  firebaseUUID?: string;
}

export interface AdminPaginatedListUser {
  users: AdminUserModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const adminUsersService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: AdminPaginatedListUser }> {
    const query = `
      query AllUsersPaginated($page: Int!, $limit: Int!) {
        allUsersPaginated(page: $page, limit: $limit) {
          users {
            id
            email
            activated
            verified
            createdAt
            firebaseUUID
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allUsersPaginated: AdminPaginatedListUser }>(query, {
      page,
      limit
    });

    return { data: data.allUsersPaginated };
  },

  async create(data: { email: string; activated?: boolean; firebaseUUID?: string; firebaseMessageToken?: string }): Promise<{ data: AdminUserModel }> {
    const query = `
      mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
          id
          email
          activated
          verified
        }
      }
    `;

    const result = await graphqlClient.request<{ createUser: AdminUserModel }>(query, {
      input: {
        email: data.email,
        activated: Boolean(data.activated !== false),
        firebaseUUID: data.firebaseUUID || `uuid_${Date.now()}`,
        firebaseMessageToken: data.firebaseMessageToken || 'fcm_token_placeholder'
      }
    });

    return { data: result.createUser };
  },

  async update(id: string | number, data: { email: string; activated: boolean; firebaseUUID?: string }): Promise<{ data: AdminUserModel }> {
    const query = `
      mutation UpdateUser($id: ID!, $input: UserInput!) {
        updateUser(id: $id, input: $input) {
          id
          email
          activated
          verified
        }
      }
    `;

    const result = await graphqlClient.request<{ updateUser: AdminUserModel }>(query, {
      id: String(id),
      input: {
        email: data.email,
        activated: Boolean(data.activated),
        firebaseUUID: data.firebaseUUID || `uuid_${Date.now()}`
      }
    });

    return { data: result.updateUser };
  },

  async delete(id: string | number): Promise<{ data: boolean }> {
    const query = `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
    `;

    const result = await graphqlClient.request<{ deleteUser: boolean }>(query, {
      id: String(id)
    });

    return { data: result.deleteUser };
  }
};
