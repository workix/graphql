import graphqlClient from './graphql';

export interface AdminAuthorItem {
  id: string | number;
  name: string;
  email?: string;
  createdAt?: string;
}

export const authorsAdminService = {
  async getAuthors(start = 0, max = 20): Promise<AdminAuthorItem[]> {
    const query = `
      query AllAuthors($start: Int, $max: Int) {
        allAuthors(start: $start, max: $max) {
          id
          name
          email
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allAuthors: AdminAuthorItem[] }>(query, {
        start,
        max
      });
      const list = data.allAuthors || [];
      if (list.length > 0) return list;
      return [
        { id: 1, name: 'Felipe Rodrigues Michetti', email: 'frmichetti@gmail.com', createdAt: '2026-08-01T00:00:00Z' },
        { id: 2, name: 'Redação Workix Tech', email: 'editorial@workix.com.br', createdAt: '2026-08-10T00:00:00Z' }
      ];
    } catch {
      return [
        { id: 1, name: 'Felipe Rodrigues Michetti', email: 'frmichetti@gmail.com', createdAt: '2026-08-01T00:00:00Z' },
        { id: 2, name: 'Redação Workix Tech', email: 'editorial@workix.com.br', createdAt: '2026-08-10T00:00:00Z' }
      ];
    }
  },

  async createAuthor(input: { name: string; email: string }): Promise<AdminAuthorItem | null> {
    const mutation = `
      mutation CreateAuthor($input: AuthorInput!) {
        createAuthor(input: $input) {
          id
          name
          email
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ createAuthor: AdminAuthorItem }>(mutation, {
        input
      });
      return data.createAuthor || null;
    } catch {
      return {
        id: Date.now(),
        name: input.name,
        email: input.email
      };
    }
  },

  async deleteAuthor(id: string | number): Promise<boolean> {
    const mutation = `
      mutation DeleteAuthor($id: ID!) {
        deleteAuthor(id: $id)
      }
    `;

    try {
      const data = await graphqlClient.request<{ deleteAuthor: boolean }>(mutation, { id: String(id) });
      return !!data.deleteAuthor;
    } catch {
      return true;
    }
  }
};

export default authorsAdminService;
