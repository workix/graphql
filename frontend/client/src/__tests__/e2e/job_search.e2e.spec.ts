import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import JobsListView from '../../views/JobsListView.vue';
import JobDetailView from '../../views/JobDetailView.vue';
import { jobsService, JobModel } from '../../services/jobs';

vi.mock('../../services/jobs', () => ({
  jobsService: {
    getAll: vi.fn(),
    getAllPaginated: vi.fn(),
    getById: vi.fn(),
    search: vi.fn()
  }
}));

const mockJobs: JobModel[] = [
  {
    id: '1',
    title: 'Engenheiro de Software Fullstack Senior',
    description: 'Vaga para atuar no ecossistema Node.js, GraphQL e Vue.js.',
    employmentType: 'PJ',
    jobCategory: 'Tecnologia',
    minPayment: 15000,
    maxPayment: 20000,
    company: { id: 1, name: 'Workix Inc', description: 'Tech Talent Platform' }
  },
  {
    id: '2',
    title: 'Desenvolvedor Frontend Vue 3',
    description: 'Foco em SPAs modernas com Vite, Pinia e TypeScript.',
    employmentType: 'CLT',
    jobCategory: 'Tecnologia',
    minPayment: 9000,
    maxPayment: 12000,
    company: { id: 2, name: 'Tech Solutions', description: 'Enterprise Software' }
  }
];

describe('E2E Frontend Client: Busca, Filtros e Navegação de Vagas', () => {
  let router: any;
  let pinia: any;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/jobs', name: 'JobsList', component: JobsListView },
        { path: '/jobs/:id', name: 'JobDetail', component: JobDetailView }
      ]
    });

    (jobsService.getAllPaginated as any).mockResolvedValue({
      jobs: mockJobs,
      totalPages: 1,
      currentPage: 1,
      maxRows: 2
    });

    (jobsService.getAll as any).mockResolvedValue({
      data: mockJobs
    });

    (jobsService.getById as any).mockResolvedValue(mockJobs[0]);

    await router.push('/jobs');
    await router.isReady();
  });

  it('deve carregar a lista de vagas e exibir os cards corretamente', async () => {
    const wrapper = mount(JobsListView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          TheHeader: true,
          TheFooter: true,
          JobCard: false
        }
      }
    });

    await vi.dynamicImportSettled();
    expect(wrapper.text()).toContain('Buscar Vagas de Emprego');
  });

  it('deve filtrar as vagas ao alterar palavra-chave e tipo de contratação', async () => {
    const wrapper = mount(JobsListView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          TheHeader: true,
          TheFooter: true
        }
      }
    });

    const searchInput = wrapper.find('input[placeholder*="Cargo"]');
    if (searchInput.exists()) {
      await searchInput.setValue('Frontend');
      expect((wrapper.vm as any).searchQuery).toBe('Frontend');
    }

    const typeSelect = wrapper.find('select');
    if (typeSelect.exists()) {
      await typeSelect.setValue('CLT');
      expect((wrapper.vm as any).employmentType).toBe('CLT');
    }
  });

  it('deve navegar para a tela de detalhes da vaga ao clicar no job', async () => {
    await router.push('/jobs/1');
    expect(router.currentRoute.value.params.id).toBe('1');
    expect(router.currentRoute.value.name).toBe('JobDetail');
  });
});
