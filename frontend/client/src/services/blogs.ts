import graphqlClient from './graphql';

export interface CommentModel {
  id: string | number;
  name: string;
  email: string;
  text: string;
  createdAt?: string;
}

export interface BlogModel {
  id: string | number;
  title: string;
  resume?: string;
  content?: string;
  citation?: string;
  date?: string;
  createdAt?: string;
  author?: {
    id: string | number;
    name?: string;
  };
  comments?: CommentModel[];
  categories?: Array<{ category: string }>;
  tags?: Array<{ name: string }>;
}

export interface PaginatedListBlog {
  blogs: BlogModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const blogsService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListBlog }> {
    const query = `
      query AllBlogsPaginated($page: Int!, $limit: Int!) {
        allBlogsPaginated(page: $page, limit: $limit) {
          blogs {
            id
            title
            resume
            content
            date
            createdAt
            author {
              name
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allBlogsPaginated: PaginatedListBlog }>(query, {
      page,
      limit
    });

    return { data: data.allBlogsPaginated };
  },

  async getById(id: string | number): Promise<{ data: BlogModel }> {
    const query = `
      query GetBlogById($id: ID!) {
        getBlogById(id: $id) {
          id
          title
          resume
          content
          citation
          date
          createdAt
          author {
            name
          }
          comments {
            id
            name
            email
            text
            createdAt
          }
          categories {
            category
          }
          tags {
            name
          }
        }
      }
    `;

    const data = await graphqlClient.request<{ getBlogById: BlogModel }>(query, {
      id: String(id)
    });

    return { data: data.getBlogById };
  },

  async createComment(blogId: string | number, name: string, email: string, text: string): Promise<{ data: CommentModel }> {
    const query = `
      mutation CreateComment($input: CommentInput!) {
        createComment(input: $input) {
          id
          name
          email
          text
          createdAt
        }
      }
    `;

    const result = await graphqlClient.request<{ createComment: CommentModel }>(query, {
      input: {
        blogId: parseInt(String(blogId), 10),
        name,
        email,
        text
      }
    });

    return { data: result.createComment };
  }
};
