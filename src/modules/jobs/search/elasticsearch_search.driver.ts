import { getElasticsearchClient, indexDocument, deleteDocument } from '../../../factory/elasticsearch_server';
import { JobSearchDriver, JobSearchParams, JobSearchResult, JobSearchFacets, JobSuggestion, JobSearchFilter } from './types';
import { Job, Company } from '../../../models';

export class ElasticsearchSearchDriver implements JobSearchDriver {
  private indexName = 'jobs';

  async search(params: JobSearchParams): Promise<JobSearchResult> {
    const client = getElasticsearchClient();
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 10));
    const from = (page - 1) * limit;

    const filter = params.filter || {};
    const mustQueries: any[] = [{ term: { activated: true } }];

    if (filter.workplaceType) mustQueries.push({ term: { workplace_type: filter.workplaceType } });
    if (filter.jobType) mustQueries.push({ term: { job_type: filter.jobType } });
    if (filter.jobCategory) mustQueries.push({ term: { job_category: filter.jobCategory } });
    if (filter.seniorityLevel) mustQueries.push({ term: { seniority_level: filter.seniorityLevel } });
    if (filter.state) mustQueries.push({ term: { state: filter.state } });
    if (filter.city) mustQueries.push({ match: { city: filter.city } });
    if (filter.companyId) mustQueries.push({ term: { company_id: filter.companyId } });

    if (filter.skills && filter.skills.length > 0) {
      mustQueries.push({
        terms: { skills: filter.skills.map(s => s.toLowerCase()) }
      });
    }

    if (filter.salaryMin != null) {
      mustQueries.push({ range: { max_payment: { gte: filter.salaryMin } } });
    }
    if (filter.salaryMax != null) {
      mustQueries.push({ range: { min_payment: { lte: filter.salaryMax } } });
    }
    if (filter.isPcd !== undefined) {
      mustQueries.push({ term: { is_pcd: filter.isPcd } });
    }
    if (filter.isRemote !== undefined) {
      if (filter.isRemote) {
        mustQueries.push({
          bool: {
            should: [
              { term: { is_remote: true } },
              { term: { workplace_type: 'REMOTE' } }
            ],
            minimum_should_match: 1
          }
        });
      } else {
        mustQueries.push({ term: { is_remote: false } });
      }
    }

    let query: any;
    if (params.query && params.query.trim()) {
      query = {
        function_score: {
          query: {
            bool: {
              must: [
                ...mustQueries,
                {
                  multi_match: {
                    query: params.query,
                    fields: ['title^4', 'skills^2', 'description^1', 'requirement^1'],
                    fuzziness: 'AUTO'
                  }
                }
              ]
            }
          },
          functions: [
            {
              gauss: {
                created_at: {
                  origin: 'now',
                  scale: '14d',
                  decay: 0.5
                }
              },
              weight: 1.5
            }
          ],
          score_mode: 'multiply',
          boost_mode: 'multiply'
        }
      };
    } else {
      query = {
        bool: {
          must: mustQueries
        }
      };
    }

    let sort: any[] = [];
    if (params.sortBy === 'RECENT') {
      sort = [{ created_at: { order: 'desc' } }];
    } else if (params.sortBy === 'SALARY_DESC') {
      sort = [{ max_payment: { order: 'desc' } }];
    } else if (params.sortBy === 'SALARY_ASC') {
      sort = [{ min_payment: { order: 'asc' } }];
    } else {
      sort = ['_score', { created_at: { order: 'desc' } }];
    }

    try {
      const response = await client.search({
        index: this.indexName,
        body: {
          from,
          size: limit,
          query,
          sort,
          aggs: {
            workplaceTypes: { terms: { field: 'workplace_type.keyword' } },
            jobTypes: { terms: { field: 'job_type.keyword' } },
            levels: { terms: { field: 'seniority_level.keyword' } },
            states: { terms: { field: 'state.keyword' } },
            topSkills: { terms: { field: 'skills.keyword', size: 10 } },
            pcdCount: { filter: { term: { is_pcd: true } } },
            remoteCount: { filter: { term: { is_remote: true } } }
          }
        }
      });

      const hits = response.body.hits;
      const totalCount = typeof hits.total === 'number' ? hits.total : hits.total.value;
      const jobList = hits.hits.map((hit: any) => hit._source);

      // Sponsored jobs query
      const sponsoredResponse = await client.search({
        index: this.indexName,
        body: {
          size: 3,
          query: {
            bool: {
              must: [
                { term: { activated: true } },
                { term: { is_sponsored: true } }
              ]
            }
          },
          sort: [{ updated_at: { order: 'desc' } }]
        }
      });
      const sponsoredJobs = sponsoredResponse.body.hits.hits.map((h: any) => h._source);

      const aggs = response.body.aggregations || {};
      const facets: JobSearchFacets = {
        workplaceTypes: (aggs.workplaceTypes?.buckets || []).map((b: any) => ({ key: b.key, count: b.doc_count })),
        jobTypes: (aggs.jobTypes?.buckets || []).map((b: any) => ({ key: b.key, count: b.doc_count })),
        levels: (aggs.levels?.buckets || []).map((b: any) => ({ key: b.key, count: b.doc_count })),
        states: (aggs.states?.buckets || []).map((b: any) => ({ key: b.key, count: b.doc_count })),
        topSkills: (aggs.topSkills?.buckets || []).map((b: any) => ({ key: b.key, count: b.doc_count })),
        pcdCount: aggs.pcdCount?.doc_count || 0,
        remoteCount: aggs.remoteCount?.doc_count || 0,
        pcdRemoteCount: 0
      };

      return {
        jobs: jobList,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit) || 1,
        sponsoredJobs,
        facets
      };
    } catch (error) {
      console.warn('Elasticsearch search fallback to DB:', error);
      // Fallback to PostgreSQL or Adaptive search
      const { AdaptiveSearchDriver } = require('./adaptive_search.driver');
      const fallbackDriver = new AdaptiveSearchDriver();
      return fallbackDriver.search(params);
    }
  }

  async getFacets(query?: string, filter?: JobSearchFilter): Promise<JobSearchFacets> {
    const result = await this.search({ query, filter, limit: 1 });
    return result.facets || {
      workplaceTypes: [],
      jobTypes: [],
      levels: [],
      states: [],
      topSkills: [],
      pcdCount: 0,
      remoteCount: 0,
      pcdRemoteCount: 0
    };
  }

  async getSuggestions(prefix: string): Promise<JobSuggestion[]> {
    if (!prefix || prefix.trim().length < 2) return [];
    const client = getElasticsearchClient();

    try {
      const response = await client.search({
        index: this.indexName,
        body: {
          size: 8,
          query: {
            bool: {
              must: [{ term: { activated: true } }],
              should: [
                { prefix: { title: { value: prefix.toLowerCase(), boost: 3.0 } } },
                { prefix: { skills: { value: prefix.toLowerCase(), boost: 2.0 } } }
              ]
            }
          }
        }
      });

      const hits = response.body.hits.hits;
      const suggestions: JobSuggestion[] = [];
      const seen = new Set<string>();

      for (const hit of hits) {
        const item = hit._source;
        if (item.title && item.title.toLowerCase().startsWith(prefix.toLowerCase()) && !seen.has(item.title)) {
          seen.add(item.title);
          suggestions.push({ text: item.title, category: 'CARGO' });
        }
        if (item.skills && Array.isArray(item.skills)) {
          for (const s of item.skills) {
            if (s.toLowerCase().startsWith(prefix.toLowerCase()) && !seen.has(s)) {
              seen.add(s);
              suggestions.push({ text: s, category: 'SKILL' });
            }
          }
        }
      }

      return suggestions.slice(0, 8);
    } catch (e) {
      const { AdaptiveSearchDriver } = require('./adaptive_search.driver');
      const fallbackDriver = new AdaptiveSearchDriver();
      return fallbackDriver.getSuggestions(prefix);
    }
  }

  async indexJob(job: any): Promise<void> {
    let parsedSkills: string[] = [];
    if (Array.isArray(job.skills)) {
      parsedSkills = job.skills;
    } else if (typeof job.skills === 'string') {
      try {
        parsedSkills = JSON.parse(job.skills);
      } catch {
        parsedSkills = job.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    let parsedAccessibility: string[] = [];
    if (Array.isArray(job.accessibility_features)) {
      parsedAccessibility = job.accessibility_features;
    } else if (typeof job.accessibility_features === 'string') {
      try {
        parsedAccessibility = JSON.parse(job.accessibility_features);
      } catch {
        parsedAccessibility = job.accessibility_features.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    const doc = {
      id: job.id,
      title: job.title,
      description: job.description,
      requirement: job.requirement,
      benefits: job.benefits,
      job_category: job.job_category,
      job_type: job.job_type,
      workplace_type: job.workplace_type,
      seniority_level: job.seniority_level,
      city: job.city,
      state: job.state,
      min_payment: Number(job.min_payment),
      max_payment: Number(job.max_payment),
      activated: Boolean(job.activated),
      featured: Boolean(job.featured),
      is_sponsored: Boolean(job.is_sponsored),
      sponsor_label: job.sponsor_label || 'Patrocinada',
      is_pcd: Boolean(job.is_pcd),
      is_remote: job.is_remote !== undefined ? Boolean(job.is_remote) : (job.workplace_type === 'REMOTE'),
      pcd_details: job.pcd_details || null,
      accessibility_features: parsedAccessibility,
      company_id: job.company_id,
      created_at: job.created_at || new Date().toISOString(),
      updated_at: job.updated_at || new Date().toISOString(),
      skills: parsedSkills
    };

    await indexDocument(this.indexName, String(job.id), doc);
  }

  async deleteJobIndex(jobId: number | string): Promise<void> {
    await deleteDocument(this.indexName, String(jobId));
  }
}
