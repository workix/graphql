import api from './api';

export interface JobFilterParams {
  page?: number;
  limit?: number;
  q?: string;
  location?: string;
  contract_type?: string;
}

export const jobsService = {
  getPaginated(params: JobFilterParams) {
    return api.get('/jobs/paginated', { params });
  },
  getById(id: number | string) {
    return api.get(`/jobs/${id}`);
  },
  create(data: any) {
    return api.post('/jobs', data);
  },
  subscribe(jobId: number | string) {
    return api.post('/jobs/subscribe', { job_id: jobId });
  }
};
