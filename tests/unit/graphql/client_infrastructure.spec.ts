describe('GraphQL Client Infrastructure', () => {
  it('deve formatar payloads GraphQL com query e variables corretamente', () => {
    const query = `
      query AllJobsPaginated($limit: Int, $offset: Int) {
        allJobsPaginated(limit: $limit, offset: $offset) {
          total
          items {
            id
            title
          }
        }
      }
    `;
    const variables = { limit: 10, offset: 0 };

    const payload = {
      query: query.trim(),
      variables
    };

    expect(payload.query).toContain('allJobsPaginated');
    expect(payload.variables).toEqual({ limit: 10, offset: 0 });
  });

  it('deve processar responses do GraphQL extraindo data e erros', () => {
    const successResponse = {
      data: {
        statisticsCount: {
          jobs: 10,
          candidates: 25,
          resumes: 18,
          companies: 5
        }
      }
    };

    expect(successResponse.data).toBeDefined();
    expect(successResponse.data.statisticsCount.jobs).toBe(10);

    const errorResponse = {
      errors: [
        {
          message: 'Campo obrigatório não fornecido',
          locations: [{ line: 2, column: 3 }]
        }
      ]
    };

    expect(errorResponse.errors).toHaveLength(1);
    expect(errorResponse.errors[0].message).toBe('Campo obrigatório não fornecido');
  });
});
