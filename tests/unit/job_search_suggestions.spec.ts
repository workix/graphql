import { AdaptiveSearchDriver } from '../../src/modules/jobs/search/adaptive_search.driver';
import { Job } from '../../src/models';

describe('Job Search Suggestions and Typeahead Autocomplete', () => {
  let driver: AdaptiveSearchDriver;

  beforeEach(() => {
    driver = new AdaptiveSearchDriver();
    jest.restoreAllMocks();
  });

  it('should return empty list when prefix is shorter than 2 characters', async () => {
    const suggestions = await driver.getSuggestions('a');
    expect(suggestions).toEqual([]);
  });

  it('should return matching job titles and skills suggestions with appropriate categories', async () => {
    const mockJobs = [
      {
        id: 1,
        title: 'Desenvolvedor React Native',
        skills: '["react", "react native", "typescript"]',
        activated: true
      },
      {
        id: 2,
        title: 'Engenheiro Frontend React',
        skills: '["react", "redux", "nextjs"]',
        activated: true
      }
    ];

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockJobs as any);

    const suggestions = await driver.getSuggestions('React');

    expect(suggestions.length).toBeGreaterThanOrEqual(2);
    expect(suggestions.some(s => s.category === 'CARGO' && s.text.includes('React'))).toBe(true);
    expect(suggestions.some(s => s.category === 'SKILL' && s.text.toLowerCase().includes('react'))).toBe(true);
  });
});
