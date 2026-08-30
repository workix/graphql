import graphqlClient from './graphql';

export interface AdminCompanyModel {
  id: string | number;
  name: string;
  email?: string;
  cnpj?: string;
  phone?: string;
  industry?: string;
  location?: string;
  description?: string;
  createdAt?: string;
}

export interface AdminPaginatedListCompany {
  companies: AdminCompanyModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const adminCompaniesService = {
  async getPaginated(page = 1, limit = 10): Promise<{ data: AdminPaginatedListCompany }> {
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

    const data = await graphqlClient.request<{ allCompaniesPaginated: AdminPaginatedListCompany }>(query, {
      page,
      limit
    });

    return { data: data.allCompaniesPaginated };
  },

  async create(data: any): Promise<{ data: AdminCompanyModel }> {
    const query = `
      mutation CreateCompany($input: CompanyInput!) {
        createCompany(input: $input) {
          id
          name
          email
          cnpj
          phone
          industry
          location
          description
        }
      }
    `;

    const result = await graphqlClient.request<{ createCompany: AdminCompanyModel }>(query, {
      input: {
        name: data.name,
        email: data.email || '',
        cnpj: data.cnpj || '',
        phone: data.phone || '',
        industry: data.industry || 'Tecnologia',
        location: data.location || 'São Paulo, SP',
        description: data.description || ''
      }
    });

    return { data: result.createCompany };
  },

  async update(id: string | number, data: any): Promise<{ data: AdminCompanyModel }> {
    const query = `
      mutation UpdateCompany($id: ID!, $input: CompanyInput!) {
        updateCompany(id: $id, input: $input) {
          id
          name
          email
          cnpj
          phone
          industry
          location
          description
        }
      }
    `;

    const result = await graphqlClient.request<{ updateCompany: AdminCompanyModel }>(query, {
      id: String(id),
      input: {
        name: data.name,
        email: data.email || '',
        cnpj: data.cnpj || '',
        phone: data.phone || '',
        industry: data.industry || 'Tecnologia',
        location: data.location || 'São Paulo, SP',
        description: data.description || ''
      }
    });

    return { data: result.updateCompany };
  },

  async delete(id: string | number): Promise<{ data: boolean }> {
    const query = `
      mutation DeleteCompany($id: ID!) {
        deleteCompany(id: $id)
      }
    `;

    const result = await graphqlClient.request<{ deleteCompany: boolean }>(query, {
      id: String(id)
    });

    return { data: result.deleteCompany };
  }
};
