import jobsResolvers from '../../src/modules/jobs/graphql/jobs.resolvers';
import { jobSearchEngineService } from '../../src/modules/jobs/services/job_search_engine.service';

describe('Job Search GraphQL Resolvers and Sponsored Slot Preservation', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should resolve searchJobs with paginated organic results and isolated sponsoredJobs', async () => {
    const mockSearchResult = {
      jobs: [
        {
          id: 100,
          title: 'Arquiteto de Software Java',
          description: 'Liderança técnica',
          is_sponsored: false,
          sponsor_label: null,
          skills: '["java", "cloud"]',
          workplace_type: 'REMOTE',
          seniority_level: 'SPECIALIST',
          created_at: new Date()
        }
      ],
      totalCount: 1,
      page: 1,
      totalPages: 1,
      sponsoredJobs: [
        {
          id: 999,
          title: 'Vaga Patrocinada - Fullstack Java',
          description: 'Destaque pago',
          is_sponsored: true,
          sponsor_label: 'Patrocinada',
          skills: '["java", "react"]',
          workplace_type: 'REMOTE',
          seniority_level: 'SENIOR',
          created_at: new Date()
        }
      ],
      facets: {
        workplaceTypes: [{ key: 'REMOTE', count: 2 }],
        jobTypes: [],
        levels: [{ key: 'SPECIALIST', count: 1 }, { key: 'SENIOR', count: 1 }],
        states: [],
        topSkills: [{ key: 'java', count: 2 }]
      }
    };

    jest.spyOn(jobSearchEngineService, 'search').mockResolvedValue(mockSearchResult as any);

    const result = await (jobsResolvers.Query as any).searchJobs(
      null,
      {
        query: 'Java',
        filter: { workplaceType: 'REMOTE' },
        sortBy: 'RELEVANCE',
        page: 1,
        limit: 10
      },
      {},
      {}
    );

    expect(result.jobs.length).toBe(1);
    expect(result.jobs[0].id).toBe(100);
    expect(result.jobs[0].isSponsored).toBe(false);

    // Sponsored slot must be present in sponsoredJobs separately
    expect(result.sponsoredJobs.length).toBe(1);
    expect(result.sponsoredJobs[0].id).toBe(999);
    expect(result.sponsoredJobs[0].isSponsored).toBe(true);
    expect(result.sponsoredJobs[0].sponsorLabel).toBe('Patrocinada');

    // Facets must be returned correctly
    expect(result.facets.workplaceTypes[0].key).toBe('REMOTE');
  });

  it('should resolve jobSearchSuggestions and jobSearchFacets correctly', async () => {
    jest.spyOn(jobSearchEngineService, 'getSuggestions').mockResolvedValue([
      { text: 'TypeScript Developer', category: 'CARGO' }
    ]);
    jest.spyOn(jobSearchEngineService, 'getFacets').mockResolvedValue({
      workplaceTypes: [{ key: 'HYBRID', count: 5 }],
      jobTypes: [],
      levels: [],
      states: [],
      topSkills: []
    });

    const suggestions = await (jobsResolvers.Query as any).jobSearchSuggestions(
      null,
      { prefix: 'Type' },
      {},
      {}
    );
    expect(suggestions).toEqual([{ text: 'TypeScript Developer', category: 'CARGO' }]);

    const facets = await (jobsResolvers.Query as any).jobSearchFacets(
      null,
      { query: 'Type' },
      {},
      {}
    );
    expect(facets.workplaceTypes[0].count).toBe(5);
  });
});
