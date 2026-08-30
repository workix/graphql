import graphqlClient from './graphql';

export interface AdminJobFilterParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface AdminJobModel {
  id: string | number;
  title: string;
  description: string;
  benefits?: string;
  requirement?: string;
  jobCategory?: string;
  jobType?: string;
  minPayment?: number;
  maxPayment?: number;
  featured?: boolean;
  activated?: boolean;
  createdAt?: string;
  company?: {
    id: string | number;
    name: string;
  };
}

export interface AdminPaginatedListJob {
  jobs: AdminJobModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const adminJobsService = {
  async getPaginated(params: AdminJobFilterParams): Promise<{ data: AdminPaginatedListJob }> {
    const query = `
      query AllJobsPaginated($page: Int!, $limit: Int!) {
        allJobsPaginated(page: $page, limit: $limit) {
          jobs {
            id
            title
            description
            benefits
            requirement
            jobCategory
            jobType
            minPayment
            maxPayment
            featured
            activated
            createdAt
            company {
              id
              name
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allJobsPaginated: AdminPaginatedListJob }>(query, {
      page: params.page || 1,
      limit: params.limit || 10
    });

    return { data: data.allJobsPaginated };
  },

  async create(data: any): Promise<{ data: AdminJobModel }> {
    const query = `
      mutation CreateJob($input: JobInput!) {
        createJob(input: $input) {
          id
          title
          description
          jobCategory
          jobType
          minPayment
          maxPayment
          featured
          activated
        }
      }
    `;

    const result = await graphqlClient.request<{ createJob: AdminJobModel }>(query, {
      input: {
        title: data.title,
        description: data.description,
        benefits: data.benefits || 'Vale Transporte, Vale Refeição',
        requirement: data.requirement || 'Ensino Superior / Experiência',
        jobCategory: data.jobCategory || 'MANAGEMENT',
        jobType: data.jobType || 'FULLTIME',
        minPayment: parseFloat(data.minPayment || 0),
        maxPayment: parseFloat(data.maxPayment || 0),
        featured: Boolean(data.featured),
        activated: Boolean(data.activated !== false),
        companyId: parseInt(data.companyId || 1, 10)
      }
    });

    return { data: result.createJob };
  },

  async update(id: string | number, data: any): Promise<{ data: AdminJobModel }> {
    const query = `
      mutation UpdateJob($id: ID!, $input: JobInput!) {
        updateJob(id: $id, input: $input) {
          id
          title
          description
          jobCategory
          jobType
          minPayment
          maxPayment
          featured
          activated
        }
      }
    `;

    const result = await graphqlClient.request<{ updateJob: AdminJobModel }>(query, {
      id: String(id),
      input: {
        title: data.title,
        description: data.description,
        benefits: data.benefits || '',
        requirement: data.requirement || '',
        jobCategory: data.jobCategory || 'MANAGEMENT',
        jobType: data.jobType || 'FULLTIME',
        minPayment: parseFloat(data.minPayment || 0),
        maxPayment: parseFloat(data.maxPayment || 0),
        featured: Boolean(data.featured),
        activated: Boolean(data.activated),
        companyId: parseInt(data.companyId || 1, 10)
      }
    });

    return { data: result.updateJob };
  },

  async delete(id: string | number): Promise<{ data: boolean }> {
    const query = `
      mutation DeleteJob($id: ID!) {
        deleteJob(id: $id)
      }
    `;

    const result = await graphqlClient.request<{ deleteJob: boolean }>(query, {
      id: String(id)
    });

    return { data: result.deleteJob };
  }
};
