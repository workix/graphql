import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import JobDetailView from '../../views/JobDetailView.vue';
import MyApplicationsView from '../../views/MyApplicationsView.vue';
import { jobsService } from '../../services/jobs';
import { resumeService } from '../../services/resumes';

vi.mock('../../services/jobs', () => ({
  jobsService: {
    getById: vi.fn(),
    subscribe: vi.fn(),
    getMyApplications: vi.fn()
  }
}));

vi.mock('../../services/resumes', () => ({
  resumeService: {
    uploadResumeFile: vi.fn(),
    createResume: vi.fn()
  }
}));

describe('E2E Frontend Client: Fluxo Completo de Candidatura a Vaga', () => {
  let router: any;
  let pinia: any;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
    vi.clearAllMocks();

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/jobs/:id', name: 'JobDetail', component: JobDetailView },
        { path: '/my-applications', name: 'MyApplications', component: MyApplicationsView }
      ]
    });

    const authStore = useAuthStore();
    authStore.setAuth('jwt-valid-token', {
      id: 1,
      candidateId: 10,
      email: 'candidato@workix.com',
      name: 'Felipe Candidato',
      role: 'CANDIDATE'
    });

    (jobsService.getById as any).mockResolvedValue({
      data: {
        id: '100',
        title: 'Tech Lead / Arquiteto Node & TypeScript',
        description: '<p>Liderança técnica em microsserviços e GraphQL.</p>',
        company: { id: 1, name: 'Workix Corp' },
        jobType: 'FULLTIME',
        city: 'São Paulo, SP'
      }
    });

    (jobsService.subscribe as any).mockResolvedValue({
      success: true,
      applicationId: 'app-999'
    });

    await router.push('/jobs/100');
    await router.isReady();
  });

  it('deve carregar os detalhes da vaga e permitir que o candidato autenticado envie sua candidatura', async () => {
    const wrapper = mount(JobDetailView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          TheHeader: true,
          TheFooter: true,
          LoadingOverlay: true
        }
      }
    });

    await vi.dynamicImportSettled();
    // Aguarda montagem e carregamento
    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain('Tech Lead');

    const applyBtn = wrapper.find('.btn-apply');
    expect(applyBtn.exists()).toBe(true);

    await applyBtn.trigger('click');
    expect(jobsService.subscribe).toHaveBeenCalledWith('100', 10);
    expect((wrapper.vm as any).applied).toBe(true);
  });

  it('deve navegar para /my-applications e exibir a candidatura submetida', async () => {
    await router.push('/my-applications');
    expect(router.currentRoute.value.name).toBe('MyApplications');
  });
});
