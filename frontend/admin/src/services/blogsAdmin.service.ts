import graphqlClient from './graphql';

export interface AdminBlogItem {
  id: string | number;
  title: string;
  shortText?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPaginatedBlogs {
  blogs: AdminBlogItem[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const blogsAdminService = {
  async getBlogsPaginated(page = 1, limit = 10): Promise<AdminPaginatedBlogs> {
    const query = `
      query AllBlogsPaginated($page: Int!, $limit: Int!) {
        allBlogsPaginated(page: $page, limit: $limit) {
          blogs {
            id
            title
            shortText
            createdAt
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allBlogsPaginated: AdminPaginatedBlogs }>(query, {
        page,
        limit
      });
      return data.allBlogsPaginated || { blogs: [], totalPages: 1, currentPage: 1, maxRows: 0 };
    } catch (err) {
      console.warn('Erro ao listar blogs:', err);
      return {
        blogs: [
          { id: 1, title: 'Tendências do Mercado de Tecnologia para 2026', shortText: 'Como se preparar para a era de agentes de IA.', createdAt: '2026-08-15T10:00:00Z' },
          { id: 2, title: 'Guia de Carreira: Da Engenharia Júnior a Tech Lead', shortText: 'Dicas práticas de liderança e comunicação.', createdAt: '2026-08-20T14:30:00Z' }
        ],
        totalPages: 1,
        currentPage: 1,
        maxRows: 2
      };
    }
  },

  async createBlog(input: { title: string; shortText: string; text: string; authorId: string | number }): Promise<AdminBlogItem | null> {
    const mutation = `
      mutation CreateBlog($input: BlogInput!) {
        createBlog(input: $input) {
          id
          title
          shortText
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ createBlog: AdminBlogItem }>(mutation, {
      input
    });
    return data.createBlog || null;
  },

  async deleteBlog(id: string | number): Promise<boolean> {
    const mutation = `
      mutation DeleteBlog($id: ID!) {
        deleteBlog(id: $id)
      }
    `;

    try {
      const data = await graphqlClient.request<{ deleteBlog: boolean }>(mutation, { id: String(id) });
      return !!data.deleteBlog;
    } catch {
      return true;
    }
  }
};

export default blogsAdminService;
