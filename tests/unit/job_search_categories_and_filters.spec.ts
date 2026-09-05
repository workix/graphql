import { AdaptiveSearchDriver } from '../../src/modules/jobs/search/adaptive_search.driver';
import { JobCategory } from '../../src/types/job_categories';
import { JobEmploymentType } from '../../src/types/job_employment_types';
import { Job } from '../../src/models';

describe('Job Search Engine - Categories and Employment Type Filters', () => {
  let driver: AdaptiveSearchDriver;
  const mockJobs = [
    {
      id: 1,
      title: 'Estagiário de TI Noturno',
      description: 'Estágio de suporte no período noturno',
      requirement: 'Cursando Sistemas',
      benefits: 'Bolsa',
      categories: JSON.stringify([JobCategory.ESTAGIO, JobCategory.MEIO_PERIODO, JobCategory.NOTURNO]),
      employment_type: JobEmploymentType.CLT,
      is_pcd: false,
      is_remote: false,
      workplace_type: 'ON_SITE',
      activated: true,
      max_payment: 2000,
      min_payment: 1500,
      created_at: new Date()
    },
    {
      id: 2,
      title: 'Desenvolvedor Freelance Remoto',
      description: 'Projeto fullstack freelance remoto',
      requirement: 'React e Node',
      benefits: 'Flexibilidade',
      categories: JSON.stringify([JobCategory.FREELANCE]),
      employment_type: JobEmploymentType.PJ,
      is_pcd: false,
      is_remote: true,
      workplace_type: 'REMOTE',
      activated: true,
      max_payment: 12000,
      min_payment: 8000,
      created_at: new Date()
    },
    {
      id: 3,
      title: 'Técnico em Eletricidade com Periculosidade',
      description: 'Atuação em alta tensão',
      requirement: 'NR10',
      benefits: '30% periculosidade',
      categories: JSON.stringify([JobCategory.PERICULOSIDADE, JobCategory.TEMPORARIO]),
      employment_type: JobEmploymentType.CONTRATO_TEMPORARIO,
      is_pcd: false,
      is_remote: false,
      workplace_type: 'ON_SITE',
      activated: true,
      max_payment: 4500,
      min_payment: 3500,
      created_at: new Date()
    },
    {
      id: 4,
      title: 'Assistente Administrativo Primeira Oportunidade',
      description: 'Vaga para primeiro emprego',
      requirement: 'Ensino médio completo',
      benefits: 'VT + VR',
      categories: JSON.stringify([JobCategory.PRIMEIRA_OPORTUNIDADE, JobCategory.MEIO_PERIODO]),
      employment_type: JobEmploymentType.CLT,
      is_pcd: true,
      is_remote: false,
      workplace_type: 'ON_SITE',
      activated: true,
      max_payment: 2500,
      min_payment: 1800,
      created_at: new Date()
    }
  ];

  beforeEach(() => {
    driver = new AdaptiveSearchDriver();
    jest.spyOn(Job, 'findAll').mockImplementation(((options: any) => {
      return Promise.resolve(mockJobs as any);
    }) as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should filter jobs by single category', async () => {
    const result = await driver.search({
      filter: { categories: [JobCategory.FREELANCE] }
    });

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].id).toBe(2);
  });

  it('should filter jobs by multiple combined categories (AND match)', async () => {
    const result = await driver.search({
      filter: { categories: [JobCategory.ESTAGIO, JobCategory.NOTURNO] }
    });

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].id).toBe(1);
  });

  it('should filter jobs by employment type', async () => {
    const resultClt = await driver.search({
      filter: { employmentType: JobEmploymentType.CLT }
    });
    expect(resultClt.jobs).toHaveLength(2);

    const resultPj = await driver.search({
      filter: { employmentType: JobEmploymentType.PJ }
    });
    expect(resultPj.jobs).toHaveLength(1);
    expect(resultPj.jobs[0].id).toBe(2);
  });

  it('should combine category, employment type and remote filters', async () => {
    const result = await driver.search({
      filter: {
        categories: [JobCategory.FREELANCE],
        employmentType: JobEmploymentType.PJ,
        isRemote: true
      }
    });

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].id).toBe(2);
  });

  it('should calculate facet counts for categories and employment types', async () => {
    const facets = await driver.getFacets();

    expect(facets.categories).toBeDefined();
    expect(facets.employmentTypes).toBeDefined();

    const estagioFacet = facets.categories.find(c => c.key === JobCategory.ESTAGIO);
    expect(estagioFacet?.count).toBe(1);

    const meioPeriodoFacet = facets.categories.find(c => c.key === JobCategory.MEIO_PERIODO);
    expect(meioPeriodoFacet?.count).toBe(2);

    const cltFacet = facets.employmentTypes.find(e => e.key === JobEmploymentType.CLT);
    expect(cltFacet?.count).toBe(2);

    const pjFacet = facets.employmentTypes.find(e => e.key === JobEmploymentType.PJ);
    expect(pjFacet?.count).toBe(1);
  });
});
