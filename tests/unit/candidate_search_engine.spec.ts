import { candidateSearchEngineService } from '../../src/modules/candidates/services/candidate_search_engine.service';
import { Candidate } from '../../src/models';

jest.mock('../../src/models', () => {
  const mockCandidate = {
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
  };
  return {
    Candidate: mockCandidate,
    NormalizedResume: {},
    Locale: {},
    Contact: {},
    User: {},
  };
});

describe('Candidate Search Engine Service (Motor de Busca de Candidatos)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Busca Avançada com Filtros Combinados (search)', () => {
    it('deve filtrar candidatos buscando por status de carreira e transição', async () => {
      const mockCandidates = [
        {
          id: 1,
          name: 'Ana Silva',
          looking_for_job: true,
          in_career_transition: true,
          career_transition_target: 'Product Manager',
          accepts_entry_level: false,
          normalizedResume: {
            skills: ['Scrum', 'Figma', 'Product Strategy'],
            completeness_score: 95,
          },
        },
      ];

      (Candidate.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: mockCandidates,
        count: 1,
      });

      (Candidate.findAll as jest.Mock).mockResolvedValue(mockCandidates);

      const result = await candidateSearchEngineService.search({
        filter: {
          lookingForJob: true,
          inCareerTransition: true,
          careerTransitionTarget: 'Product',
        },
        page: 1,
        limit: 10,
      });

      expect(Candidate.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        limit: 10,
        offset: 0,
      }));
      expect(result.totalCount).toBe(1);
      expect(result.candidates[0].name).toBe('Ana Silva');
    });

    it('deve realizar busca por texto livre em termos do currículo normalizado', async () => {
      (Candidate.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });
      (Candidate.findAll as jest.Mock).mockResolvedValue([]);

      const result = await candidateSearchEngineService.search({
        query: 'TypeScript GraphQL',
      });

      expect(Candidate.findAndCountAll).toHaveBeenCalled();
      expect(result.totalCount).toBe(0);
      expect(result.page).toBe(1);
    });
  });

  describe('Agregação Dinâmica de Facetas (getFacets)', () => {
    it('deve calcular as contagens de facetas para status e skills', async () => {
      const allMockCandidates = [
        {
          id: 1,
          looking_for_job: true,
          in_career_transition: true,
          career_transition_target: 'Tech Lead',
          accepts_entry_level: false,
          locale: { state: 'SP' },
          normalizedResume: { skills: JSON.stringify(['Node.js', 'React']) },
        },
        {
          id: 2,
          looking_for_job: true,
          in_career_transition: false,
          career_transition_target: null,
          accepts_entry_level: true,
          locale: { state: 'RJ' },
          normalizedResume: { skills: ['Node.js', 'PostgreSQL'] },
        },
      ];

      (Candidate.findAll as jest.Mock).mockResolvedValue(allMockCandidates);

      const facets = await candidateSearchEngineService.getFacets();

      expect(facets.lookingForJobCount).toBe(2);
      expect(facets.inCareerTransitionCount).toBe(1);
      expect(facets.acceptsEntryLevelCount).toBe(1);

      const spState = facets.states.find(s => s.key === 'SP');
      expect(spState?.count).toBe(1);

      const nodeSkill = facets.skills.find(s => s.key === 'Node.js');
      expect(nodeSkill?.count).toBe(2);
    });
  });
});
