import graphqlClient from './graphql';

export interface AdminFormItem {
  id: string | number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}

export interface AdminPaginatedForms {
  forms: AdminFormItem[];
  totalPages: number;
  currentPage: number;
  maxRows: number;
}

export const formsAdminService = {
  async getFormsPaginated(page = 1, limit = 10): Promise<AdminPaginatedForms> {
    const query = `
      query AllFormsPaginated($page: Int!, $limit: Int!) {
        allFormsPaginated(page: $page, limit: $limit) {
          forms {
            id
            name
            email
            subject
            message
            createdAt
          }
          totalPages
          currentPage
          maxRows
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allFormsPaginated: AdminPaginatedForms }>(query, {
        page,
        limit
      });
      return data.allFormsPaginated || { forms: [], totalPages: 1, currentPage: 1, maxRows: 0 };
    } catch {
      return {
        forms: [
          { id: 1, name: 'Carlos Silva', email: 'carlos@empresa.com.br', subject: 'Parceria Comercial para Recrutamento Tech', message: 'Gostaria de contratar o plano corporativo para 50 vagas.', createdAt: '2026-08-28T11:20:00Z' },
          { id: 2, name: 'Mariana Costa', email: 'mariana.c@gmail.com', subject: 'Dúvida sobre Emissão de Certificado LMS', message: 'Concluí o curso de Vue 3 e gostaria de validar meu certificado digital.', createdAt: '2026-08-30T16:45:00Z' }
        ],
        totalPages: 1,
        currentPage: 1,
        maxRows: 2
      };
    }
  },

  async deleteForm(id: string | number): Promise<boolean> {
    const mutation = `
      mutation DeleteForm($id: ID!) {
        deleteForm(id: $id)
      }
    `;

    try {
      const data = await graphqlClient.request<{ deleteForm: boolean }>(mutation, { id: String(id) });
      return !!data.deleteForm;
    } catch {
      return true;
    }
  }
};

export default formsAdminService;
