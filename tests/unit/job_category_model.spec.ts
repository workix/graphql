import { 
  JobCategory, 
  JOB_CATEGORIES, 
  isValidJobCategory, 
  normalizeJobCategories, 
  JOB_CATEGORY_LABELS 
} from '../../src/types/job_categories';

describe('Job Category Model and Validation', () => {
  it('should define all required job categories with exact enum names', () => {
    expect(JobCategory.MEIO_PERIODO).toBe('MEIO_PERIODO');
    expect(JobCategory.PRIMEIRA_OPORTUNIDADE).toBe('PRIMEIRA_OPORTUNIDADE');
    expect(JobCategory.ESTAGIO).toBe('ESTAGIO');
    expect(JobCategory.NOTURNO).toBe('NOTURNO');
    expect(JobCategory.TEMPORARIO).toBe('TEMPORARIO');
    expect(JobCategory.FREELANCE).toBe('FREELANCE');
    expect(JobCategory.PERICULOSIDADE).toBe('PERICULOSIDADE');
    expect(JobCategory.REMOTO).toBe('REMOTO');
    expect(JobCategory.PCD).toBe('PCD');
  });

  it('should contain all categories in JOB_CATEGORIES list', () => {
    expect(JOB_CATEGORIES).toContain(JobCategory.MEIO_PERIODO);
    expect(JOB_CATEGORIES).toContain(JobCategory.PRIMEIRA_OPORTUNIDADE);
    expect(JOB_CATEGORIES).toContain(JobCategory.ESTAGIO);
    expect(JOB_CATEGORIES).toContain(JobCategory.NOTURNO);
    expect(JOB_CATEGORIES).toContain(JobCategory.TEMPORARIO);
    expect(JOB_CATEGORIES).toContain(JobCategory.FREELANCE);
    expect(JOB_CATEGORIES).toContain(JobCategory.PERICULOSIDADE);
    expect(JOB_CATEGORIES).toContain(JobCategory.REMOTO);
    expect(JOB_CATEGORIES).toContain(JobCategory.PCD);
  });

  it('should validate valid and invalid category strings', () => {
    expect(isValidJobCategory('ESTAGIO')).toBe(true);
    expect(isValidJobCategory('MEIO_PERIODO')).toBe(true);
    expect(isValidJobCategory('PRIMEIRA_OPORTUNIDADE')).toBe(true);
    expect(isValidJobCategory('NOTURNO')).toBe(true);
    expect(isValidJobCategory('TEMPORARIO')).toBe(true);
    expect(isValidJobCategory('FREELANCE')).toBe(true);
    expect(isValidJobCategory('PERICULOSIDADE')).toBe(true);
    expect(isValidJobCategory('REMOTO')).toBe(true);
    expect(isValidJobCategory('PCD')).toBe(true);
    expect(isValidJobCategory('INVALID_CATEGORY')).toBe(false);
    expect(isValidJobCategory('')).toBe(false);
    expect(isValidJobCategory(null as any)).toBe(false);
  });

  it('should normalize categories from arrays, json strings and legacy formats', () => {
    expect(normalizeJobCategories(['ESTAGIO', 'MEIO_PERIODO'])).toEqual(['ESTAGIO', 'MEIO_PERIODO']);
    expect(normalizeJobCategories('["NOTURNO", "FREELANCE"]')).toEqual(['NOTURNO', 'FREELANCE']);
    expect(normalizeJobCategories('ESTAGIO, NOTURNO')).toEqual(['ESTAGIO', 'NOTURNO']);
    expect(normalizeJobCategories('REMOTO, PCD')).toEqual(['REMOTO', 'PCD']);
    expect(normalizeJobCategories(['ESTAGIO', 'INVALID_CAT'])).toEqual(['ESTAGIO']);
    expect(normalizeJobCategories(null)).toEqual([]);
    expect(normalizeJobCategories(undefined)).toEqual([]);
  });

  it('should provide user-friendly labels in Portuguese for all categories', () => {
    expect(JOB_CATEGORY_LABELS[JobCategory.MEIO_PERIODO]).toBe('Meio Período');
    expect(JOB_CATEGORY_LABELS[JobCategory.PRIMEIRA_OPORTUNIDADE]).toBe('Primeira Oportunidade');
    expect(JOB_CATEGORY_LABELS[JobCategory.ESTAGIO]).toBe('Estágio');
    expect(JOB_CATEGORY_LABELS[JobCategory.NOTURNO]).toBe('Noturno');
    expect(JOB_CATEGORY_LABELS[JobCategory.TEMPORARIO]).toBe('Emprego Temporário');
    expect(JOB_CATEGORY_LABELS[JobCategory.FREELANCE]).toBe('Freelance');
    expect(JOB_CATEGORY_LABELS[JobCategory.PERICULOSIDADE]).toBe('Com Periculosidade');
    expect(JOB_CATEGORY_LABELS[JobCategory.REMOTO]).toBe('Trabalho Remoto');
    expect(JOB_CATEGORY_LABELS[JobCategory.PCD]).toBe('Vaga para PCD');
  });
});
