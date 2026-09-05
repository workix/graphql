import { JobCategory, normalizeJobCategories } from '../../src/types/job_categories';
import { JobEmploymentType, normalizeJobEmploymentType } from '../../src/types/job_employment_types';
const { Sequelize, DataTypes } = require('sequelize');

describe('Job Model Persistence & Field Mapping', () => {
  let sequelize: any;
  let JobModel: any;

  beforeAll(() => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    const jobDefine = require('../../src/models/job');
    JobModel = jobDefine(sequelize, DataTypes);
  });

  it('should define categories and employment_type attributes on Job model', () => {
    expect(JobModel.rawAttributes.categories).toBeDefined();
    expect(JobModel.rawAttributes.employment_type).toBeDefined();
    expect(JobModel.rawAttributes.categories.defaultValue).toBe('[]');
    expect(JobModel.rawAttributes.employment_type.defaultValue).toBe('CLT');
  });

  it('should instantiate job with safe defaults for categories and employment_type', () => {
    const job = JobModel.build({
      title: 'Desenvolvedor Full Stack',
      description: 'Vaga para pleno',
      requirement: 'TypeScript e Node',
      benefits: 'VR e VT',
      min_payment: 5000,
      max_payment: 8000,
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      activated: true,
      featured: false,
      company_id: 1
    });

    expect(job.categories).toBe('[]');
    expect(job.employment_type).toBe('CLT');
    expect(normalizeJobCategories(job.categories)).toEqual([]);
    expect(normalizeJobEmploymentType(job.employment_type)).toBe(JobEmploymentType.CLT);
  });

  it('should support multiple categories serialized and custom employment_type', () => {
    const job = JobModel.build({
      title: 'Estagiário Noturno',
      description: 'Estágio de meio período noturno',
      requirement: 'Cursando TI',
      benefits: 'Bolsa auxílio',
      min_payment: 1500,
      max_payment: 2000,
      job_category: 'OPERATOR',
      job_type: 'PARTTIME',
      activated: true,
      featured: false,
      company_id: 1,
      categories: JSON.stringify([JobCategory.ESTAGIO, JobCategory.MEIO_PERIODO, JobCategory.NOTURNO]),
      employment_type: JobEmploymentType.CONTRATO_TEMPORARIO
    });

    const categories = normalizeJobCategories(job.categories);
    expect(categories).toEqual(['ESTAGIO', 'MEIO_PERIODO', 'NOTURNO']);
    expect(job.employment_type).toBe(JobEmploymentType.CONTRATO_TEMPORARIO);
  });
});
