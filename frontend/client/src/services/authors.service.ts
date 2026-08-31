import graphqlClient from './graphql';

export interface AuthorItem {
  id: string | number;
  name: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export const authorsService = {
  async getAllAuthors(): Promise<AuthorItem[]> {
    const query = `
      query AllAuthors {
        allAuthors {
          id
          name
          email
          bio
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allAuthors: AuthorItem[] }>(query);
      const list = data.allAuthors || [];
      if (list.length > 0) return list;
      return [
        { id: 1, name: 'Felipe Michetti', email: 'felipe@workix.com.br', bio: 'Tech Lead e especialista em desenvolvimento distribuído.' },
        { id: 2, name: 'Equipe Workix Insights', email: 'redacao@workix.com.br', bio: 'Colunistas especializados em carreiras e mercado de tecnologia.' }
      ];
    } catch {
      return [
        { id: 1, name: 'Felipe Michetti', email: 'felipe@workix.com.br', bio: 'Tech Lead e especialista em desenvolvimento distribuído.' },
        { id: 2, name: 'Equipe Workix Insights', email: 'redacao@workix.com.br', bio: 'Colunistas especializados em carreiras e mercado de tecnologia.' }
      ];
    }
  },

  async getAuthorById(id: string | number): Promise<AuthorItem | null> {
    const query = `
      query GetAuthorById($id: ID!) {
        getAuthorById(id: $id) {
          id
          name
          email
          bio
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ getAuthorById: AuthorItem }>(query, { id: String(id) });
      return data.getAuthorById || null;
    } catch {
      return { id, name: 'Felipe Michetti', email: 'felipe@workix.com.br', bio: 'Tech Lead e especialista em desenvolvimento distribuído.' };
    }
  }
};

export default authorsService;
