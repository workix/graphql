import { Job, Company } from '../../../models';
import { JobSearchDriver, JobSearchParams, JobSearchResult, JobSearchFacets, JobSuggestion, JobSearchFilter } from './types';
const { Op, Sequelize } = require('sequelize');

export class PostgresSearchDriver implements JobSearchDriver {
  async search(params: JobSearchParams): Promise<JobSearchResult> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 10));
    const offset = (page - 1) * limit;

    const where: any = {
      activated: true,
      [Op.or]: [
        { expires_at: null },
        { expires_at: { [Op.gt]: new Date() } }
      ]
    };

    const filter = params.filter || {};
    if (filter.workplaceType) where.workplace_type = filter.workplaceType;
    if (filter.jobType) where.job_type = filter.jobType;
    if (filter.jobCategory) where.job_category = filter.jobCategory;
    if (filter.seniorityLevel) where.seniority_level = filter.seniorityLevel;
    if (filter.state) where.state = filter.state;
    if (filter.city) where.city = { [Op.iLike]: `%${filter.city}%` };
    if (filter.companyId) where.company_id = filter.companyId;

    if (filter.salaryMin != null) {
      where.max_payment = { [Op.gte]: filter.salaryMin };
    }
    if (filter.salaryMax != null) {
      where.min_payment = { [Op.lte]: filter.salaryMax };
    }
    if (filter.isPcd !== undefined) {
      where.is_pcd = filter.isPcd;
    }
    if (filter.isRemote !== undefined) {
      if (filter.isRemote) {
        where[Op.or] = [
          { is_remote: true },
          { workplace_type: 'REMOTE' }
        ];
      } else {
        where.is_remote = false;
        where.workplace_type = { [Op.ne]: 'REMOTE' };
      }
    }

    let order: any[] = [];
    if (params.query && params.query.trim()) {
      const sanitized = params.query.trim().replace(/'/g, "''");
      where[Op.and] = Sequelize.literal(`search_vector @@ to_tsquery('portuguese', '${sanitized}:*')`);
      
      if (params.sortBy === 'RECENT') {
        order = [['created_at', 'DESC']];
      } else if (params.sortBy === 'SALARY_DESC') {
        order = [['max_payment', 'DESC']];
      } else if (params.sortBy === 'SALARY_ASC') {
        order = [['min_payment', 'ASC']];
      } else {
        // Relevância ponderada + Time Decay
        order = [
          [Sequelize.literal(`ts_rank('{0.1, 0.2, 0.4, 1.0}', search_vector, to_tsquery('portuguese', '${sanitized}:*'))`), 'DESC'],
          ['created_at', 'DESC']
        ];
      }
    } else {
      if (params.sortBy === 'SALARY_DESC') {
        order = [['max_payment', 'DESC']];
      } else if (params.sortBy === 'SALARY_ASC') {
        order = [['min_payment', 'ASC']];
      } else {
        order = [['created_at', 'DESC']];
      }
    }

    const { rows, count } = await Job.findAndCountAll({
      where,
      include: [{ model: Company, required: false }],
      order,
      limit,
      offset
    });

    // Vagas patrocinadas em destaque
    const sponsoredWhere: any = {
      is_sponsored: true,
      activated: true,
      [Op.or]: [
        { expires_at: null },
        { expires_at: { [Op.gt]: new Date() } }
      ]
    };
    if (filter.workplaceType) sponsoredWhere.workplace_type = filter.workplaceType;
    if (filter.jobType) sponsoredWhere.job_type = filter.jobType;
    if (filter.isPcd !== undefined) sponsoredWhere.is_pcd = filter.isPcd;
    if (filter.isRemote !== undefined) sponsoredWhere.is_remote = filter.isRemote;

    const sponsoredJobs = await Job.findAll({
      where: sponsoredWhere,
      include: [{ model: Company, required: false }],
      order: [['updated_at', 'DESC']],
      limit: 3
    });

    const facets = await this.getFacets(params.query, params.filter);

    return {
      jobs: rows,
      totalCount: count,
      page,
      totalPages: Math.ceil(count / limit) || 1,
      sponsoredJobs,
      facets
    };
  }

  async getFacets(query?: string, filter?: JobSearchFilter): Promise<JobSearchFacets> {
    const jobs = await Job.findAll({
      where: { activated: true },
      attributes: ['workplace_type', 'job_type', 'seniority_level', 'state', 'skills', 'is_pcd', 'is_remote']
    });

    const workplaceCounts: Record<string, number> = {};
    const jobTypeCounts: Record<string, number> = {};
    const levelCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};
    const skillCounts: Record<string, number> = {};
    let pcdCount = 0;
    let remoteCount = 0;
    let pcdRemoteCount = 0;

    const categoryCounts: Record<string, number> = {};
    const employmentTypeCounts: Record<string, number> = {};

    for (const cat of ['MEIO_PERIODO', 'PRIMEIRA_OPORTUNIDADE', 'ESTAGIO', 'NOTURNO', 'TEMPORARIO', 'FREELANCE', 'PERICULOSIDADE']) {
      categoryCounts[cat] = 0;
    }
    for (const emp of ['CLT', 'PJ', 'CONTRATO_TEMPORARIO']) {
      employmentTypeCounts[emp] = 0;
    }

    for (const job of jobs) {
      const isJobPcd = Boolean(job.is_pcd);
      const isJobRemote = Boolean(job.is_remote) || job.workplace_type === 'REMOTE';

      if (isJobPcd) pcdCount++;
      if (isJobRemote) remoteCount++;
      if (isJobPcd && isJobRemote) pcdRemoteCount++;

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
      if (job.categories) {
        let cats: string[] = [];
        try {
          cats = Array.isArray(job.categories) ? job.categories : JSON.parse(job.categories);
        } catch {
          cats = typeof job.categories === 'string' ? job.categories.split(',').map((s: string) => s.trim()) : [];
        }
        for (const cat of cats) {
          if (categoryCounts[cat] !== undefined) {
            categoryCounts[cat]++;
          }
        }
      }
      if (job.employment_type) {
        const emp = job.employment_type.toUpperCase();
        if (employmentTypeCounts[emp] !== undefined) {
          employmentTypeCounts[emp]++;
        }
      }
    }

    return {
      workplaceTypes: Object.entries(workplaceCounts).map(([key, count]) => ({ key, count })),
      jobTypes: Object.entries(jobTypeCounts).map(([key, count]) => ({ key, count })),
      categories: Object.entries(categoryCounts).map(([key, count]) => ({ key, count })),
      employmentTypes: Object.entries(employmentTypeCounts).map(([key, count]) => ({ key, count })),
      levels: Object.entries(levelCounts).map(([key, count]) => ({ key, count })),
      states: Object.entries(stateCounts).map(([key, count]) => ({ key, count })),
      topSkills: Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key, count]) => ({ key, count })),
      pcdCount,
      remoteCount,
      pcdRemoteCount
    };
  }

  async getSuggestions(prefix: string): Promise<JobSuggestion[]> {
    if (!prefix || prefix.trim().length < 2) return [];
    const term = prefix.trim();

    const jobs = await Job.findAll({
      where: {
        activated: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${term}%` } },
          { requirement: { [Op.iLike]: `%${term}%` } }
        ]
      },
      attributes: ['title', 'skills'],
      limit: 10
    });

    const suggestionsMap = new Map<string, JobSuggestion>();
    for (const job of jobs) {
      if (job.title && job.title.toLowerCase().includes(term.toLowerCase())) {
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
          if (s.toLowerCase().includes(term.toLowerCase())) {
            suggestionsMap.set(`skill:${s}`, { text: s, category: 'SKILL' });
          }
        }
      }
    }

    return Array.from(suggestionsMap.values()).slice(0, 8);
  }

  async indexJob(job: any): Promise<void> {
    // No Postgres, o search_vector pode ser atualizado via trigger ou coluna gerada
  }

  async deleteJobIndex(jobId: number | string): Promise<void> {
    // Sincronizado automaticamente com DELETE relacional
  }
}
