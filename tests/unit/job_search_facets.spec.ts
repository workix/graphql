import { AdaptiveSearchDriver } from '../../src/modules/jobs/search/adaptive_search.driver';
import { Job } from '../../src/models';

describe('Job Search Faceted Navigation and Aggregations', () => {
  let driver: AdaptiveSearchDriver;

  beforeEach(() => {
    driver = new AdaptiveSearchDriver();
    jest.restoreAllMocks();
  });

  it('should aggregate counts by workplace_type, job_type, seniority_level, state, and top skills', async () => {
    const mockJobs = [
      {
        id: 1,
        title: 'Backend Developer',
        workplace_type: 'REMOTE',
        job_type: 'FULLTIME',
        seniority_level: 'SENIOR',
        state: 'SP',
        skills: '["nodejs", "typescript", "graphql"]',
        activated: true
      },
      {
        id: 2,
        title: 'Frontend Developer',
        workplace_type: 'REMOTE',
        job_type: 'FULLTIME',
        seniority_level: 'PLENO',
        state: 'SP',
        skills: '["react", "typescript"]',
        activated: true
      },
      {
        id: 3,
        title: 'Mobile Engineer',
        workplace_type: 'HYBRID',
        job_type: 'FREELANCE',
        seniority_level: 'SENIOR',
        state: 'RJ',
        skills: '["flutter", "dart"]',
        activated: true
      }
    ];

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockJobs as any);

    const facets = await driver.getFacets();

    // Check workplace type facets
    const remote = facets.workplaceTypes.find(f => f.key === 'REMOTE');
    const hybrid = facets.workplaceTypes.find(f => f.key === 'HYBRID');
    expect(remote?.count).toBe(2);
    expect(hybrid?.count).toBe(1);

    // Check level facets
    const senior = facets.levels.find(f => f.key === 'SENIOR');
    const pleno = facets.levels.find(f => f.key === 'PLENO');
    expect(senior?.count).toBe(2);
    expect(pleno?.count).toBe(1);

    // Check states
    const sp = facets.states.find(f => f.key === 'SP');
    const rj = facets.states.find(f => f.key === 'RJ');
    expect(sp?.count).toBe(2);
    expect(rj?.count).toBe(1);

    // Check top skills
    const tsSkill = facets.topSkills.find(f => f.key === 'typescript');
    expect(tsSkill?.count).toBe(2);
  });
});
