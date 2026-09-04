import { AdaptiveSearchDriver } from '../../src/modules/jobs/search/adaptive_search.driver';
import { Job, Company } from '../../src/models';

describe('Job Search Ranking and Relevance Score', () => {
  let driver: AdaptiveSearchDriver;

  beforeEach(() => {
    driver = new AdaptiveSearchDriver();
    jest.restoreAllMocks();
  });

  it('should rank jobs with match in title higher than match only in description (Weight A vs C)', async () => {
    const mockJobs = [
      {
        id: 1,
        title: 'Analista de Suporte',
        description: 'Vaga com foco em desenvolvimento Java e Spring Boot no dia a dia',
        requirement: 'Conhecimento em Linux',
        benefits: 'VR, VT',
        skills: '["linux", "suporte"]',
        workplace_type: 'REMOTE',
        seniority_level: 'PLENO',
        min_payment: 5000,
        max_payment: 7000,
        activated: true,
        is_sponsored: false,
        created_at: new Date('2026-08-20T10:00:00Z'),
        company: { name: 'Empresa A' }
      },
      {
        id: 2,
        title: 'Desenvolvedor Java Spring Pleno',
        description: 'Atuação na evolução dos serviços backend',
        requirement: 'Java, Spring Boot, PostgreSQL',
        benefits: 'VR, VT, Plano de Saúde',
        skills: '["java", "spring-boot", "postgresql"]',
        workplace_type: 'REMOTE',
        seniority_level: 'PLENO',
        min_payment: 8000,
        max_payment: 11000,
        activated: true,
        is_sponsored: false,
        created_at: new Date('2026-08-20T10:00:00Z'),
        company: { name: 'Empresa B' }
      }
    ];

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockJobs as any);

    const result = await driver.search({
      query: 'Java Spring',
      sortBy: 'RELEVANCE'
    });

    expect(result.jobs.length).toBe(2);
    // Job 2 has "Java Spring" in title (Weight A: 4x) and skills (Weight B: 2x) -> Score muito maior que Job 1
    expect(result.jobs[0].id).toBe(2);
    expect(result.jobs[1].id).toBe(1);
  });

  it('should apply time decay bonus for newer jobs when base score is similar', async () => {
    const now = Date.now();
    const mockJobs = [
      {
        id: 10,
        title: 'Desenvolvedor Node.js',
        description: 'Backend com TypeScript e APIs GraphQL',
        skills: '["nodejs", "typescript"]',
        workplace_type: 'HYBRID',
        seniority_level: 'SENIOR',
        min_payment: 10000,
        max_payment: 14000,
        activated: true,
        is_sponsored: false,
        created_at: new Date(now - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás (sem bônus de frescor)
        company: { name: 'Empresa Antiga' }
      },
      {
        id: 20,
        title: 'Desenvolvedor Node.js',
        description: 'Backend com TypeScript e APIs GraphQL',
        skills: '["nodejs", "typescript"]',
        workplace_type: 'HYBRID',
        seniority_level: 'SENIOR',
        min_payment: 10000,
        max_payment: 14000,
        activated: true,
        is_sponsored: false,
        created_at: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás (recebe bônus de frescor)
        company: { name: 'Empresa Nova' }
      }
    ];

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockJobs as any);

    const result = await driver.search({
      query: 'Node.js TypeScript',
      sortBy: 'RELEVANCE'
    });

    expect(result.jobs.length).toBe(2);
    // Job 20 tem o mesmo conteúdo mas é muito mais recente -> fica no topo
    expect(result.jobs[0].id).toBe(20);
    expect(result.jobs[1].id).toBe(10);
  });
});
