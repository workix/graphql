import JobDTO from '../../src/dtos/JobDTO';
import { JobCategory } from '../../src/types/job_categories';
import { JobEmploymentType } from '../../src/types/job_employment_types';

describe('JobDTO Query Response Mapping', () => {
  it('should parse categories and employment_type from job model instance', () => {
    const rawJob = {
      id: 1,
      title: 'Vaga Estágio Meio Período',
      description: 'Descrição completa',
      categories: JSON.stringify([JobCategory.ESTAGIO, JobCategory.MEIO_PERIODO, JobCategory.NOTURNO]),
      employment_type: 'PJ',
      activated: true,
      featured: true,
      job_category: 'OPERATOR',
      job_type: 'PARTTIME',
      min_payment: 2000,
      max_payment: 3000,
      company_id: 10
    };

    const dto = new JobDTO(rawJob);

    expect(dto.id).toBe(1);
    expect(dto.title).toBe('Vaga Estágio Meio Período');
    expect(dto.categories).toEqual(['ESTAGIO', 'MEIO_PERIODO', 'NOTURNO']);
    expect(dto.employmentType).toBe(JobEmploymentType.PJ);
  });

  it('should provide safe default categories [] and employmentType "CLT" for legacy job records', () => {
    const legacyJob = {
      id: 2,
      title: 'Vaga Legada',
      description: 'Vaga antiga sem novas colunas',
      activated: true,
      featured: false,
      job_category: 'MANAGEMENT',
      job_type: 'FULLTIME',
      min_payment: 5000,
      max_payment: 7000,
      company_id: 5
    };

    const dto = new JobDTO(legacyJob);

    expect(dto.id).toBe(2);
    expect(dto.categories).toEqual([]);
    expect(dto.employmentType).toBe(JobEmploymentType.CLT);
  });

  it('should handle array categories directly without errors', () => {
    const rawJob = {
      id: 3,
      title: 'Vaga Freelance',
      categories: [JobCategory.FREELANCE, JobCategory.PERICULOSIDADE],
      employment_type: JobEmploymentType.CONTRATO_TEMPORARIO,
      activated: true
    };

    const dto = new JobDTO(rawJob);

    expect(dto.categories).toEqual(['FREELANCE', 'PERICULOSIDADE']);
    expect(dto.employmentType).toBe(JobEmploymentType.CONTRATO_TEMPORARIO);
  });
});
