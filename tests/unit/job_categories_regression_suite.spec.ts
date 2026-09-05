import { JOB_CATEGORIES, JobCategory, normalizeJobCategories, isValidJobCategory } from '../../src/types/job_categories';
import { JOB_EMPLOYMENT_TYPES, JobEmploymentType, isValidJobEmploymentType, normalizeJobEmploymentType } from '../../src/types/job_employment_types';
import { CreateJobDTO, UpdateJobDTO } from '../../src/dtos/JobMutationDTO';
import JobDTO from '../../src/dtos/JobDTO';
import { AdaptiveSearchDriver } from '../../src/modules/jobs/search/adaptive_search.driver';
import { Job } from '../../src/models';

jest.mock('../../src/models', () => ({
  Job: {
    findAll: jest.fn()
  },
  Company: {}
}));

describe('Job Categories & Filters Comprehensive Regression Suite', () => {
  describe('1. Modelos e Enums', () => {
    it('deve conter exatamente as 7 novas categorias exigidas', () => {
      const expectedCategories: JobCategory[] = [
        JobCategory.MEIO_PERIODO,
        JobCategory.PRIMEIRA_OPORTUNIDADE,
        JobCategory.ESTAGIO,
        JobCategory.NOTURNO,
        JobCategory.TEMPORARIO,
        JobCategory.FREELANCE,
        JobCategory.PERICULOSIDADE
      ];

      expect(JOB_CATEGORIES).toHaveLength(7);
      for (const cat of expectedCategories) {
        expect(JOB_CATEGORIES).toContain(cat);
        expect(isValidJobCategory(cat)).toBe(true);
      }
    });

    it('deve conter exatamente os 3 tipos de contratação com default CLT', () => {
      const expectedTypes: JobEmploymentType[] = [
        JobEmploymentType.CLT,
        JobEmploymentType.PJ,
        JobEmploymentType.CONTRATO_TEMPORARIO
      ];

      expect(JOB_EMPLOYMENT_TYPES).toHaveLength(3);
      for (const type of expectedTypes) {
        expect(JOB_EMPLOYMENT_TYPES).toContain(type);
        expect(isValidJobEmploymentType(type)).toBe(true);
      }
      expect(normalizeJobEmploymentType(undefined)).toBe(JobEmploymentType.CLT);
    });

    it('deve normalizar categorias removendo duplicados e valores inválidos', () => {
      const raw = ['ESTAGIO', 'INVALID_CAT', 'ESTAGIO', 'FREELANCE', '', null as any];
      const normalized = normalizeJobCategories(raw);

      expect(normalized).toEqual([JobCategory.ESTAGIO, JobCategory.FREELANCE]);
    });
  });

  describe('2. DTOs e Compatibilidade Retroativa (Vagas Antigas)', () => {
    it('deve lidar com dados legados sem categories ou employmentType com defaults seguros', () => {
      const legacyJobData = {
        id: 99,
        title: 'Vaga Legada Cadastrada em 2020',
        description: 'Descrição antiga',
        min_payment: 2500,
        max_payment: 3500,
        created_at: new Date('2020-01-01')
      };

      const dto = new JobDTO(legacyJobData);
      expect(dto.categories).toEqual([]);
      expect(dto.employmentType).toBe(JobEmploymentType.CLT);
      expect(dto.isRemote).toBe(false);
      expect(dto.isPcd).toBe(false);
    });

    it('deve processar e sanitizar CreateJobDTO e UpdateJobDTO com múltiplos atributos combinados', () => {
      const input = {
        title: 'Estágio Noturno em Desenvolvimento',
        description: 'Vaga para estudantes de computação',
        categories: [JobCategory.ESTAGIO, JobCategory.NOTURNO, JobCategory.MEIO_PERIODO],
        employmentType: JobEmploymentType.PJ,
        isRemote: true,
        isPcd: false,
        minPayment: 1800,
        maxPayment: 2200,
        companyId: 5
      };

      const createDTO = new CreateJobDTO(input);
      expect(createDTO.categories).toBe(JSON.stringify(['ESTAGIO', 'NOTURNO', 'MEIO_PERIODO']));
      expect(createDTO.employment_type).toBe(JobEmploymentType.PJ);
      expect(createDTO.is_remote).toBe(true);

      const updateDTO = new UpdateJobDTO({
        categories: [JobCategory.FREELANCE],
        employmentType: JobEmploymentType.CONTRATO_TEMPORARIO
      });
      expect(updateDTO.categories).toBe(JSON.stringify(['FREELANCE']));
      expect(updateDTO.employment_type).toBe(JobEmploymentType.CONTRATO_TEMPORARIO);
    });
  });

  describe('3. Motor de Busca: Filtros Combinados e Facetas', () => {
    const sampleJobs = [
      {
        id: 1,
        title: 'Estagiário de TI (Noturno)',
        description: 'Estágio com horário noturno e meio período',
        categories: JSON.stringify(['ESTAGIO', 'NOTURNO', 'MEIO_PERIODO']),
        employment_type: 'CLT',
        is_remote: true,
        is_pcd: false,
        min_payment: 1500,
        max_payment: 2000,
        company_id: 1,
        activated: true,
        created_at: new Date()
      },
      {
        id: 2,
        title: 'Desenvolvedor Frontend Freelance',
        description: 'Trabalho remoto PJ ou Freelance',
        categories: JSON.stringify(['FREELANCE']),
        employment_type: 'PJ',
        is_remote: true,
        is_pcd: false,
        min_payment: 5000,
        max_payment: 8000,
        company_id: 2,
        activated: true,
        created_at: new Date()
      },
      {
        id: 3,
        title: 'Técnico de Manutenção Elétrica',
        description: 'Vaga presencial com adicional de periculosidade',
        categories: JSON.stringify(['PERICULOSIDADE', 'PRIMEIRA_OPORTUNIDADE']),
        employment_type: 'CLT',
        is_remote: false,
        is_pcd: false,
        min_payment: 3200,
        max_payment: 4500,
        company_id: 3,
        activated: true,
        created_at: new Date()
      },
      {
        id: 4,
        title: 'Operador de Logística Temporário',
        description: 'Vaga temporária para final de ano',
        categories: JSON.stringify(['TEMPORARIO', 'NOTURNO']),
        employment_type: 'CONTRATO_TEMPORARIO',
        is_remote: false,
        is_pcd: true,
        min_payment: 2200,
        max_payment: 2600,
        company_id: 4,
        activated: true,
        created_at: new Date()
      }
    ];

    let searchDriver: AdaptiveSearchDriver;

    beforeEach(() => {
      (Job.findAll as jest.Mock).mockResolvedValue(sampleJobs);
      searchDriver = new AdaptiveSearchDriver();
    });

    it('deve filtrar corretamente por múltiplas categorias combinadas (ex.: ESTAGIO + NOTURNO)', async () => {
      const result = await searchDriver.search({
        filter: {
          categories: [JobCategory.ESTAGIO, JobCategory.NOTURNO]
        }
      });

      expect(result.totalCount).toBe(1);
      expect(result.jobs[0].id).toBe(1);
      expect(result.jobs[0].title).toBe('Estagiário de TI (Noturno)');
    });

    it('deve filtrar por tipo de contratação e formato remoto simultaneamente', async () => {
      const result = await searchDriver.search({
        filter: {
          employmentType: JobEmploymentType.PJ,
          isRemote: true
        }
      });

      expect(result.totalCount).toBe(1);
      expect(result.jobs[0].id).toBe(2);
      expect(result.jobs[0].title).toBe('Desenvolvedor Frontend Freelance');
    });

    it('deve calcular contadores de facetas para todas as categorias e tipos presentes no resultado', async () => {
      const facets = await searchDriver.getFacets();

      expect(facets).toBeDefined();

      const noturnoFacet = facets.categories?.find(c => c.key === 'NOTURNO');
      const estagioFacet = facets.categories?.find(c => c.key === 'ESTAGIO');
      const freelanceFacet = facets.categories?.find(c => c.key === 'FREELANCE');
      const cltFacet = facets.employmentTypes?.find(e => e.key === 'CLT');
      const pjFacet = facets.employmentTypes?.find(e => e.key === 'PJ');

      expect(noturnoFacet?.count).toBe(2);
      expect(estagioFacet?.count).toBe(1);
      expect(freelanceFacet?.count).toBe(1);
      expect(cltFacet?.count).toBe(2);
      expect(pjFacet?.count).toBe(1);
    });
  });
});
