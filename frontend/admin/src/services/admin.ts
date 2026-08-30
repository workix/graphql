import api from './api';

export const adminService = {
  getStatistics() {
    return api.get('/statistics');
  },
  getUsers(params?: any) {
    return api.get('/users', { params });
  },
  updateUser(id: number | string, data: any) {
    return api.put(`/users/${id}`, data);
  },
  deleteUser(id: number | string) {
    return api.delete(`/users/${id}`);
  },
  getJAASUsers() {
    return api.get('/jaasusers');
  },
  getJAASRoles() {
    return api.get('/jaasroles');
  },
  getJobs() {
    return api.get('/jobs');
  },
  deleteJob(id: number | string) {
    return api.delete(`/jobs/${id}`);
  },
  getCompanies() {
    return api.get('/companies');
  },
  getCandidates() {
    return api.get('/candidates');
  },
  getTestimonials() {
    return api.get('/testimonials');
  },
  getSubscribers() {
    return api.get('/subscribers');
  }
};
