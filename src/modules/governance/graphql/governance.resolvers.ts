import { lgpdGovernanceService } from '../services/lgpd_governance.service';
import { featureFlagService } from '../../../utils/feature_flags.service';

const governanceResolvers = {
  LgpdExportDossier: {
    candidateProfile: (parent: any) => {
      return parent.candidateProfile ? JSON.stringify(parent.candidateProfile) : null;
    },
    resume: (parent: any) => {
      return parent.resume ? JSON.stringify(parent.resume) : null;
    },
    visibilitySettings: (parent: any) => {
      return parent.visibilitySettings ? JSON.stringify(parent.visibilitySettings) : null;
    }
  },

  Query: {
    myLgpdDataExport: async (_: any, { userId }: { userId: string | number }) => {
      return await lgpdGovernanceService.exportUserData(userId);
    },

    featureFlags: (_: any, { tenantSlug }: { tenantSlug?: string }, context: any) => {
      const activeTenant = tenantSlug || context?.tenant || context?.whiteLabelConfig?.slug;
      return featureFlagService.getAllFlags(activeTenant);
    },

    isFeatureFlagEnabled: (_: any, { flagKey, tenantSlug }: { flagKey: string; tenantSlug?: string }, context: any) => {
      const activeTenant = tenantSlug || context?.tenant || context?.whiteLabelConfig?.slug;
      return featureFlagService.isFeatureEnabled(flagKey, activeTenant);
    }
  },

  Mutation: {
    requestAccountAnonymization: async (_: any, { userId, reason }: { userId: string | number; reason?: string }) => {
      return await lgpdGovernanceService.anonymizeUserData(userId, reason);
    },

    updateTenantFeatureFlag: (_: any, { tenantSlug, flagKey, enabled }: { tenantSlug: string; flagKey: string; enabled: boolean }) => {
      featureFlagService.setTenantFlag(tenantSlug, flagKey, enabled);
      return true;
    }
  }
};

export default governanceResolvers;
