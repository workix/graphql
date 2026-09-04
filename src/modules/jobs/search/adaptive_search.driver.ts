import { Job, Company } from '../../../models';
import { JobSearchDriver, JobSearchParams, JobSearchResult, JobSearchFacets, JobSuggestion, JobSearchFilter } from './types';
const { Op } = require('sequelize');

export class AdaptiveSearchDriver implements JobSearchDriver {
  async search(params: JobSearchParams): Promise<JobSearchResult> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 10));
    const filter = params.filter || {};

    const where: any = {
      activated: true
    };

    if (filter.workplaceType) where.workplace_type = filter.workplaceType;
    if (filter.jobType) where.job_type = filter.jobType;
    if (filter.jobCategory) where.job_category = filter.jobCategory;
    if (filter.seniorityLevel) where.seniority_level = filter.seniorityLevel;
    if (filter.state) where.state = filter.state;
    if (filter.companyId) where.company_id = filter.companyId;

    if (filter.salaryMin != null) {
      where.max_payment = { [Op.gte]: filter.salaryMin };
    }
    if (filter.salaryMax != null) {
      where.min_payment = { [Op.lte]: filter.salaryMax };
    }

    const allJobs = await Job.findAll({
      where,
      include: [{ model: Company, required: false }]
    });

    const now = Date.now();
    const queryTerms = params.query
      ? params.query.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0)
      : [];

    // Filter by city if specified
    let filteredJobs = allJobs;
    if (filter.city) {
      const targetCity = filter.city.toLowerCase().trim();
      filteredJobs = filteredJobs.filter((job: any) =>
        job.city && job.city.toLowerCase().includes(targetCity)
      );
    }

    // Filter by skills if specified
    if (filter.skills && filter.skills.length > 0) {
      const requiredSkills = filter.skills.map(s => s.toLowerCase().trim());
      filteredJobs = filteredJobs.filter((job: any) => {
        let jobSkills: string[] = [];
        try {
          jobSkills = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || '[]');
        } catch {
          jobSkills = typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()) : [];
        }
        const lowerSkills = jobSkills.map(s => s.toLowerCase());
        return requiredSkills.some(req => lowerSkills.includes(req));
      });
    }

    // Filter out expired jobs
    filteredJobs = filteredJobs.filter((job: any) => {
      if (!job.expires_at) return true;
      return new Date(job.expires_at).getTime() > now;
    });

    // Score jobs
    const scoredJobs = filteredJobs.map((job: any) => {
      let baseScore = 0;
      const title = (job.title || '').toLowerCase();
      const desc = (job.description || '').toLowerCase();
      const req = (job.requirement || '').toLowerCase();
      const ben = (job.benefits || '').toLowerCase();

      let jobSkills: string[] = [];
      try {
        jobSkills = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || '[]');
      } catch {
        jobSkills = typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()) : [];
      }
      const skillsStr = jobSkills.join(' ').toLowerCase();

      if (queryTerms.length > 0) {
        for (const term of queryTerms) {
          if (title.includes(term)) baseScore += 4.0; // Peso A: Título
          if (skillsStr.includes(term)) baseScore += 2.0; // Peso B: Skills
          if (desc.includes(term)) baseScore += 1.0; // Peso C: Descrição
          if (req.includes(term)) baseScore += 1.0;
          if (ben.includes(term)) baseScore += 0.5;
        }
      } else {
        baseScore = 1.0;
      }

      // Time decay bonus (últimos 14 dias recebem bônus de até +0.5x)
      const createdAt = job.created_at ? new Date(job.created_at).getTime() : now;
      const ageInDays = Math.max(0, (now - createdAt) / (1000 * 60 * 60 * 24));
      const timeDecayMultiplier = 1.0 + Math.max(0, (14 - ageInDays) / 28);
      const totalScore = baseScore * timeDecayMultiplier;

      return { job, score: totalScore, baseScore, createdAt };
    });

    // Filter by query match if query was provided
    let matchingResults = queryTerms.length > 0
      ? scoredJobs.filter(item => item.baseScore > 0)
      : scoredJobs;

    // Sorting
    if (params.sortBy === 'RECENT') {
      matchingResults.sort((a, b) => b.createdAt - a.createdAt);
    } else if (params.sortBy === 'SALARY_DESC') {
      matchingResults.sort((a, b) => Number(b.job.max_payment || 0) - Number(a.job.max_payment || 0));
    } else if (params.sortBy === 'SALARY_ASC') {
      matchingResults.sort((a, b) => Number(a.job.min_payment || 0) - Number(b.job.min_payment || 0));
    } else {
      // Relevância
      matchingResults.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.createdAt - a.createdAt;
      });
    }

    const totalCount = matchingResults.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = matchingResults.slice(startIndex, startIndex + limit).map(item => item.job);

    // Vagas patrocinadas isoladas
    const sponsoredJobs = allJobs
      .filter((job: any) => job.is_sponsored && (!job.expires_at || new Date(job.expires_at).getTime() > now))
      .slice(0, 3);

    const facets = await this.getFacets(params.query, params.filter);

    return {
      jobs: paginatedJobs,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      sponsoredJobs,
      facets
    };
  }

  async getFacets(query?: string, filter?: JobSearchFilter): Promise<JobSearchFacets> {
    const jobs = await Job.findAll({
      where: { activated: true },
      attributes: ['workplace_type', 'job_type', 'seniority_level', 'state', 'skills']
    });

    const workplaceCounts: Record<string, number> = {};
    const jobTypeCounts: Record<string, number> = {};
    const levelCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};
    const skillCounts: Record<string, number> = {};

    for (const job of jobs) {
      if (job.workplace_type) {
        workplaceCounts[job.workplace_type] = (workplaceCounts[job.workplace_type] || 0) + 1;
      }
      if (job.job_type) {
        jobTypeCounts[job.job_type] = (jobTypeCounts[job.job_type] || 0) + 1;
      }
      if (job.seniority_level) {
        levelCounts[job.seniority_level] = (levelCounts[job.seniority_level] || 0) + 1;
      }
      if (job.state) {
        stateCounts[job.state] = (stateCounts[job.state] || 0) + 1;
      }
      if (job.skills) {
        let parsed: string[] = [];
        try {
          parsed = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills);
        } catch {
          parsed = typeof job.skills === 'string' ? job.skills.split(',').map((s: string) => s.trim()) : [];
        }
        for (const skill of parsed) {
          if (skill) {
            const normalized = skill.toLowerCase();
            skillCounts[normalized] = (skillCounts[normalized] || 0) + 1;
          }
        }
      }
    }

    return {
      workplaceTypes: Object.entries(workplaceCounts).map(([key, count]) => ({ key, count })),
      jobTypes: Object.entries(jobTypeCounts).map(([key, count]) => ({ key, count })),
      levels: Object.entries(levelCounts).map(([key, count]) => ({ key, count })),
      states: Object.entries(stateCounts).map(([key, count]) => ({ key, count })),
      topSkills: Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key, count]) => ({ key, count }))
    };
  }

  async getSuggestions(prefix: string): Promise<JobSuggestion[]> {
    if (!prefix || prefix.trim().length < 2) return [];
    const term = prefix.trim().toLowerCase();

    const jobs = await Job.findAll({
      where: { activated: true },
      attributes: ['title', 'skills']
    });

    const suggestionsMap = new Map<string, JobSuggestion>();
    for (const job of jobs) {
      if (job.title && job.title.toLowerCase().includes(term)) {
        suggestionsMap.set(`title:${job.title}`, { text: job.title, category: 'CARGO' });
      }
      if (job.skills) {
        let parsed: string[] = [];
        try {
          parsed = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills);
        } catch {
          parsed = typeof job.skills === 'string' ? job.skills.split(',').map((s: string) => s.trim()) : [];
        }
        for (const s of parsed) {
          if (s.toLowerCase().includes(term)) {
            suggestionsMap.set(`skill:${s}`, { text: s, category: 'SKILL' });
          }
        }
      }
    }

    return Array.from(suggestionsMap.values()).slice(0, 8);
  }

  async indexJob(job: any): Promise<void> {
    // No driver adaptativo não exige indexação externa
  }

  async deleteJobIndex(jobId: number | string): Promise<void> {
    // Sincronizado automaticamente no DB
  }
}
