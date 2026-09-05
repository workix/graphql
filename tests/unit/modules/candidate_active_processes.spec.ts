import { candidateActiveProcessesService } from '../../../src/modules/candidates/services/candidate_active_processes.service';
import { visibilityService } from '../../../src/modules/candidates/services/visibility.service';
import { entitlementsService } from '../../../src/modules/premium/services/entitlements.service';
import candidatesResolvers from '../../../src/modules/candidates/graphql/candidates.resolvers';
import db from '../../../src/models';

jest.mock('../../../src/models', () => ({
  JobApplication: {
    findAll: jest.fn()
  },
  SelectiveProcessCandidate: {
    findAll: jest.fn()
  },
  SelectiveProcess: {
    findByPk: jest.fn()
  },
  KanbanCard: {
    findAll: jest.fn()
  },
  KanbanStage: {
    findByPk: jest.fn()
  },
  JobCandidate: {
    findAll: jest.fn()
  },
  Job: {
    findByPk: jest.fn()
  },
  Company: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  CompanyAdmin: {
    findOne: jest.fn()
  },
  Candidate: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  VisibilitySetting: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  ContactUnlock: {
    findOne: jest.fn()
  },
  ProfileView: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  Subscription: {
    findOne: jest.fn()
  },
  SubscriptionOverride: {
    findOne: jest.fn()
  },
  Plan: {
    findOne: jest.fn()
  },
  PlanFeature: {
    findOne: jest.fn()
  },
  NormalizedResume: {
    findOne: jest.fn()
  }
}));

describe('Candidate Active Processes & Premium Visibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CandidateActiveProcessesService', () => {
    it('permite acesso irrestrito para o próprio candidato', async () => {
      const check = await candidateActiveProcessesService.checkViewerEntitlement(undefined, true);
      expect(check.allowed).toBe(true);
    });

    it('bloqueia acesso para visitantes sem identificação de empresa', async () => {
      const check = await candidateActiveProcessesService.checkViewerEntitlement(undefined, false);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('exclusivo para empresas');
    });

    it('permite acesso quando a empresa possui entitlement VIEW_CANDIDATE_ACTIVE_PROCESSES', async () => {
      jest.spyOn(entitlementsService, 'can').mockResolvedValueOnce({ allow: true });
      const check = await candidateActiveProcessesService.checkViewerEntitlement(10, false);
      expect(check.allowed).toBe(true);
    });

    it('bloqueia e retorna isRestricted quando empresa não é assinante Premium', async () => {
      jest.spyOn(entitlementsService, 'can').mockResolvedValue({ allow: false, reason: 'Plano Free não suporta' });
      jest.spyOn(entitlementsService, 'getEffectivePlan').mockResolvedValue({
        subscription: null,
        plan: { code: 'free_v1' } as any
      });

      const result = await candidateActiveProcessesService.getActiveProcesses(1, 10, false);
      expect(result.isRestricted).toBe(true);
      expect(result.processes).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('bloqueia quando candidato desabilitou compartilhamento de processos ativos na visibilidade', async () => {
      jest.spyOn(entitlementsService, 'can').mockResolvedValue({ allow: true });
      (db.VisibilitySetting.findOne as jest.Mock).mockResolvedValue({
        searchable_by_recruiters: true,
        share_active_processes_with_recruiters: false
      });

      const result = await candidateActiveProcessesService.getActiveProcesses(1, 10, false);
      expect(result.isRestricted).toBe(true);
      expect(result.restrictionReason).toContain('não compartilhar');
    });

    it('retorna processos seletivos ativos agregados com mascaramento para vagas confidenciais', async () => {
      jest.spyOn(entitlementsService, 'can').mockResolvedValue({ allow: true });
      (db.VisibilitySetting.findOne as jest.Mock).mockResolvedValue({
        searchable_by_recruiters: true,
        share_active_processes_with_recruiters: true
      });

      // Simula 1 candidatura normal e 1 candidatura em vaga confidencial
      (db.JobApplication.findAll as jest.Mock).mockResolvedValue([
        {
          id: 101,
          job_id: 1,
          candidate_id: 1,
          status: 'INTERVIEW',
          created_at: new Date('2026-09-01'),
          updated_at: new Date('2026-09-03')
        },
        {
          id: 102,
          job_id: 2,
          candidate_id: 1,
          status: 'IN_REVIEW',
          created_at: new Date('2026-09-02'),
          updated_at: new Date('2026-09-04')
        }
      ]);

      (db.Job.findByPk as jest.Mock).mockImplementation((id: number) => {
        if (id === 1) {
          return { id: 1, title: 'Desenvolvedor Vue 3 Sênior', company_id: 50, is_confidential: false };
        }
        if (id === 2) {
          return { id: 2, title: 'Tech Lead Confidencial', company_id: 60, is_confidential: true };
        }
        return null;
      });

      (db.Company.findByPk as jest.Mock).mockImplementation((id: number) => {
        if (id === 50) return { id: 50, name: 'Tech Solutions SA', logo: 'https://example.com/logo1.png' };
        if (id === 60) return { id: 60, name: 'Secret Enterprise', logo: 'https://example.com/logo2.png' };
        return null;
      });

      (db.SelectiveProcessCandidate.findAll as jest.Mock).mockResolvedValue([]);
      (db.KanbanCard.findAll as jest.Mock).mockResolvedValue([]);
      (db.JobCandidate.findAll as jest.Mock).mockResolvedValue([]);

      const result = await candidateActiveProcessesService.getActiveProcesses(1, 10, false);

      expect(result.isRestricted).toBe(false);
      expect(result.hasActiveProcesses).toBe(true);
      expect(result.totalCount).toBe(2);
      expect(result.processes).toHaveLength(2);

      // Processo 1: Não confidencial
      const proc1 = result.processes.find(p => p.jobId === 1);
      expect(proc1).toBeDefined();
      expect(proc1?.isConfidential).toBe(false);
      expect(proc1?.companyName).toBe('Tech Solutions SA');
      expect(proc1?.companyLogo).toBe('https://example.com/logo1.png');
      expect(proc1?.currentStage).toBe('Entrevista com Recrutador');

      // Processo 2: Confidencial
      const proc2 = result.processes.find(p => p.jobId === 2);
      expect(proc2).toBeDefined();
      expect(proc2?.isConfidential).toBe(true);
      expect(proc2?.companyName).toBe('Empresa Confidencial');
      expect(proc2?.companyLogo).toBeNull();
      expect(proc2?.companyId).toBeNull();
    });

    it('retorna resumo de processos ativos através de getActiveProcessesSummary', async () => {
      jest.spyOn(candidateActiveProcessesService, 'getActiveProcesses').mockResolvedValueOnce({
        candidateId: 1,
        hasActiveProcesses: true,
        totalCount: 3,
        isRestricted: false,
        processes: []
      });

      const summary = await candidateActiveProcessesService.getActiveProcessesSummary(1, 10, false);
      expect(summary.hasActiveProcesses).toBe(true);
      expect(summary.totalCount).toBe(3);
      expect(summary.isRestricted).toBe(false);
    });
  });

  describe('GraphQL Resolvers Integration', () => {
    it('executa query candidateActiveProcesses com contexto do usuário', async () => {
      jest.spyOn(candidateActiveProcessesService, 'getActiveProcesses').mockResolvedValueOnce({
        candidateId: 1,
        hasActiveProcesses: true,
        totalCount: 1,
        isRestricted: false,
        processes: [{ id: 'app-1', jobTitle: 'Engenheiro de Software' } as any]
      });

      const ctx = { user: { id: 10, company_id: 5 } };
      const response = await candidatesResolvers.Query.candidateActiveProcesses(null, { candidateId: 1 }, ctx, null);

      expect(response.hasActiveProcesses).toBe(true);
      expect(response.totalCount).toBe(1);
    });

    it('executa mutation updateVisibilitySettings atualizando chave shareActiveProcessesWithRecruiters', async () => {
      (db.VisibilitySetting.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        candidate_id: 1,
        searchable_by_recruiters: true,
        open_to_work_visible: false,
        show_as_viewed: true,
        share_active_processes_with_recruiters: true,
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      });

      const result = await candidatesResolvers.Mutation.updateVisibilitySettings(null, {
        candidateId: 1,
        input: {
          searchableByRecruiters: true,
          openToWorkVisible: false,
          showAsViewed: true,
          shareActiveProcessesWithRecruiters: false
        }
      }, {}, null);

      expect(result.shareActiveProcessesWithRecruiters).toBe(false);
    });
  });
});
