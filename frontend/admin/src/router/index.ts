import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAdminAuthStore } from '../stores/adminAuth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'AdminLogin',
    component: () => import('../views/AdminLoginView.vue')
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/AdminDashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'AdminUsers',
    component: () => import('../views/AdminUsersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/jaas-users',
    name: 'AdminJAASUsers',
    component: () => import('../views/AdminJAASUsersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/jaas-roles',
    name: 'AdminJAASRoles',
    component: () => import('../views/AdminJAASRolesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/jobs',
    name: 'AdminJobs',
    component: () => import('../views/AdminJobsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/companies',
    name: 'AdminCompanies',
    component: () => import('../views/AdminCompaniesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/candidates',
    name: 'AdminCandidates',
    component: () => import('../views/AdminCandidatesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/testimonials',
    name: 'AdminTestimonials',
    component: () => import('../views/AdminTestimonialsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/subscribers',
    name: 'AdminSubscribers',
    component: () => import('../views/AdminSubscribersView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const enableAuthGuard = import.meta.env.VITE_ENABLE_AUTH_GUARD === 'true';
  if (!enableAuthGuard) {
    return next();
  }
  const adminAuthStore = useAdminAuthStore();
  if (to.meta.requiresAuth && !adminAuthStore.isAuthenticated) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
