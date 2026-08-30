import graphqlClient from './graphql';

export interface TestimonialModel {
  id: string | number;
  text: string;
  signature: string;
  picture?: string;
  createdAt?: string;
}

export interface PaginatedListTestimonial {
  testimonials: TestimonialModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const adminTestimonialsService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListTestimonial }> {
    const query = `
      query AllTestimonialsPaginated($page: Int!, $limit: Int!) {
        allTestimonialsPaginated(page: $page, limit: $limit) {
          testimonials {
            id
            text
            signature
            picture
            createdAt
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allTestimonialsPaginated: PaginatedListTestimonial }>(query, {
      page,
      limit
    });

    return { data: data.allTestimonialsPaginated };
  },

  async create(data: { text: string; signature: string; picture?: string; authorId?: number }): Promise<{ data: TestimonialModel }> {
    const query = `
      mutation CreateTestimonial($input: TestimonialInput!) {
        createTestimonial(input: $input) {
          id
          text
          signature
          picture
        }
      }
    `;

    const result = await graphqlClient.request<{ createTestimonial: TestimonialModel }>(query, {
      input: {
        text: data.text,
        signature: data.signature,
        picture: data.picture || 'default-avatar.png',
        authorId: data.authorId || 1
      }
    });

    return { data: result.createTestimonial };
  },

  async delete(id: string | number): Promise<{ data: boolean }> {
    const query = `
      mutation DeleteTestimonial($id: ID!) {
        deleteTestimonial(id: $id)
      }
    `;

    const result = await graphqlClient.request<{ deleteTestimonial: boolean }>(query, {
      id: String(id)
    });

    return { data: result.deleteTestimonial };
  }
};
