import graphqlClient from './graphql';

export interface FormModel {
  id: string | number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const formsService = {
  async createForm(input: FormInput): Promise<FormModel | null> {
    const mutation = `
      mutation CreateForm($input: FormInput!) {
        createForm(input: $input) {
          id
          name
          email
          subject
          message
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ createForm: FormModel }>(mutation, {
        input
      });
      return data.createForm || null;
    } catch (err) {
      console.warn('Erro ao enviar formulário de contato:', err);
      throw err;
    }
  },

  async allForms(start = 0, max = 50): Promise<FormModel[]> {
    const query = `
      query AllForms($start: Int, $max: Int) {
        allForms(start: $start, max: $max) {
          id
          name
          email
          subject
          message
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allForms: FormModel[] }>(query, {
        start,
        max
      });
      return data.allForms || [];
    } catch (err) {
      console.warn('Erro ao consultar formulários:', err);
      return [];
    }
  },

  async getFormById(id: string | number): Promise<FormModel | null> {
    const query = `
      query GetFormById($id: ID!) {
        getFormById(id: $id) {
          id
          name
          email
          subject
          message
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ getFormById: FormModel }>(query, {
        id: String(id)
      });
      return data.getFormById || null;
    } catch (err) {
      console.warn('Erro ao obter formulário:', err);
      return null;
    }
  }
};

export default formsService;
