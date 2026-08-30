import graphqlClient from './graphql';

export interface JAASUserModel {
  id: string | number;
  login: string;
  roles?: Array<{ name: string }>;
}

export interface JAASRoleModel {
  name: string;
}

export interface PaginatedListJAASUser {
  jaasUsers: JAASUserModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export interface PaginatedListJAASRole {
  jaasRoles: JAASRoleModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const adminJAASService = {
  async getUsersPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListJAASUser }> {
    const query = `
      query AllJAASUsersPaginated($page: Int!, $limit: Int!) {
        allJAASUsersPaginated(page: $page, limit: $limit) {
          jaasUsers {
            id
            login
            roles {
              name
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allJAASUsersPaginated: PaginatedListJAASUser }>(query, {
      page,
      limit
    });

    return { data: data.allJAASUsersPaginated };
  },

  async getRolesPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListJAASRole }> {
    const query = `
      query AllJAASRolesPaginated($page: Int!, $limit: Int!) {
        allJAASRolesPaginated(page: $page, limit: $limit) {
          jaasRoles {
            name
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allJAASRolesPaginated: PaginatedListJAASRole }>(query, {
      page,
      limit
    });

    return { data: data.allJAASRolesPaginated };
  },

  async createRole(name: string): Promise<{ data: JAASRoleModel }> {
    const query = `
      mutation CreateJAASRole($input: JAASRoleInput!) {
        createJAASRole(input: $input) {
          name
        }
      }
    `;

    const result = await graphqlClient.request<{ createJAASRole: JAASRoleModel }>(query, {
      input: { name }
    });

    return { data: result.createJAASRole };
  },

  async deleteRole(name: string): Promise<{ data: boolean }> {
    const query = `
      mutation DeleteJAASRole($name: String!) {
        deleteJAASRole(name: $name)
      }
    `;

    const result = await graphqlClient.request<{ deleteJAASRole: boolean }>(query, {
      name
    });

    return { data: result.deleteJAASRole };
  }
};
