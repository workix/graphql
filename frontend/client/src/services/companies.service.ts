import graphqlClient from './graphql';

export interface CompanyModel {
  id: string | number;
  name: string;
  email?: string;
  cnpj?: string;
  phone?: string;
  industry?: string;
  location?: string;
  description?: string;
  createdAt?: string;
  medias?: Array<{ id: string | number; url?: string; media?: string }>;
}

export interface PaginatedListCompany {
  companies: CompanyModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const companiesService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListCompany }> {
    const query = `
      query AllCompaniesPaginated($page: Int!, $limit: Int!) {
        allCompaniesPaginated(page: $page, limit: $limit) {
          companies {
            id
            name
            email
            cnpj
            phone
            industry
            location
            description
            createdAt
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allCompaniesPaginated: PaginatedListCompany }>(query, {
      page,
      limit
    });

    return { data: data.allCompaniesPaginated };
  },

  async getById(id: string | number): Promise<{ data: CompanyModel }> {
    const query = `
      query GetCompanyById($id: ID!) {
        getCompanyById(id: $id) {
          id
          name
          email
          cnpj
          phone
          industry
          location
          description
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ getCompanyById: CompanyModel }>(query, {
      id: String(id)
    });

    return { data: data.getCompanyById };
  },

  async getRandomLogos(): Promise<{ data: CompanyModel[] }> {
    const query = `
      query ListCompanyRandomLogos {
        listCompanyRandomLogos {
          id
          name
          description
          location
        }
      }
    `;

    const data = await graphqlClient.request<{ listCompanyRandomLogos: CompanyModel[] }>(query);
    return { data: data.listCompanyRandomLogos || [] };
  }
};
