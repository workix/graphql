import { AdaptiveSearchDriver } from '../../src/modules/jobs/search/adaptive_search.driver';
import { Job } from '../../src/models';

describe('Job Search Filtering & Facets for PCD and Remote', () => {
  let driver: AdaptiveSearchDriver;

  beforeEach(() => {
    driver = new AdaptiveSearchDriver();
    jest.restoreAllMocks();
  });

  const sampleJobs = [
    {
      id: 1,
      title: 'Dev Java Remoto e PCD',
      is_pcd: true,
      is_remote: true,
      workplace_type: 'REMOTE',
      activated: true
    },
    {
      id: 2,
      title: 'Dev Python Apenas Remoto',
      is_pcd: false,
      is_remote: true,
      workplace_type: 'REMOTE',
      activated: true
    },
    {
      id: 3,
      title: 'Analista PCD Presencial',
      is_pcd: true,
      is_remote: false,
      workplace_type: 'ON_SITE',
      activated: true
    },
    {
      id: 4,
      title: 'Gerente Comercial Presencial',
      is_pcd: false,
      is_remote: false,
      workplace_type: 'ON_SITE',
      activated: true
    }
  ];

  it('should filter only PCD jobs when isPcd: true', async () => {
    jest.spyOn(Job, 'findAll').mockResolvedValue(sampleJobs as any);

    const result = await driver.search({
      filter: { isPcd: true }
    });

    expect(result.jobs.length).toBe(2);
    expect(result.jobs.map((j: any) => j.id).sort()).toEqual([1, 3]);
  });

  it('should filter only Remote jobs when isRemote: true', async () => {
    jest.spyOn(Job, 'findAll').mockResolvedValue(sampleJobs as any);

    const result = await driver.search({
      filter: { isRemote: true }
    });

    expect(result.jobs.length).toBe(2);
    expect(result.jobs.map((j: any) => j.id).sort()).toEqual([1, 2]);
  });

  it('should filter jobs that are BOTH PCD and Remote', async () => {
    jest.spyOn(Job, 'findAll').mockResolvedValue(sampleJobs as any);

    const result = await driver.search({
      filter: { isPcd: true, isRemote: true }
    });

    expect(result.jobs.length).toBe(1);
    expect(result.jobs[0].id).toBe(1);
  });

  it('should aggregate pcdCount, remoteCount and pcdRemoteCount in facets', async () => {
    jest.spyOn(Job, 'findAll').mockResolvedValue(sampleJobs as any);

    const facets = await driver.getFacets();

    expect(facets.pcdCount).toBe(2);
    expect(facets.remoteCount).toBe(2);
    expect(facets.pcdRemoteCount).toBe(1);
  });
});
