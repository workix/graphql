import { CreateJobDTO, UpdateJobDTO } from '../../src/dtos/JobMutationDTO';
import { JobCategory } from '../../src/types/job_categories';
import { JobEmploymentType } from '../../src/types/job_employment_types';

describe('JobMutationDTO with Categories and EmploymentType', () => {
  it('should serialize categories and employmentType in CreateJobDTO', () => {
    const input = {
      title: 'Dev Front-end Pleno',
      description: 'Desenvolvimento Vue',
      requirement: 'Vue 3, TypeScript',
      benefits: 'VR + VT + Plano de Saúde',
      minPayment: 6000,
      maxPayment: 9000,
      companyId: 1,
      activated: true,
      featured: false,
      categories: [JobCategory.MEIO_PERIODO, JobCategory.NOTURNO],
      employmentType: JobEmploymentType.PJ
    };

    const dto = new CreateJobDTO(input);

    expect(dto.title).toBe('Dev Front-end Pleno');
    expect(dto.employment_type).toBe('PJ');
    expect(JSON.parse(dto.categories)).toEqual(['MEIO_PERIODO', 'NOTURNO']);
    expect(dto.is_remote).toBe(false);
  });

  it('should provide default categories "[]" and employmentType "CLT" if omitted in CreateJobDTO', () => {
    const input = {
      title: 'Vaga Padrão',
      description: 'Descrição',
      requirement: 'Requisitos',
      benefits: 'Benefícios',
      minPayment: 3000,
      maxPayment: 4000,
      companyId: 2,
      activated: true,
      featured: false
    };

    const dto = new CreateJobDTO(input);

    expect(dto.categories).toBe('[]');
    expect(dto.employment_type).toBe('CLT');
  });

  it('should update categories and employmentType in UpdateJobDTO', () => {
    const input = {
      title: 'Dev Front-end Sênior',
      categories: [JobCategory.ESTAGIO, JobCategory.PRIMEIRA_OPORTUNIDADE],
      employmentType: JobEmploymentType.CONTRATO_TEMPORARIO
    };

    const dto = new UpdateJobDTO(input);

    expect(dto.title).toBe('Dev Front-end Sênior');
    expect(dto.employment_type).toBe('CONTRATO_TEMPORARIO');
    expect(JSON.parse(dto.categories)).toEqual(['ESTAGIO', 'PRIMEIRA_OPORTUNIDADE']);
  });
});
