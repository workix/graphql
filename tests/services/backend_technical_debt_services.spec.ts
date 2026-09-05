import { contactUnlockService } from '../../src/modules/candidates/services/contact_unlock.service';
import { companyIntegrityService } from '../../src/modules/companies/services/company_integrity.service';
import { jobExpirationService } from '../../src/modules/jobs/services/job_expiration.service';
import { Candidate, ContactUnlock, Company, Job, JobCandidate } from '../../src/models';
import { entitlementsService } from '../../src/modules/premium/services/entitlements.service';
import { visibilityService } from '../../src/modules/candidates/services/visibility.service';

describe('Serviços de Resolução de Débito Técnico no Backend', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ContactUnlockService', () => {
    it('deve lançar erro se o candidato não for encontrado', async () => {
      jest.spyOn(Candidate, 'findByPk').mockResolvedValue(null);

      await expect(contactUnlockService.unlockContact(1, 10, 999)).rejects.toThrow(
        'Candidato com id 999 não encontrado.'
      );
    });

    it('deve lançar erro se a organização não tiver créditos de contato suficientes', async () => {
      jest.spyOn(Candidate, 'findByPk').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(entitlementsService, 'can').mockResolvedValue({
        allow: false,
        reason: 'Créditos esgotados'
      });

      await expect(contactUnlockService.unlockContact(1, 10, 1)).rejects.toThrow('Créditos esgotados');
    });

    it('deve lançar erro se o candidato não permitir busca por recrutadores', async () => {
      jest.spyOn(Candidate, 'findByPk').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(entitlementsService, 'can').mockResolvedValue({ allow: true });
      jest.spyOn(visibilityService, 'getSettings').mockResolvedValue({
        searchable_by_recruiters: false
      } as any);

      await expect(contactUnlockService.unlockContact(1, 10, 1)).rejects.toThrow(
        'O candidato configurou seu perfil como restrito para buscas ativas de recrutadores.'
      );
    });

    it('deve desbloquear contato com sucesso, debitar crédito e enviar notificação assíncrona', async () => {
      const mockCandidate = { id: 1, name: 'Carlos Teste' };
      const now = new Date();

      jest.spyOn(Candidate, 'findByPk').mockResolvedValue(mockCandidate as any);
      jest.spyOn(entitlementsService, 'can').mockResolvedValue({ allow: true });
      jest.spyOn(visibilityService, 'getSettings').mockResolvedValue({
        searchable_by_recruiters: true
      } as any);
      jest.spyOn(ContactUnlock, 'findOne').mockResolvedValue(null);
      jest.spyOn(ContactUnlock, 'create').mockResolvedValue({
        unlocked_at: now,
        notified_candidate_at: now
      } as any);
      jest.spyOn(entitlementsService, 'incrementUsage').mockResolvedValue({} as any);

      const mockMq = {
        publishInQueue: jest.fn().mockResolvedValue(true)
      };

      const result = await contactUnlockService.unlockContact(1, 10, 1, mockMq);

      expect(result.unlocked).toBe(true);
      expect(result.candidate).toEqual(mockCandidate);
      expect(entitlementsService.incrementUsage).toHaveBeenCalledWith(1, 'contact_credits', 1);
      expect(mockMq.publishInQueue).toHaveBeenCalled();
    });

    it('deve retornar desbloqueio já existente sem debitar novo crédito', async () => {
      const mockCandidate = { id: 1 };
      const existingUnlock = {
        unlocked_at: new Date(),
        notified_candidate_at: new Date()
      };

      jest.spyOn(Candidate, 'findByPk').mockResolvedValue(mockCandidate as any);
      jest.spyOn(entitlementsService, 'can').mockResolvedValue({ allow: true });
      jest.spyOn(visibilityService, 'getSettings').mockResolvedValue({
        searchable_by_recruiters: true
      } as any);
      jest.spyOn(ContactUnlock, 'findOne').mockResolvedValue(existingUnlock as any);
      const incSpy = jest.spyOn(entitlementsService, 'incrementUsage');

      const result = await contactUnlockService.unlockContact(1, 10, 1);

      expect(result.unlocked).toBe(true);
      expect(incSpy).not.toHaveBeenCalled();
    });
  });

  describe('CompanyIntegrityService', () => {
    it('deve retornar null se a empresa não existir', async () => {
      jest.spyOn(Company, 'findByPk').mockResolvedValue(null);

      const result = await companyIntegrityService.calculateResponseRate90d(999);
      expect(result).toBeNull();
    });

    it('deve retornar valores padrão se a empresa não tiver vagas nos últimos 90 dias', async () => {
      jest.spyOn(Company, 'findByPk').mockResolvedValue({
        id: 1,
        verified_at: null
      } as any);
      jest.spyOn(Job, 'findAll').mockResolvedValue([]);

      const result = await companyIntegrityService.calculateResponseRate90d(1);

      expect(result).toEqual({
        responseRate90d: 100.0,
        medianResponseTimeDays: 7,
        isVerified: false
      });
    });

    it('deve calcular taxa de resposta e tempo mediano com vagas ativas', async () => {
      const mockCompany = {
        id: 1,
        verified_at: new Date(),
        cnpj: '12345678000199',
        update: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Company, 'findByPk').mockResolvedValue(mockCompany as any);
      jest.spyOn(Job, 'findAll').mockResolvedValue([
        { id: 101, outcome_status: 'HIRED' },
        { id: 102, outcome_status: 'OPEN' }
      ] as any);
      jest.spyOn(JobCandidate, 'count').mockResolvedValue(5);

      const result = await companyIntegrityService.calculateResponseRate90d(1);

      expect(result?.responseRate90d).toBe(50);
      expect(mockCompany.update).toHaveBeenCalled();
    });

    it('deve conceder selo verificado quando preencher todos os critérios', async () => {
      const mockCompany = {
        id: 1,
        cnpj: '12345678000199',
        response_rate_90d: '95',
        median_response_time_days: '5',
        verified_at: null,
        update: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Company, 'findByPk').mockResolvedValue(mockCompany as any);

      const isVerified = await companyIntegrityService.evaluateVerifiedBadge(1);

      expect(isVerified).toBe(true);
      expect(mockCompany.update).toHaveBeenCalled();
    });

    it('deve suspender selo verificado quando cair abaixo dos critérios', async () => {
      const mockCompany = {
        id: 1,
        cnpj: '12345678000199',
        response_rate_90d: '60', // abaixo de 80
        median_response_time_days: '5',
        verified_at: new Date(),
        update: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Company, 'findByPk').mockResolvedValue(mockCompany as any);

      const isVerified = await companyIntegrityService.evaluateVerifiedBadge(1);

      expect(isVerified).toBe(false);
      expect(mockCompany.update).toHaveBeenCalledWith(expect.objectContaining({ verified_at: null }));
    });
  });

  describe('JobExpirationService', () => {
    it('deve expirar vagas com validade vencida automaticamente', async () => {
      const mockJob1 = { id: 10, update: jest.fn().mockResolvedValue(true) };
      const mockJob2 = { id: 20, update: jest.fn().mockResolvedValue(true) };

      jest.spyOn(Job, 'findAll').mockResolvedValue([mockJob1, mockJob2] as any);

      const result = await jobExpirationService.autoExpireJobs();

      expect(result.totalExpired).toBe(2);
      expect(result.expiredJobIds).toEqual([10, 20]);
      expect(mockJob1.update).toHaveBeenCalledWith(expect.objectContaining({
        activated: false,
        outcome_status: 'EXPIRED'
      }));
    });

    it('deve lançar erro ao tentar encerrar vaga inexistente', async () => {
      jest.spyOn(Job, 'findByPk').mockResolvedValue(null);

      await expect(jobExpirationService.closeJobWithOutcome(999, 'HIRED')).rejects.toThrow(
        'Vaga com id 999 não encontrada'
      );
    });

    it('deve encerrar vaga com status de desfecho com sucesso', async () => {
      const mockJob = {
        id: 10,
        update: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Job, 'findByPk').mockResolvedValue(mockJob as any);

      const updated = await jobExpirationService.closeJobWithOutcome(10, 'HIRED');

      expect(mockJob.update).toHaveBeenCalledWith(expect.objectContaining({
        activated: false,
        outcome_status: 'HIRED'
      }));
      expect(updated).toBeDefined();
    });
  });
});
