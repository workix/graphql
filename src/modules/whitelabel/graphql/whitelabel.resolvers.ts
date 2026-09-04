import { tenantResolverService } from '../services/tenant_resolver.service';

const whitelabelResolvers = {
  WhiteLabelConfig: {
    css_variables: (parent: any) => {
      return tenantResolverService.buildCssVariables(parent);
    },
    institutional_links: (parent: any) => {
      if (!parent.institutional_links) return null;
      if (typeof parent.institutional_links === 'object') return parent.institutional_links;
      try {
        return JSON.parse(parent.institutional_links);
      } catch (e) {
        return null;
      }
    }
  },

  Query: {
    whiteLabelConfig: async (_: any, args: { slug?: string; domain?: string }, context: any) => {
      if (args.slug || args.domain) {
        return await tenantResolverService.resolveTenant({
          tenantSlug: args.slug,
          domain: args.domain
        });
      }

      if (context && context.whiteLabelConfig) {
        return context.whiteLabelConfig;
      }

      return await tenantResolverService.getDefaultConfig();
    },

    allWhiteLabelConfigs: async () => {
      return await tenantResolverService.getAllConfigs();
    },

    currentTenant: async (_: any, __: any, context: any) => {
      if (context && context.whiteLabelConfig) {
        return context.whiteLabelConfig;
      }
      return await tenantResolverService.getDefaultConfig();
    }
  },

  Mutation: {
    upsertWhiteLabelConfig: async (_: any, { input }: { input: any }) => {
      return await tenantResolverService.upsertConfig(input);
    },

    deleteWhiteLabelConfig: async (_: any, { id }: { id: string | number }) => {
      return await tenantResolverService.deleteConfig(id);
    }
  }
};

export default whitelabelResolvers;
