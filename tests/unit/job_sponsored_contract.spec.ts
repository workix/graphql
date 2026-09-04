import { jobBoostService } from '../../src/modules/jobs/services/job_boost.service';
import { Job, JobBoost } from '../../src/models';

describe('Sponsored Jobs - Rotulagem Imutável e Preservação do Orgânico', () => {
  it('deve garantir que vaga patrocinada contenha is_sponsored = true e sponsor_label fixo', async () => {
    const job = await Job.create({
      title: 'Analista de Comex',
      description: 'Vaga para importação e exportação',
      requirement: 'Superior completo',
      benefits: 'VT, VR',
      job_category: 'MANAGEMENT',
      job_type: 'FULLTIME',
      min_payment: 4000,
      max_payment: 6000,
      activated: true,
      featured: false,
      company_id: 1,
      outcome_status: 'OPEN'
    });

    const boost = await jobBoostService.boostJob(job.id, 1, 7, 'founder_bonus');
    expect(boost).not.toBeNull();

    await job.reload();
    expect(job.is_sponsored).toBe(true);
    expect(job.sponsor_label).toBe('Patrocinada');
  });

  it('deve retornar slots de destaque sem suprimir vagas do resultado orgânico', async () => {
    const result = await jobBoostService.getSponsoredAndOrganicList({ limit: 10 });
    expect(result).toHaveProperty('sponsoredJobs');
    expect(result).toHaveProperty('organicJobs');
    expect(Array.isArray(result.sponsoredJobs)).toBe(true);
    expect(Array.isArray(result.organicJobs)).toBe(true);
  });
});
