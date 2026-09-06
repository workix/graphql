import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth';
import AdminJAASUsersView from '../../views/AdminJAASUsersView.vue';
import AdminJAASRolesView from '../../views/AdminJAASRolesView.vue';
import AdminPlansView from '../../views/AdminPlansView.vue';
import AdminFormsView from '../../views/AdminFormsView.vue';
import { adminJAASService } from '../../services/jaas.service';
import { plansAdminService } from '../../services/plansAdmin.service';
import { formsAdminService } from '../../services/formsAdmin.service';

vi.mock('../../services/jaas.service', () => ({
  adminJAASService: {
    getUsersPaginated: vi.fn(),
    getRolesPaginated: vi.fn(),
    createRole: vi.fn(),
    deleteRole: vi.fn()
  }
}));

vi.mock('../../services/plansAdmin.service', () => ({
  plansAdminService: {
    getAllPlans: vi.fn(),
    createPlan: vi.fn(),
    updatePlan: vi.fn()
  }
}));

vi.mock('../../services/formsAdmin.service', () => ({
  formsAdminService: {
    getFormsPaginated: vi.fn(),
    deleteForm: vi.fn()
  }
}));

describe('E2E Frontend Admin: Gestão de Módulos (JAAS, Planos e Formulários)', () => {
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
        { path: '/jaas-users', name: 'AdminJAASUsers', component: AdminJAASUsersView },
        { path: '/jaas-roles', name: 'AdminJAASRoles', component: AdminJAASRolesView },
        { path: '/plans', name: 'AdminPlans', component: AdminPlansView },
        { path: '/forms', name: 'AdminForms', component: AdminFormsView }
      ]
    });

    (adminJAASService.getUsersPaginated as any).mockResolvedValue({
      data: {
        jaasUsers: [
          { id: '1', login: 'admin@workix.com', roles: [{ name: 'ROLE_ADMIN' }] }
        ],
        totalPages: 1,
        currentPage: 1,
        maxRows: 1
      }
    });

    (plansAdminService.getAllPlans as any).mockResolvedValue([
      { id: 'plan-1', name: 'Plano Enterprise', price: 999.0 }
    ]);

    (formsAdminService.getFormsPaginated as any).mockResolvedValue({
      forms: [
        { id: '1', name: 'Lead Contato', email: 'lead@empresa.com', subject: 'Proposta comercial' }
      ],
      totalPages: 1,
      currentPage: 1,
      maxRows: 1
    });

    await router.push('/jaas-users');
    await router.isReady();
  });

  it('deve listar usuários com seus respectivos papéis de acesso JAAS', async () => {
    const res = await adminJAASService.getUsersPaginated(1, 10);
    expect(res.data.jaasUsers.length).toBe(1);
    expect(res.data.jaasUsers[0].login).toBe('admin@workix.com');
  });

  it('deve consultar os planos de assinatura disponíveis no backoffice', async () => {
    await router.push('/plans');
    expect(router.currentRoute.value.name).toBe('AdminPlans');

    const plans = await plansAdminService.getAllPlans();
    expect(plans.length).toBe(1);
    expect(plans[0].name).toBe('Plano Enterprise');
  });

  it('deve consultar e gerenciar os formulários de contato recebidos', async () => {
    await router.push('/forms');
    expect(router.currentRoute.value.name).toBe('AdminForms');

    const res = await formsAdminService.getFormsPaginated(1, 10);
    expect(res.forms.length).toBe(1);
    expect(res.forms[0].name).toBe('Lead Contato');
  });
});
