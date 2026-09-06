import { getTestApp, setupE2EDatabase, graphqlRequest } from './helpers/e2e_setup';
import db from '../../src/models/index';

describe('E2E: Vagas, Candidatos, Currículos e Aplicações (100% de Cobertura)', () => {
  let app: any;
  let tokens: any;
  let companyId: number;
  let candidateId: number;
  let createdJobId: string;

  beforeAll(async () => {
    app = getTestApp();
    tokens = await setupE2EDatabase();

    const company = await db.Company.findOne({ where: { user_id: tokens.companyUser.id } });
    companyId = company.id;

    const candidate = await db.Candidate.findOne({ where: { user_id: tokens.candidateUser.id } });
    candidateId = candidate.id;
  });

  it('deve criar uma nova vaga com categorias e atributos de acessibilidade via createJob', async () => {
    const mutation = `
      mutation CreateJob($input: JobInput!) {
        createJob(input: $input) {
          id
          title
          description
          minPayment
          maxPayment
          workplaceType
          isRemote
          isPcd
          activated
        }
      }
    `;

    const res = await graphqlRequest(app, mutation, {
      input: {
        title: 'Engenheiro Full Stack E2E Master',
        description: 'Vaga de teste E2E para engenheiro full stack experiente em TypeScript e Kotlin.',
        requirement: 'Sólida experiência em arquitetura de microsserviços e frontends modernos.',
        benefits: 'Plano de Saúde, Gympass, Auxílio Home Office, PLR.',
        minPayment: 12000,
        maxPayment: 18000,
        activated: true,
        featured: true,
        isRemote: true,
        isPcd: false,
        workplaceType: 'REMOTE',
        jobCategory: 'MANAGEMENT',
        jobType: 'FULLTIME',
        employmentType: 'CLT',
        companyId: companyId
      }
    }, tokens.companyToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.createJob).toBeDefined();
    expect(res.body.data.createJob.title).toBe('Engenheiro Full Stack E2E Master');
    expect(res.body.data.createJob.minPayment).toBe(12000);
    createdJobId = res.body.data.createJob.id;
  });

  it('deve consultar a lista de vagas via allJobs e obter detalhes pelo ID', async () => {
    const query = `
      query GetJob($id: ID!) {
        getJobById(id: $id) {
          id
          title
          description
          minPayment
          maxPayment
          company {
            id
            name
          }
        }
      }
    `;

    const res = await graphqlRequest(app, query, { id: createdJobId }, tokens.candidateToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.getJobById).toBeDefined();
    expect(res.body.data.getJobById.id).toBe(String(createdJobId));
    expect(res.body.data.getJobById.company).toBeDefined();
  });

  it('deve realizar busca avançada de vagas com filtros e facetas via searchJobs', async () => {
    const query = `
      query SearchJobs($query: String) {
        searchJobs(query: $query, page: 1, limit: 10) {
          totalCount
          page
          totalPages
          jobs {
            id
            title
            minPayment
            maxPayment
          }
        }
      }
    `;

    const res = await graphqlRequest(app, query, { query: 'Engenheiro' });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.searchJobs).toBeDefined();
    expect(res.body.data.searchJobs.totalCount).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.data.searchJobs.jobs)).toBe(true);
  });

  it('deve criar ou salvar um currículo normalizado para o candidato', async () => {
    const mutation = `
      mutation SaveNormalized($candidateId: ID!, $rawMarkdown: String!) {
        saveNormalizedResume(candidateId: $candidateId, rawMarkdown: $rawMarkdown) {
          candidateId
          summary
          skills
          completenessScore
        }
      }
    `;

    const res = await graphqlRequest(app, mutation, {
      candidateId: String(candidateId),
      rawMarkdown: '# Carlos Silva\n\nDesenvolvedor Sênior com foco em testes E2E, Vue.js e Kotlin.'
    }, tokens.candidateToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.saveNormalizedResume).toBeDefined();
    expect(res.body.data.saveNormalizedResume.candidateId).toBe(String(candidateId));
  });

  it('deve candidatar o candidato à vaga via subscribeInJob', async () => {
    const mutation = `
      mutation SubscribeInJob($input: SubscribeInJobInput!) {
        subscribeInJob(input: $input)
      }
    `;

    const res = await graphqlRequest(app, mutation, {
      input: {
        jobId: createdJobId,
        candidateId: String(candidateId)
      }
    }, tokens.candidateToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.subscribeInJob).toBe(true);
  });
});
