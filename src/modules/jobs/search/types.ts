export interface JobSearchFilter {
  workplaceType?: string;
  jobType?: string;
  jobCategory?: string;
  seniorityLevel?: string;
  state?: string;
  city?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  companyId?: number;
}

export type JobSearchSortBy = 'RELEVANCE' | 'RECENT' | 'SALARY_DESC' | 'SALARY_ASC';

export interface JobSearchParams {
  query?: string;
  filter?: JobSearchFilter;
  sortBy?: JobSearchSortBy;
  page?: number;
  limit?: number;
}

export interface FacetCount {
  key: string;
  count: number;
}

export interface JobSearchFacets {
  workplaceTypes: FacetCount[];
  jobTypes: FacetCount[];
  levels: FacetCount[];
  states: FacetCount[];
  topSkills: FacetCount[];
}

export interface JobSearchResult {
  jobs: any[];
  totalCount: number;
  page: number;
  totalPages: number;
  sponsoredJobs: any[];
  facets?: JobSearchFacets;
}

export interface JobSuggestion {
  text: string;
  category: string;
}

export interface JobSearchDriver {
  search(params: JobSearchParams): Promise<JobSearchResult>;
  getFacets(query?: string, filter?: JobSearchFilter): Promise<JobSearchFacets>;
  getSuggestions(prefix: string): Promise<JobSuggestion[]>;
  indexJob(job: any): Promise<void>;
  deleteJobIndex(jobId: number | string): Promise<void>;
}
