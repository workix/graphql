import { entitlementsService } from '../../src/modules/premium/services/entitlements.service';
import jobsResolvers from '../../src/modules/jobs/graphql/jobs.resolvers';
import companiesRepository from '../../src/modules/companies/repository/companies.repo';
import { Plan, Subscription, Job, Company } from '../../src/models';

describe('Company Free Plan and 1-Job Limit Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar que o plano Free permite 1 vaga ativa e bloqueia a 2ª vaga ativa simultânea', async () => {
    // Mock getEffectivePlan para retornar plano free_v1
    jest.spyOn(entitlementsService, 'getEffectivePlan').mockResolvedValue({
      subscription: { id: 10, organization_id: 99, status: 'active' },
      plan: {
        id: 1,
        code: 'free_v1',
        name: 'Plano Gratuito Empresa',
        tier: 'FREE'
      }
    } as any);

    // Mock PlanFeature.findOne para max_active_jobs = 1
    const { PlanFeature, SubscriptionOverride } = require('../../src/models');
    if (SubscriptionOverride) {
      jest.spyOn(SubscriptionOverride, 'findOne').mockResolvedValue(null);
    }
    jest.spyOn(PlanFeature, 'findOne').mockResolvedValue({
      id: 1,
      plan_id: 1,
      feature_key: 'max_active_jobs',
      limit_value: 1,
      enabled: true
    } as any);

    // Cenário 1: 0 vagas ativas -> deve permitir criação de 1 vaga
    jest.spyOn(Job, 'count').mockResolvedValueOnce(0);
    const check1 = await entitlementsService.can(99, 'max_active_jobs', 1);
    expect(check1.allow).toBe(true);
    expect(check1.limit).toBe(1);
    expect(check1.currentUsage).toBe(0);

    // Cenário 2: 1 vaga ativa já existente -> deve bloquear criação da 2ª vaga
    jest.spyOn(Job, 'count').mockResolvedValueOnce(1);
    const check2 = await entitlementsService.can(99, 'max_active_jobs', 1);
    expect(check2.allow).toBe(false);
    expect(check2.upgradeTo).toBe('starter_v1');
    expect(check2.reason).toContain('Limite de 1 vagas ativas simultâneas atingido');
  });

  it('deve lançar erro no resolver createJob quando a empresa no plano Free tentar criar a 2ª vaga ativa', async () => {
    jest.spyOn(entitlementsService, 'can').mockResolvedValueOnce({
      allow: false,
      reason: 'Limite de 1 vagas ativas simultâneas atingido no plano Plano Gratuito Empresa.',
      upgradeTo: 'starter_v1'
    });

    const mockCtx = {
      orm: {},
      rabbitmqClient: {}
    };

    const args = {
      input: {
        title: 'Segunda Vaga Desenvolvedor',
        companyId: 99,
        activated: true,
        benefits: 'VA/VR',
        description: 'Descrição',
        featured: false,
        maxPayment: 5000,
        minPayment: 3000,
        requirement: 'Node.js'
      }
    };

    await expect(jobsResolvers.Mutation.createJob(null, args, mockCtx, null)).rejects.toThrow(
      'Limite de 1 vagas ativas simultâneas atingido no plano Plano Gratuito Empresa.'
    );
  });

  it('deve provisionar automaticamente assinatura Free ativa na criação da empresa', async () => {
    const mockCompany = {
      id: 123,
      name: 'Empresa Teste',
      reload: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Company, 'create').mockResolvedValue(mockCompany as any);
    jest.spyOn(Plan, 'findOne').mockResolvedValue({ id: 1, code: 'free_v1', name: 'Plano Gratuito Empresa' } as any);
    const subCreateSpy = jest.spyOn(Subscription, 'create').mockResolvedValue({ id: 50, status: 'active' } as any);

    const repo = companiesRepository({});
    const created = await repo.create({
      input: {
        name: 'Empresa Teste',
        cnpj: '12345678000199',
        userId: 10
      }
    });

    expect(created.id).toBe(123);
    expect(subCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        organization_id: 123,
        plan_id: 1,
        status: 'active'
      })
    );
  });
});
