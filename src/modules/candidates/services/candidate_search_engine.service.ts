import { Op } from 'sequelize';
import { Candidate, NormalizedResume, User } from '../../../models';

export interface CandidateSearchFilter {
  lookingForJob?: boolean;
  inCareerTransition?: boolean;
  careerTransitionTarget?: string;
  acceptsEntryLevel?: boolean;
  state?: string;
  city?: string;
  skills?: string[];
  keywords?: string;
  minCompletenessScore?: number;
}

export interface CandidateSearchParams {
  query?: string;
  filter?: CandidateSearchFilter;
  page?: number;
  limit?: number;
}

export interface FacetItem {
  key: string;
  count: number;
}

export interface CandidateSearchFacets {
  lookingForJobCount: number;
  inCareerTransitionCount: number;
  acceptsEntryLevelCount: number;
  states: FacetItem[];
  skills: FacetItem[];
  careerTransitionTargets: FacetItem[];
}

export interface CandidateSearchResult {
  candidates: any[];
  totalCount: number;
  page: number;
  totalPages: number;
  facets?: CandidateSearchFacets;
}

export class CandidateSearchEngineService {
  /**
   * Busca avançada de candidatos com suporte a status de carreira, filtros geográficos e termos em Markdown
   */
  async search(params: CandidateSearchParams): Promise<CandidateSearchResult> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const offset = (page - 1) * limit;

    const where: any = {};
    const resumeWhere: any = {};

    // 1. Filtros de Status de Carreira
    if (params.filter?.lookingForJob !== undefined) {
      where.looking_for_job = params.filter.lookingForJob;
    }
    if (params.filter?.inCareerTransition !== undefined) {
      where.in_career_transition = params.filter.inCareerTransition;
    }
    if (params.filter?.careerTransitionTarget) {
      where.career_transition_target = {
        [Op.iLike]: `%${params.filter.careerTransitionTarget}%`,
      };
    }
    if (params.filter?.acceptsEntryLevel !== undefined) {
      where.accepts_entry_level = params.filter.acceptsEntryLevel;
    }
    if (params.filter?.state) {
      where.state = params.filter.state;
    }
    if (params.filter?.city) {
      where.city = {
        [Op.iLike]: `%${params.filter.city}%`,
      };
    }

    // 2. Filtros de Currículo Normalizado
    if (params.filter?.minCompletenessScore !== undefined) {
      resumeWhere.completeness_score = {
        [Op.gte]: params.filter.minCompletenessScore,
      };
    }

    // 3. Busca por Palavras-Chave e Texto Livre (Query)
    const searchTerm = params.query || params.filter?.keywords;
    if (searchTerm) {
      const termLike = `%${searchTerm}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: termLike } },
        { career_transition_target: { [Op.iLike]: termLike } },
        { '$normalizedResume.raw_markdown$': { [Op.iLike]: termLike } },
        { '$normalizedResume.summary$': { [Op.iLike]: termLike } },
        { '$normalizedResume.career_goals$': { [Op.iLike]: termLike } },
        { '$normalizedResume.skills$': { [Op.iLike]: termLike } },
      ];
    }

    // 4. Filtro por Skills específicas
    if (params.filter?.skills && params.filter.skills.length > 0) {
      const skillConditions = params.filter.skills.map(s => ({
        [Op.or]: [
          { '$normalizedResume.skills$': { [Op.iLike]: `%${s}%` } },
          { '$normalizedResume.raw_markdown$': { [Op.iLike]: `%${s}%` } },
        ]
      }));
      where[Op.and] = (where[Op.and] || []).concat(skillConditions);
    }

    const { rows: candidates, count: totalCount } = await Candidate.findAndCountAll({
      where,
      include: [
        {
          model: NormalizedResume,
          as: 'normalizedResume',
          required: Object.keys(resumeWhere).length > 0,
          where: Object.keys(resumeWhere).length > 0 ? resumeWhere : undefined,
        },
        { model: User, as: 'user' },
      ],
      order: [['updated_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    const facets = await this.getFacets(params.query, params.filter);

    return {
      candidates,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      facets,
    };
  }

  /**
   * Agregação dinâmica de facetas para a busca de candidatos
   */
  async getFacets(query?: string, filter?: CandidateSearchFilter): Promise<CandidateSearchFacets> {
    const allCandidates = await Candidate.findAll({
      attributes: ['id', 'looking_for_job', 'in_career_transition', 'career_transition_target', 'accepts_entry_level', 'state'],
      include: [
        { model: NormalizedResume, as: 'normalizedResume', attributes: ['skills'] },
      ],
    });

    let lookingForJobCount = 0;
    let inCareerTransitionCount = 0;
    let acceptsEntryLevelCount = 0;
    const stateMap: Record<string, number> = {};
    const skillMap: Record<string, number> = {};
    const targetMap: Record<string, number> = {};

    for (const c of allCandidates) {
      const raw = c.toJSON ? c.toJSON() : c;
      if (raw.looking_for_job) lookingForJobCount++;
      if (raw.in_career_transition) inCareerTransitionCount++;
      if (raw.accepts_entry_level) acceptsEntryLevelCount++;

      if (raw.career_transition_target) {
        targetMap[raw.career_transition_target] = (targetMap[raw.career_transition_target] || 0) + 1;
      }

      const stateVal = raw.state || raw.locale?.state;
      if (stateVal) {
        stateMap[stateVal] = (stateMap[stateVal] || 0) + 1;
      }

      if (raw.normalizedResume?.skills) {
        let skills: string[] = [];
        if (Array.isArray(raw.normalizedResume.skills)) {
          skills = raw.normalizedResume.skills;
        } else if (typeof raw.normalizedResume.skills === 'string') {
          try {
            skills = JSON.parse(raw.normalizedResume.skills);
          } catch {
            skills = raw.normalizedResume.skills.split(',').map((s: string) => s.trim());
          }
        }
        for (const skill of skills) {
          if (skill) {
            skillMap[skill] = (skillMap[skill] || 0) + 1;
          }
        }
      }
    }

    const formatMap = (map: Record<string, number>): FacetItem[] => {
      return Object.entries(map)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);
    };

    return {
      lookingForJobCount,
      inCareerTransitionCount,
      acceptsEntryLevelCount,
      states: formatMap(stateMap),
      skills: formatMap(skillMap).slice(0, 20),
      careerTransitionTargets: formatMap(targetMap).slice(0, 10),
    };
  }
}

export const candidateSearchEngineService = new CandidateSearchEngineService();
