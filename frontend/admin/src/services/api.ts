import axios from 'axios';
import { useAdminAuthStore } from '../stores/adminAuth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const adminAuthStore = useAdminAuthStore();
    if (adminAuthStore.token) {
      config.headers.Authorization = `Bearer ${adminAuthStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const adminAuthStore = useAdminAuthStore();
      adminAuthStore.logout();
    }
    return Promise.reject(error);
  }
);

export default api;
