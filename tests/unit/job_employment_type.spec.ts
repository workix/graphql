import { 
  JobEmploymentType, 
  JOB_EMPLOYMENT_TYPES, 
  isValidJobEmploymentType, 
  normalizeJobEmploymentType, 
  JOB_EMPLOYMENT_TYPE_LABELS 
} from '../../src/types/job_employment_types';

describe('Job Employment Type Model and Validation', () => {
  it('should define all 3 required employment types with exact enum values', () => {
    expect(JobEmploymentType.CLT).toBe('CLT');
    expect(JobEmploymentType.PJ).toBe('PJ');
    expect(JobEmploymentType.CONTRATO_TEMPORARIO).toBe('CONTRATO_TEMPORARIO');
  });

  it('should contain all 3 employment types in JOB_EMPLOYMENT_TYPES list', () => {
    expect(JOB_EMPLOYMENT_TYPES).toHaveLength(3);
    expect(JOB_EMPLOYMENT_TYPES).toContain(JobEmploymentType.CLT);
    expect(JOB_EMPLOYMENT_TYPES).toContain(JobEmploymentType.PJ);
    expect(JOB_EMPLOYMENT_TYPES).toContain(JobEmploymentType.CONTRATO_TEMPORARIO);
  });

  it('should validate valid and invalid employment type strings', () => {
    expect(isValidJobEmploymentType('CLT')).toBe(true);
    expect(isValidJobEmploymentType('PJ')).toBe(true);
    expect(isValidJobEmploymentType('CONTRATO_TEMPORARIO')).toBe(true);
    expect(isValidJobEmploymentType('TEMPORARIO')).toBe(false);
    expect(isValidJobEmploymentType('FREELANCE')).toBe(false);
    expect(isValidJobEmploymentType('')).toBe(false);
    expect(isValidJobEmploymentType(null as any)).toBe(false);
  });

  it('should normalize employment types with default fallback to CLT', () => {
    expect(normalizeJobEmploymentType('CLT')).toBe(JobEmploymentType.CLT);
    expect(normalizeJobEmploymentType('PJ')).toBe(JobEmploymentType.PJ);
    expect(normalizeJobEmploymentType('CONTRATO_TEMPORARIO')).toBe(JobEmploymentType.CONTRATO_TEMPORARIO);
    expect(normalizeJobEmploymentType('clt')).toBe(JobEmploymentType.CLT);
    expect(normalizeJobEmploymentType('pj')).toBe(JobEmploymentType.PJ);
    expect(normalizeJobEmploymentType(null)).toBe(JobEmploymentType.CLT);
    expect(normalizeJobEmploymentType(undefined)).toBe(JobEmploymentType.CLT);
    expect(normalizeJobEmploymentType('UNKNOWN')).toBe(JobEmploymentType.CLT);
  });

  it('should provide user-friendly labels in Portuguese for employment types', () => {
    expect(JOB_EMPLOYMENT_TYPE_LABELS[JobEmploymentType.CLT]).toBe('CLT');
    expect(JOB_EMPLOYMENT_TYPE_LABELS[JobEmploymentType.PJ]).toBe('PJ');
    expect(JOB_EMPLOYMENT_TYPE_LABELS[JobEmploymentType.CONTRATO_TEMPORARIO]).toBe('Contrato Temporário');
  });
});
