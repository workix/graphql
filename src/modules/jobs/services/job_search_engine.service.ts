import { SearchDriverFactory } from '../search/search_driver.factory';
import { JobSearchParams, JobSearchResult, JobSearchFacets, JobSuggestion, JobSearchFilter } from '../search/types';
import { Job, Company } from '../../../models';

export class JobSearchEngineService {
  private get driver() {
    return SearchDriverFactory.getDriver();
  }

  async search(params: JobSearchParams): Promise<JobSearchResult> {
    return await this.driver.search(params);
  }

  async getFacets(query?: string, filter?: JobSearchFilter): Promise<JobSearchFacets> {
    return await this.driver.getFacets(query, filter);
  }

  async getSuggestions(prefix: string): Promise<JobSuggestion[]> {
    return await this.driver.getSuggestions(prefix);
  }

  async indexJob(job: any): Promise<void> {
    await this.driver.indexJob(job);
  }

  async deleteJob(jobId: number | string): Promise<void> {
    await this.driver.deleteJobIndex(jobId);
  }

  async reindexAllJobs(): Promise<{ totalIndexed: number }> {
    const jobs = await Job.findAll({
      where: { activated: true },
      include: [{ model: Company, required: false }]
    });

    let count = 0;
    for (const job of jobs) {
      await this.indexJob(job);
      count++;
    }

    return { totalIndexed: count };
  }
}

export const jobSearchEngineService = new JobSearchEngineService();
