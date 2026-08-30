import graphqlClient from './graphql';

export interface ResumeModel {
  id: string | number;
  carrerLevel?: string;
  objective?: string;
  presence?: string;
  content?: string;
  createdAt?: string;
  candidate?: {
    id: string | number;
    name?: string;
    contact?: { mobilePhone?: number };
    locale?: { city?: string; state?: string };
  };
  skills?: Array<{ skillName: string; months: number }>;
  experiences?: Array<{ employerName: string; jobTitle: string; description?: string }>;
  educations?: Array<{ schoolName: string; qualification: string; description?: string }>;
}

export interface PaginatedListResume {
  resumes: ResumeModel[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const resumesService = {
  async getAll(): Promise<{ data: ResumeModel[] }> {
    const query = `
      query AllResumes {
        allResumes {
          id
          carrerLevel
          objective
          presence
          content
          createdAt
          candidate {
            id
            name
            locale {
              city
              state
            }
          }
          skills {
            skillName
            months
          }
        }
      }
    `;

    const data = await graphqlClient.request<{ allResumes: ResumeModel[] }>(query);
    return { data: data.allResumes || [] };
  },

  async getPaginated(page = 1, limit = 10): Promise<{ data: PaginatedListResume }> {
    const query = `
      query AllResumesPaginated($page: Int!, $limit: Int!) {
        allResumesPaginated(page: $page, limit: $limit) {
          resumes {
            id
            carrerLevel
            objective
            presence
            content
            createdAt
            candidate {
              id
              name
              locale {
                city
                state
              }
            }
            skills {
              skillName
              months
            }
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    const data = await graphqlClient.request<{ allResumesPaginated: PaginatedListResume }>(query, {
      page,
      limit
    });

    return { data: data.allResumesPaginated };
  },

  async getById(id: string | number): Promise<{ data: ResumeModel }> {
    const query = `
      query GetResumeById($id: ID!) {
        getResumeById(id: $id) {
          id
          carrerLevel
          objective
          presence
          content
          createdAt
          candidate {
            id
            name
            locale {
              city
              state
            }
          }
          skills {
            skillName
            months
          }
          experiences {
            employerName
            jobTitle
            description
          }
          educations {
            schoolName
            qualification
            description
          }
        }
      }
    `;

    const data = await graphqlClient.request<{ getResumeById: ResumeModel }>(query, {
      id: String(id)
    });

    return { data: data.getResumeById };
  },

  async create(data: any): Promise<{ data: ResumeModel }> {
    const query = `
      mutation CreateResume($input: ResumeInput!) {
        createResume(input: $input) {
          id
          objective
          carrerLevel
          presence
        }
      }
    `;

    const result = await graphqlClient.request<{ createResume: ResumeModel }>(query, {
      input: {
        carrerLevel: data.carrerLevel || 'SENIOR',
        objective: data.objective || '',
        presence: data.presence || 'REMOTE',
        content: data.content || '',
        candidateId: parseInt(data.candidateId || 1, 10),
        skills: data.skills || [],
        experiences: data.experiences || [],
        educations: data.educations || []
      }
    });

    return { data: result.createResume };
  }
};
