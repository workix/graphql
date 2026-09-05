import graphqlClient from './graphql';

export interface JobFilterParams {
  page?: number;
  limit?: number;
  q?: string;
  location?: string;
  contract_type?: string;
}

export interface JobModel {
  id: string | number;
  title: string;
  description: string;
  benefits?: string;
  requirement?: string;
  jobCategory?: string;
  jobType?: string;
  categories?: string[];
  employmentType?: string;
  minPayment?: number;
  maxPayment?: number;
  featured?: boolean;
  activated?: boolean;
  createdAt?: string;
  company?: {
    id: string | number;
    name: string;
    description?: string;
    logo?: string;
  };
}

export interface PaginatedListJob {
  jobs: JobModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const jobsService = {
  async getAll(): Promise<{ data: JobModel[] }> {
    const query = `
      query AllJobs {
        allJobs {
          id
          title
          description
          benefits
          requirement
          jobCategory
          jobType
          categories
          employmentType
          minPayment
          maxPayment
          featured
          activated
          createdAt
          company {
            id
            name
            description
          }
          candidates {
            id
            name
          }
        }
      }
    `;

    const data = await graphqlClient.request<{ allJobs: JobModel[] }>(query);
    return { data: data.allJobs || [] };
  },

  async getPaginated(params: JobFilterParams): Promise<{ data: PaginatedListJob }> {
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
            categories
            employmentType
            minPayment
            maxPayment
            featured
            activated
            createdAt
            company {
              id
              name
              description
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allJobsPaginated: PaginatedListJob }>(query, {
      page: params.page || 1,
      limit: params.limit || 10
    });

    return { data: data.allJobsPaginated };
  },

  async getById(id: number | string): Promise<{ data: JobModel }> {
    const query = `
      query GetJobById($id: ID!) {
        getJobById(id: $id) {
          id
          title
          description
          benefits
          requirement
          jobCategory
          jobType
          categories
          employmentType
          minPayment
          maxPayment
          featured
          activated
          createdAt
          company {
            id
            name
            description
          }
        }
      }
    `;

    const data = await graphqlClient.request<{ getJobById: JobModel }>(query, {
      id: String(id)
    });

    return { data: data.getJobById };
  },

  async getFeatured(limit = 6): Promise<{ data: JobModel[] }> {
    try {
      const query = `
        query ListJobRandomFeatured {
          listJobRandomFeatured {
            id
            title
            description
            jobCategory
            jobType
            categories
            employmentType
            minPayment
            maxPayment
            featured
            createdAt
            company {
              id
              name
              description
            }
          }
        }
      `;

      const data = await graphqlClient.request<{ listJobRandomFeatured: JobModel[] }>(query);
      if (data.listJobRandomFeatured && data.listJobRandomFeatured.length > 0) {
        return { data: data.listJobRandomFeatured };
      }
    } catch (e) {
      console.warn('Erro ao buscar listJobRandomFeatured, tentando allJobsFeatured:', e);
    }

    try {
      const fallbackQuery = `
        query AllJobsFeatured {
          allJobsFeatured(featured: true) {
            id
            title
            description
            jobCategory
            jobType
            categories
            employmentType
            minPayment
            maxPayment
            featured
            createdAt
            company {
              id
              name
              description
            }
          }
        }
      `;
      const fallbackData = await graphqlClient.request<{ allJobsFeatured: JobModel[] }>(fallbackQuery);
      if (fallbackData.allJobsFeatured && fallbackData.allJobsFeatured.length > 0) {
        return { data: fallbackData.allJobsFeatured };
      }
    } catch (e) {
      console.warn('Erro ao buscar allJobsFeatured, tentando allJobsPaginated:', e);
    }

    const paginatedRes = await this.getPaginated({ page: 1, limit });
    return { data: paginatedRes.data.jobs || [] };
  },

  async create(data: any): Promise<{ data: JobModel }> {
    const query = `
      mutation CreateJob($input: JobInput!) {
        createJob(input: $input) {
          id
          title
          description
          jobCategory
          jobType
          categories
          employmentType
        }
      }
    `;

    const result = await graphqlClient.request<{ createJob: JobModel }>(query, {
      input: {
        title: data.title,
        description: data.description,
        benefits: data.benefits || '',
        requirement: data.requirement || '',
        jobCategory: data.jobCategory || 'MANAGEMENT',
        jobType: data.jobType || 'FULLTIME',
        categories: data.categories || [],
        employmentType: data.employmentType || 'CLT',
        minPayment: parseFloat(data.minPayment || 0),
        maxPayment: parseFloat(data.maxPayment || 0),
        featured: Boolean(data.featured),
        activated: true,
        companyId: parseInt(data.companyId || 1, 10)
      }
    });

    return { data: result.createJob };
  },

  async subscribe(jobId: number | string, candidateId: number | string = 1): Promise<{ data: boolean }> {
    const query = `
      mutation SubscribeInJob($input: SubscribeInJobInput!) {
        subscribeInJob(input: $input)
      }
    `;

    const result = await graphqlClient.request<{ subscribeInJob: boolean }>(query, {
      input: {
        jobId: String(jobId),
        candidateId: String(candidateId)
      }
    });

    return { data: result.subscribeInJob };
  }
};
