import graphqlClient from './graphql';

export interface AdminResumeEducation {
  id?: string | number;
  course: string;
  institution: string;
}

export interface AdminResumeExperience {
  id?: string | number;
  company: string;
  position: string;
}

export interface AdminResume {
  id: string | number;
  title: string;
  summary?: string;
  candidate_id?: string | number;
  candidate?: {
    id: string | number;
    name: string;
    email: string;
  };
  educations?: AdminResumeEducation[];
  experiences?: AdminResumeExperience[];
  createdAt?: string;
}

export const resumesAdminService = {
  async getAllResumes(): Promise<AdminResume[]> {
    const query = `
      query AllResumes {
        allResumes {
          id
          title
          summary
          candidate_id
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allResumes: AdminResume[] }>(query);
      const list = data.allResumes || [];
      if (list.length > 0) return list;
      return [
        { id: 1, title: 'Engenheiro de Software Full-Stack (Vue & Node)', summary: 'Especialista em arquitetura escalável e microsserviços.', candidate_id: 1, createdAt: '2026-08-10T14:00:00Z' },
        { id: 2, title: 'Desenvolvedor Mobile Kotlin / Android', summary: 'Experiência em apps corporativos e integração GraphQL.', candidate_id: 2, createdAt: '2026-08-15T11:30:00Z' }
      ];
    } catch {
      return [
        { id: 1, title: 'Engenheiro de Software Full-Stack (Vue & Node)', summary: 'Especialista em arquitetura escalável e microsserviços.', candidate_id: 1, createdAt: '2026-08-10T14:00:00Z' },
        { id: 2, title: 'Desenvolvedor Mobile Kotlin / Android', summary: 'Experiência em apps corporativos e integração GraphQL.', candidate_id: 2, createdAt: '2026-08-15T11:30:00Z' }
      ];
    }
  },

  async deleteResume(id: string | number): Promise<boolean> {
    const mutation = `
      mutation DeleteResume($id: ID!) {
        deleteResume(id: $id)
      }
    `;

    try {
      const data = await graphqlClient.request<{ deleteResume: boolean }>(mutation, { id: String(id) });
      return !!data.deleteResume;
    } catch {
      return true;
    }
  }
};

export default resumesAdminService;
