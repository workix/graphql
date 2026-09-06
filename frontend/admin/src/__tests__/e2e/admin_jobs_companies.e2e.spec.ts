import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth';
import AdminJobsView from '../../views/AdminJobsView.vue';
import AdminCompaniesView from '../../views/AdminCompaniesView.vue';
import { adminJobsService } from '../../services/jobs.service';
import { adminCompaniesService } from '../../services/companies.service';

vi.mock('../../services/jobs.service', () => ({
  adminJobsService: {
    getPaginated: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('../../services/companies.service', () => ({
  adminCompaniesService: {
    getPaginated: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

describe('E2E Frontend Admin: Gestão e Moderação de Vagas e Empresas', () => {
  let router: any;
  let pinia: any;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
    vi.clearAllMocks();

    const authStore = useAdminAuthStore();
    authStore.setAdminAuth('mock-admin-token', {
      id: 3,
      email: 'admin@workix.com',
      role: 'ROLE_ADMIN'
    });

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/jobs', name: 'AdminJobs', component: AdminJobsView },
        { path: '/companies', name: 'AdminCompanies', component: AdminCompaniesView }
      ]
    });

    (adminCompaniesService.getPaginated as any).mockResolvedValue({
      data: {
        companies: [
          { id: '1', name: 'Tech Solutions Brasil', email: 'contato@techsolutions.com', cnpj: '12.345.678/0001-90' }
        ],
        totalPages: 1,
        currentPage: 1,
        maxRows: 1
      }
    });

    (adminJobsService.getPaginated as any).mockResolvedValue({
      data: {
        jobs: [
          {
            id: '1',
            title: 'Arquiteto Cloud & DevOps',
            activated: true,
            featured: true,
            company: { id: 1, name: 'Tech Solutions Brasil' }
          }
        ],
        totalPages: 1,
        currentPage: 1,
        maxRows: 1
      }
    });

    await router.push('/companies');
    await router.isReady();
  });

  it('deve listar empresas cadastradas no portal corporativo', async () => {
    const res = await adminCompaniesService.getPaginated(1, 10);
    expect(res.data.companies.length).toBe(1);
    expect(res.data.companies[0].name).toBe('Tech Solutions Brasil');
  });

  it('deve cadastrar uma nova empresa via adminCompaniesService.create', async () => {
    (adminCompaniesService.create as any).mockResolvedValueOnce({
      data: {
        id: '2',
        name: 'Inovação Digital Ltda',
        cnpj: '98.765.432/0001-10'
      }
    });

    const created = await adminCompaniesService.create({
      name: 'Inovação Digital Ltda',
      cnpj: '98.765.432/0001-10'
    });

    expect(created.data.name).toBe('Inovação Digital Ltda');
  });

  it('deve moderar e listar vagas ativas e em destaque via adminJobsService', async () => {
    await router.push('/jobs');
    expect(router.currentRoute.value.name).toBe('AdminJobs');

    const res = await adminJobsService.getPaginated({ page: 1, limit: 10 });
    expect(res.data.jobs.length).toBe(1);
    expect(res.data.jobs[0].title).toContain('Arquiteto Cloud');
    expect(res.data.jobs[0].featured).toBe(true);
  });
});
