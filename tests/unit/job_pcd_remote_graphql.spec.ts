import jobsResolvers from '../../src/modules/jobs/graphql/jobs.resolvers';
import { Job } from '../../src/models';

describe('Job GraphQL Resolvers for PCD and Remote Queries', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should query allPcdJobs and return items formatted with JobDTO', async () => {
    const mockPcdJobs = [
      {
        id: 10,
        title: 'Engenheiro de Dados PCD',
        is_pcd: true,
        is_remote: true,
        pcd_details: 'Adaptação de software',
        accessibility_features: '["screen_reader"]',
        activated: true
      }
    ];

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockPcdJobs as any);

    const result = await (jobsResolvers.Query as any).allPcdJobs(
      null,
      { start: 0, max: 10 },
      {},
      {}
    );

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(10);
    expect(result[0].isPcd).toBe(true);
    expect(result[0].isRemote).toBe(true);
    expect(result[0].pcdDetails).toBe('Adaptação de software');
    expect(result[0].accessibilityFeatures).toEqual(['screen_reader']);
  });

  it('should query allRemoteJobs and return remote jobs formatted with JobDTO', async () => {
    const mockRemoteJobs = [
      {
        id: 20,
        title: 'Desenvolvedor Fullstack Remoto',
        is_pcd: false,
        is_remote: true,
        workplace_type: 'REMOTE',
        activated: true
      }
    ];

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockRemoteJobs as any);

    const result = await (jobsResolvers.Query as any).allRemoteJobs(
      null,
      { start: 0, max: 10 },
      {},
      {}
    );

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(20);
    expect(result[0].isRemote).toBe(true);
  });
});
