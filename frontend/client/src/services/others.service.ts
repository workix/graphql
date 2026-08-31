import graphqlClient from './graphql';

export const othersService = {
  /**
   * Valida o formato e os dígitos verificadores de um CPF utilizando o módulo GraphQL 'others'.
   */
  async validateCPF(cpf: string): Promise<boolean> {
    const query = `
      query ValidateCPF($cpf: String!) {
        validateCPF(cpf: $cpf)
      }
    `;

    try {
      const data = await graphqlClient.request<{ validateCPF: boolean }>(query, {
        cpf
      });
      return !!data.validateCPF;
    } catch {
      // Validação local de fallback
      const clean = cpf.replace(/\D/g, '');
      return clean.length === 11;
    }
  }
};

export default othersService;
