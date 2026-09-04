import whitelabelResolvers from '../../src/modules/whitelabel/graphql/whitelabel.resolvers';
import { tenantResolverService } from '../../src/modules/whitelabel/services/tenant_resolver.service';

describe('White Label GraphQL Resolvers Test Suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Query Resolvers', () => {
    it('should resolve whiteLabelConfig using arguments slug or domain', async () => {
      const mockResult = {
        id: 2,
        slug: 'techcorp',
        name: 'TechCorp Careers',
        primary_color: '#6366F1'
      };

      jest.spyOn(tenantResolverService, 'resolveTenant').mockResolvedValue(mockResult as any);

      const result = await whitelabelResolvers.Query.whiteLabelConfig(
        null,
        { slug: 'techcorp' },
        {}
      );

      expect(tenantResolverService.resolveTenant).toHaveBeenCalledWith({
        tenantSlug: 'techcorp',
        domain: undefined
      });
      expect(result.slug).toBe('techcorp');
    });

    it('should resolve whiteLabelConfig from GraphQL context if no args passed', async () => {
      const context = {
        whiteLabelConfig: {
          id: 1,
          slug: 'context-tenant',
          name: 'Context Tenant'
        }
      };

      const result = await whitelabelResolvers.Query.whiteLabelConfig(
        null,
        {},
        context
      );

      expect(result.slug).toBe('context-tenant');
    });

    it('should resolve default config when context has no tenant and no args passed', async () => {
      const defaultMock = {
        id: 1,
        slug: 'default',
        name: 'Workix Default'
      };

      jest.spyOn(tenantResolverService, 'getDefaultConfig').mockResolvedValue(defaultMock as any);

      const result = await whitelabelResolvers.Query.whiteLabelConfig(
        null,
        {},
        {}
      );

      expect(result.slug).toBe('default');
    });

    it('should query allWhiteLabelConfigs', async () => {
      const mockList = [
        { id: 1, slug: 'default', name: 'Workix Default' },
        { id: 2, slug: 'techcorp', name: 'TechCorp' }
      ];

      jest.spyOn(tenantResolverService, 'getAllConfigs').mockResolvedValue(mockList as any);

      const result = await whitelabelResolvers.Query.allWhiteLabelConfigs();
      expect(result.length).toBe(2);
      expect(result[1].slug).toBe('techcorp');
    });

    it('should query currentTenant from context or fallback', async () => {
      const resultFromContext = await whitelabelResolvers.Query.currentTenant(
        null,
        null,
        { whiteLabelConfig: { id: 3, slug: 'client3' } }
      );
      expect(resultFromContext.slug).toBe('client3');

      const defaultMock = { id: 1, slug: 'default' };
      jest.spyOn(tenantResolverService, 'getDefaultConfig').mockResolvedValue(defaultMock as any);

      const resultFromFallback = await whitelabelResolvers.Query.currentTenant(
        null,
        null,
        {}
      );
      expect(resultFromFallback.slug).toBe('default');
    });
  });

  describe('Mutation Resolvers', () => {
    it('should handle upsertWhiteLabelConfig mutation', async () => {
      const input = {
        slug: 'novotenant',
        name: 'Novo Tenant',
        primary_color: '#123456'
      };

      const mockSaved = {
        id: 99,
        ...input
      };

      jest.spyOn(tenantResolverService, 'upsertConfig').mockResolvedValue(mockSaved as any);

      const result = await whitelabelResolvers.Mutation.upsertWhiteLabelConfig(
        null,
        { input }
      );

      expect(tenantResolverService.upsertConfig).toHaveBeenCalledWith(input);
      expect(result.id).toBe(99);
      expect(result.slug).toBe('novotenant');
    });

    it('should handle deleteWhiteLabelConfig mutation', async () => {
      jest.spyOn(tenantResolverService, 'deleteConfig').mockResolvedValue(true);

      const result = await whitelabelResolvers.Mutation.deleteWhiteLabelConfig(
        null,
        { id: '2' }
      );

      expect(tenantResolverService.deleteConfig).toHaveBeenCalledWith('2');
      expect(result).toBe(true);
    });
  });

  describe('Type Resolvers', () => {
    it('should resolve css_variables field using tenantResolverService.buildCssVariables', () => {
      const parent = {
        slug: 'test',
        primary_color: '#112233',
        secondary_color: '#445566'
      };

      const css = whitelabelResolvers.WhiteLabelConfig.css_variables(parent);
      expect(css).toContain('--brand-primary: #112233;');
    });

    it('should resolve institutional_links parsing json string or returning object', () => {
      const objLinks = { about_url: 'https://test.com/about' };
      expect(whitelabelResolvers.WhiteLabelConfig.institutional_links({ institutional_links: objLinks })).toEqual(objLinks);

      const strLinks = JSON.stringify({ terms_url: 'https://test.com/terms' });
      expect(whitelabelResolvers.WhiteLabelConfig.institutional_links({ institutional_links: strLinks })).toEqual({
        terms_url: 'https://test.com/terms'
      });

      expect(whitelabelResolvers.WhiteLabelConfig.institutional_links({ institutional_links: null })).toBeNull();
      expect(whitelabelResolvers.WhiteLabelConfig.institutional_links({ institutional_links: 'invalid-json' })).toBeNull();
    });
  });
});
