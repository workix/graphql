import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/jobs',
    name: 'JobsList',
    component: () => import('../views/JobsListView.vue')
  },
  {
    path: '/jobs/:id',
    name: 'JobDetail',
    component: () => import('../views/JobDetailView.vue')
  },
  {
    path: '/post-job',
    name: 'PostJob',
    component: () => import('../views/PostJobView.vue'),
    meta: { requiresAuth: true, role: 'COMPANY' }
  },
  {
    path: '/my-jobs',
    name: 'MyJobs',
    component: () => import('../views/MyJobsView.vue'),
    meta: { requiresAuth: true, role: 'COMPANY' }
  },
  {
    path: '/candidates',
    name: 'CandidatesList',
    component: () => import('../views/CandidatesListView.vue')
  },
  {
    path: '/candidates/:id',
    name: 'CandidateDetail',
    component: () => import('../views/CandidateDetailView.vue')
  },
  {
    path: '/post-resume',
    name: 'PostResume',
    component: () => import('../views/PostResumeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-applications',
    name: 'MyApplications',
    component: () => import('../views/MyApplicationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/company/:id',
    name: 'CompanyDetail',
    component: () => import('../views/CompanyDetailView.vue')
  },
  {
    path: '/feed',
    name: 'SocialFeed',
    component: () => import('../views/SocialFeedView.vue')
  },
  {
    path: '/mynetwork',
    name: 'MyNetwork',
    component: () => import('../views/MyNetworkView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messaging',
    name: 'Messaging',
    component: () => import('../views/MessagingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/NotificationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import('../views/ProfileEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/in/:id',
    name: 'PublicProfile',
    component: () => import('../views/PublicProfileView.vue')
  },
  {
    path: '/analytics/ssi',
    name: 'SocialSelling',
    component: () => import('../views/SocialSellingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics/views',
    name: 'ProfileAnalytics',
    component: () => import('../views/ProfileAnalyticsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/groups',
    name: 'GroupsList',
    component: () => import('../views/GroupsListView.vue')
  },
  {
    path: '/groups/:id',
    name: 'GroupDetail',
    component: () => import('../views/GroupDetailView.vue')
  },
  {
    path: '/hashtag/:tag',
    name: 'HashtagFeed',
    component: () => import('../views/HashtagFeedView.vue')
  },
  {
    path: '/blog',
    name: 'BlogList',
    component: () => import('../views/BlogListView.vue')
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: () => import('../views/BlogPostView.vue')
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
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
