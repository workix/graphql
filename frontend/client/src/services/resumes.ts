import api from './api';

export const resumesService = {
  getPaginated(params: { page?: number; limit?: number; q?: string }) {
    return api.get('/resumes/list_with_candidates_short_paginated', { params });
  },
  getById(id: number | string) {
    return api.get(`/resumes/${id}`);
  },
  createOrUpdate(data: any) {
    return api.post('/resumes', data);
  }
};
