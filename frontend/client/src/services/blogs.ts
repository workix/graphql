import api from './api';

export const blogsService = {
  getPaginated(params: { page?: number; limit?: number }) {
    return api.get('/blogs/paginated', { params });
  },
  getById(id: number | string) {
    return api.get(`/blogs/${id}`);
  },
  createComment(data: { blog_id: number | string; comment: string }) {
    return api.post('/comments/blog', data);
  }
};
