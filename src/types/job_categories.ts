export enum JobCategory {
  MEIO_PERIODO = 'MEIO_PERIODO',
  PRIMEIRA_OPORTUNIDADE = 'PRIMEIRA_OPORTUNIDADE',
  ESTAGIO = 'ESTAGIO',
  NOTURNO = 'NOTURNO',
  TEMPORARIO = 'TEMPORARIO',
  FREELANCE = 'FREELANCE',
  PERICULOSIDADE = 'PERICULOSIDADE'
}

export const JOB_CATEGORIES: JobCategory[] = [
  JobCategory.MEIO_PERIODO,
  JobCategory.PRIMEIRA_OPORTUNIDADE,
  JobCategory.ESTAGIO,
  JobCategory.NOTURNO,
  JobCategory.TEMPORARIO,
  JobCategory.FREELANCE,
  JobCategory.PERICULOSIDADE
];

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  [JobCategory.MEIO_PERIODO]: 'Meio Período',
  [JobCategory.PRIMEIRA_OPORTUNIDADE]: 'Primeira Oportunidade',
  [JobCategory.ESTAGIO]: 'Estágio',
  [JobCategory.NOTURNO]: 'Noturno',
  [JobCategory.TEMPORARIO]: 'Emprego Temporário',
  [JobCategory.FREELANCE]: 'Freelance',
  [JobCategory.PERICULOSIDADE]: 'Com Periculosidade'
};

export function isValidJobCategory(value: any): value is JobCategory {
  if (typeof value !== 'string') return false;
  return Object.values(JobCategory).includes(value as JobCategory);
}

export function normalizeJobCategories(raw: any): JobCategory[] {
  if (!raw) return [];
  let parsed: any[] = [];
  if (Array.isArray(raw)) {
    parsed = raw;
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        parsed = trimmed.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      }
    } else {
      parsed = trimmed.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    }
  }

  const validCategories = parsed
    .map(cat => (typeof cat === 'string' ? cat.trim().toUpperCase() : ''))
    .filter(isValidJobCategory);

  return Array.from(new Set(validCategories));
}
