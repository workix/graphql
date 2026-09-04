import { lgpdGovernanceService } from '../../src/modules/governance/services/lgpd_governance.service';
import { featureFlagService } from '../../src/utils/feature_flags.service';
import governanceResolvers from '../../src/modules/governance/graphql/governance.resolvers';
import { User, Candidate, Resume, JobCandidate, VisibilitySetting, BillingAuditLog } from '../../src/models';

describe('LGPD Governance & Feature Flags Unit Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    featureFlagService.resetFlags();
  });

  describe('LgpdGovernanceService', () => {
    it('should export user personal data dossier in compliant format', async () => {
      const mockUser = {
        id: 10,
        name: 'Maria Silva',
        email: 'maria.silva@exemplo.com',
        created_at: '2026-01-01T00:00:00Z'
      };

      const mockCandidate = {
        id: 20,
        user_id: 10,
        headline: 'Desenvolvedora Fullstack',
        toJSON: () => ({ id: 20, headline: 'Desenvolvedora Fullstack' })
      };

      const mockResume = {
        id: 30,
        candidate_id: 20,
        summary: 'Experiência em Node e React',
        toJSON: () => ({ id: 30, summary: 'Experiência em Node e React' })
      };

      jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser as any);
      jest.spyOn(Candidate, 'findOne').mockResolvedValue(mockCandidate as any);
      jest.spyOn(Resume, 'findOne').mockResolvedValue(mockResume as any);
      jest.spyOn(JobCandidate, 'count').mockResolvedValue(3 as any);
      jest.spyOn(VisibilitySetting, 'findOne').mockResolvedValue(null as any);

      const dossier = await lgpdGovernanceService.exportUserData(10);

      expect(dossier).toBeDefined();
      expect(dossier.user.name).toBe('Maria Silva');
      expect(dossier.regulation).toContain('LGPD');
      expect(dossier.applicationsCount).toBe(3);
      expect(dossier.resume.summary).toBe('Experiência em Node e React');
    });

    it('should anonymize user personal data and deactivate account', async () => {
      const userUpdateMock = jest.fn().mockResolvedValue(true);
      const candidateUpdateMock = jest.fn().mockResolvedValue(true);
      const resumeUpdateMock = jest.fn().mockResolvedValue(true);
      const auditCreateMock = jest.fn().mockResolvedValue(true);

      const mockUser = {
        id: 50,
        name: 'Carlos Oliveira',
        email: 'carlos@exemplo.com',
        update: userUpdateMock
      };

      const mockCandidate = {
        id: 60,
        user_id: 50,
        update: candidateUpdateMock
      };

      const mockResume = {
        id: 70,
        candidate_id: 60,
        update: resumeUpdateMock
      };

      jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser as any);
      jest.spyOn(Candidate, 'findOne').mockResolvedValue(mockCandidate as any);
      jest.spyOn(Resume, 'findOne').mockResolvedValue(mockResume as any);
      jest.spyOn(BillingAuditLog, 'create').mockResolvedValue(auditCreateMock as any);

      const result = await lgpdGovernanceService.anonymizeUserData(50, 'Solicitação LGPD');

      expect(result.success).toBe(true);
      expect(result.userId).toBe(50);
      expect(userUpdateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Usuário Anonimizado',
          activated: false
        })
      );
      expect(candidateUpdateMock).toHaveBeenCalled();
      expect(resumeUpdateMock).toHaveBeenCalled();
    });
  });

  describe('FeatureFlagService', () => {
    it('should evaluate global flags correctly', () => {
      expect(featureFlagService.isFeatureEnabled('ENABLE_DIRECT_APPLY')).toBe(true);
      expect(featureFlagService.isFeatureEnabled('ENABLE_SEARCH_AI')).toBe(false);
      expect(featureFlagService.isFeatureEnabled('NON_EXISTING_FLAG')).toBe(false);
    });

    it('should support tenant-specific overrides without mutating global state', () => {
      // Globalmente ENABLE_SEARCH_AI é false
      expect(featureFlagService.isFeatureEnabled('ENABLE_SEARCH_AI')).toBe(false);

      // Ativa especificamente para o tenant techcorp
      featureFlagService.setTenantFlag('techcorp', 'ENABLE_SEARCH_AI', true);

      expect(featureFlagService.isFeatureEnabled('ENABLE_SEARCH_AI', 'techcorp')).toBe(true);
      expect(featureFlagService.isFeatureEnabled('ENABLE_SEARCH_AI', 'outro-tenant')).toBe(false);
      expect(featureFlagService.isFeatureEnabled('ENABLE_SEARCH_AI')).toBe(false);
    });

    it('should list all flags with override indication', () => {
      featureFlagService.setTenantFlag('acme', 'ENABLE_SEARCH_AI', true);

      const flags = featureFlagService.getAllFlags('acme');
      const searchAiFlag = flags.find(f => f.key === 'ENABLE_SEARCH_AI');

      expect(searchAiFlag).toBeDefined();
      expect(searchAiFlag?.enabled).toBe(true);
      expect(searchAiFlag?.isOverridden).toBe(true);
    });
  });

  describe('Governance GraphQL Resolvers', () => {
    it('should handle myLgpdDataExport query and serialize nested JSON fields', async () => {
      const mockDossier = {
        exportDate: '2026-09-04T12:00:00Z',
        regulation: 'LGPD',
        user: { id: 1, name: 'Teste' },
        candidateProfile: { headline: 'Dev' },
        resume: { summary: 'Resumo' },
        visibilitySettings: { searchable: true }
      };

      jest.spyOn(lgpdGovernanceService, 'exportUserData').mockResolvedValue(mockDossier as any);

      const result = await governanceResolvers.Query.myLgpdDataExport(null, { userId: '1' });
      expect(result.regulation).toBe('LGPD');

      // Test type resolvers
      const candidateProfileStr = governanceResolvers.LgpdExportDossier.candidateProfile(mockDossier);
      expect(candidateProfileStr).toContain('headline');
    });

    it('should handle featureFlags and mutation resolvers', () => {
      const updateResult = governanceResolvers.Mutation.updateTenantFeatureFlag(
        null,
        { tenantSlug: 'techcorp', flagKey: 'ENABLE_SEARCH_AI', enabled: true }
      );
      expect(updateResult).toBe(true);

      const isEnabled = governanceResolvers.Query.isFeatureFlagEnabled(
        null,
        { flagKey: 'ENABLE_SEARCH_AI', tenantSlug: 'techcorp' },
        {}
      );
      expect(isEnabled).toBe(true);
    });
  });
});
