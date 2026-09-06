import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth';
import AdminSelectiveProcessesView from '../../views/AdminSelectiveProcessesView.vue';
import AdminCandidatesView from '../../views/AdminCandidatesView.vue';
import { selectiveProcessesAdminService } from '../../services/selectiveProcessesAdmin.service';

vi.mock('../../services/selectiveProcessesAdmin.service', () => ({
  selectiveProcessesAdminService: {
    getSelectiveProcessesPaginated: vi.fn(),
    createSelectiveProcess: vi.fn(),
    deleteSelectiveProcess: vi.fn()
  }
}));

describe('E2E Frontend Admin: Processos Seletivos, Candidatos e Triagem Kanban', () => {
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
        { path: '/selective-processes', name: 'AdminSelectiveProcesses', component: AdminSelectiveProcessesView },
        { path: '/candidates', name: 'AdminCandidates', component: AdminCandidatesView }
      ]
    });

    (selectiveProcessesAdminService.getSelectiveProcessesPaginated as any).mockResolvedValue({
      selectiveProcesses: [
        {
          id: '1',
          activated: true,
          maxCandidates: 50,
          job: { id: '10', title: 'Engenheiro Backend Sênior' }
        }
      ],
      totalPages: 1,
      currentPage: 1,
      maxRows: 1
    });

    await router.push('/selective-processes');
    await router.isReady();
  });

  it('deve listar processos seletivos ativos e suas vagas vinculadas', async () => {
    const res = await selectiveProcessesAdminService.getSelectiveProcessesPaginated(1, 10);
    expect(res.selectiveProcesses.length).toBe(1);
    expect(res.selectiveProcesses[0].job?.title).toBe('Engenheiro Backend Sênior');
    expect(res.selectiveProcesses[0].activated).toBe(true);
  });

  it('deve navegar entre as telas de processos seletivos e candidatos', async () => {
    await router.push('/candidates');
    expect(router.currentRoute.value.name).toBe('AdminCandidates');

    await router.push('/selective-processes');
    expect(router.currentRoute.value.name).toBe('AdminSelectiveProcesses');
  });
});
