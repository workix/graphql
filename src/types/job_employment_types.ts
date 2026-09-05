export enum JobEmploymentType {
  CLT = 'CLT',
  PJ = 'PJ',
  CONTRATO_TEMPORARIO = 'CONTRATO_TEMPORARIO'
}

export const JOB_EMPLOYMENT_TYPES: JobEmploymentType[] = [
  JobEmploymentType.CLT,
  JobEmploymentType.PJ,
  JobEmploymentType.CONTRATO_TEMPORARIO
];

export const JOB_EMPLOYMENT_TYPE_LABELS: Record<JobEmploymentType, string> = {
  [JobEmploymentType.CLT]: 'CLT',
  [JobEmploymentType.PJ]: 'PJ',
  [JobEmploymentType.CONTRATO_TEMPORARIO]: 'Contrato Temporário'
};

export function isValidJobEmploymentType(value: any): value is JobEmploymentType {
  if (typeof value !== 'string') return false;
  return Object.values(JobEmploymentType).includes(value as JobEmploymentType);
}

export function normalizeJobEmploymentType(raw: any, fallback: JobEmploymentType = JobEmploymentType.CLT): JobEmploymentType {
  if (!raw || typeof raw !== 'string') return fallback;
  const upper = raw.trim().toUpperCase();
  if (isValidJobEmploymentType(upper)) {
    return upper;
  }
  return fallback;
}
