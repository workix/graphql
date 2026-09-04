import { jobBoostService } from '../../src/modules/jobs/services/job_boost.service';
import { Job, JobBoost, Purchase } from '../../src/models';

jest.mock('../../src/models', () => ({
  Job: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn()
  },
  JobBoost: {
    count: jest.fn(),
    create: jest.fn()
  },
  Purchase: {
    findByPk: jest.fn()
  }
}));

describe('Sponsored Jobs - Rotulagem Imutável e Preservação do Orgânico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve garantir que vaga patrocinada contenha is_sponsored = true e sponsor_label fixo', async () => {
    const mockJob = {
      id: 10,
      title: 'Analista de Comex',
      update: jest.fn().mockResolvedValue(true)
    };

    (Job.findByPk as jest.Mock).mockResolvedValue(mockJob);
    (JobBoost.count as jest.Mock).mockResolvedValue(1);
    (JobBoost.create as jest.Mock).mockResolvedValue({
      id: 1,
      job_id: 10,
      organization_id: 1,
      label: 'Patrocinada',
      status: 'active'
    });

    const boost = await jobBoostService.boostJob(10, 1, 7, 'founder_bonus');
    expect(boost).not.toBeNull();
    expect(mockJob.update).toHaveBeenCalledWith(
      expect.objectContaining({
        is_sponsored: true,
        sponsor_label: 'Patrocinada'
      })
    );
  });

  it('deve retornar slots de destaque sem suprimir vagas do resultado orgânico', async () => {
    const mockSponsored = [{ id: 1, title: 'Vaga Destaque', is_sponsored: true, sponsor_label: 'Patrocinada' }];
    const mockOrganic = [{ id: 2, title: 'Vaga Organica', is_sponsored: false }];

    (Job.findAll as jest.Mock)
      .mockResolvedValueOnce(mockSponsored)
      .mockResolvedValueOnce(mockOrganic);

    const result = await jobBoostService.getSponsoredAndOrganicList({ limit: 10 });
    expect(result.sponsoredJobs).toEqual(mockSponsored);
    expect(result.organicJobs).toEqual(mockOrganic);
  });
});
