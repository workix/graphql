import { TenantResolverService, DEFAULT_WHITE_LABEL_CONFIG } from '../../src/modules/whitelabel/services/tenant_resolver.service';
import { applyWhiteLabelTheme, toMobileTheme } from '../../src/modules/whitelabel/client/theme_injector';
import { WhiteLabelConfig } from '../../src/models';

describe('TenantResolverService & Theme Injector Tests', () => {
  let service: TenantResolverService;

  beforeEach(() => {
    jest.restoreAllMocks();
    service = TenantResolverService.getInstance();
    service.clearCache();
  });

  describe('Tenant Resolution & Fallback', () => {
    it('should resolve default config when no criteria is provided', async () => {
      jest.spyOn(WhiteLabelConfig, 'findOne').mockResolvedValue(null as any);

      const resolved = await service.resolveTenant({});
      expect(resolved).toBeDefined();
      expect(resolved.slug).toBe('default');
      expect(resolved.name).toBe('Workix Default');
      expect(resolved.primary_color).toBe('#0A66C2');
    });

    it('should resolve tenant by slug when slug exists in database', async () => {
      const mockRecord = {
        id: 2,
        slug: 'techcorp',
        name: 'TechCorp Careers',
        custom_domain: 'careers.techcorp.io',
        primary_color: '#6366F1',
        secondary_color: '#4F46E5',
        accent_color: '#A5B4FC',
        background_color: '#0F172A',
        text_color: '#F8FAFC',
        font_family: 'Roboto, sans-serif',
        app_title: 'TechCorp - Portal Oficial de Carreiras',
        institutional_links: JSON.stringify({ about_url: 'https://techcorp.io/about' }),
        is_active: true,
        toJSON: () => ({
          id: 2,
          slug: 'techcorp',
          name: 'TechCorp Careers',
          custom_domain: 'careers.techcorp.io',
          primary_color: '#6366F1',
          secondary_color: '#4F46E5',
          accent_color: '#A5B4FC',
          background_color: '#0F172A',
          text_color: '#F8FAFC',
          font_family: 'Roboto, sans-serif',
          app_title: 'TechCorp - Portal Oficial de Carreiras',
          institutional_links: { about_url: 'https://techcorp.io/about' },
          is_active: true
        })
      };

      jest.spyOn(WhiteLabelConfig, 'findOne').mockResolvedValue(mockRecord as any);

      const resolved = await service.resolveTenant({ tenantSlug: 'techcorp' });
      expect(resolved).toBeDefined();
      expect(resolved.slug).toBe('techcorp');
      expect(resolved.primary_color).toBe('#6366F1');
      expect(resolved.app_title).toBe('TechCorp - Portal Oficial de Carreiras');
    });

    it('should resolve tenant by host domain (e.g. Host header)', async () => {
      const mockRecord = {
        id: 3,
        slug: 'acme',
        name: 'Acme Jobs',
        custom_domain: 'vagas.acme.com',
        primary_color: '#E11D48',
        is_active: true,
        toJSON: () => ({
          id: 3,
          slug: 'acme',
          name: 'Acme Jobs',
          custom_domain: 'vagas.acme.com',
          primary_color: '#E11D48',
          is_active: true
        })
      };

      jest.spyOn(WhiteLabelConfig, 'findOne').mockResolvedValue(mockRecord as any);

      const resolved = await service.resolveTenant({ host: 'vagas.acme.com:4000' });
      expect(resolved).toBeDefined();
      expect(resolved.slug).toBe('acme');
      expect(resolved.primary_color).toBe('#E11D48');
    });

    it('should ignore localhost and 127.0.0.1 host and fallback to default', async () => {
      jest.spyOn(WhiteLabelConfig, 'findOne').mockResolvedValue(null as any);

      const resolved = await service.resolveTenant({ host: 'localhost:3000' });
      expect(resolved.slug).toBe('default');
    });

    it('should resolve tenant by ID when tenantId is provided', async () => {
      const mockRecord = {
        id: 5,
        slug: 'globex',
        name: 'Globex Corp',
        primary_color: '#10B981',
        is_active: true,
        toJSON: () => ({
          id: 5,
          slug: 'globex',
          name: 'Globex Corp',
          primary_color: '#10B981',
          is_active: true
        })
      };

      jest.spyOn(WhiteLabelConfig, 'findByPk').mockResolvedValue(mockRecord as any);

      const resolved = await service.resolveTenant({ tenantId: 5 });
      expect(resolved.slug).toBe('globex');
      expect(resolved.primary_color).toBe('#10B981');
    });
  });

  describe('CRUD Operations & Safeguards', () => {
    it('should upsert new config and format fields cleanly', async () => {
      const mockCreated = {
        id: 10,
        slug: 'novocliente',
        name: 'Novo Cliente',
        custom_domain: 'carreiras.novocliente.com',
        primary_color: '#8B5CF6',
        is_active: true,
        toJSON: () => ({
          id: 10,
          slug: 'novocliente',
          name: 'Novo Cliente',
          custom_domain: 'carreiras.novocliente.com',
          primary_color: '#8B5CF6',
          is_active: true
        })
      };

      jest.spyOn(WhiteLabelConfig, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(WhiteLabelConfig, 'create').mockResolvedValue(mockCreated as any);

      const result = await service.upsertConfig({
        slug: 'NovoCliente ',
        name: 'Novo Cliente',
        custom_domain: 'Carreiras.novocliente.com '
      });

      expect(result.slug).toBe('novocliente');
      expect(result.custom_domain).toBe('carreiras.novocliente.com');
    });

    it('should prevent deleting the default tenant', async () => {
      jest.spyOn(WhiteLabelConfig, 'findByPk').mockResolvedValue({
        id: 1,
        slug: 'default',
        destroy: jest.fn()
      } as any);

      await expect(service.deleteConfig(1)).rejects.toThrow(
        'Não é permitido remover a configuração padrão (default).'
      );
    });

    it('should successfully delete non-default tenant and clear cache', async () => {
      const destroyMock = jest.fn().mockResolvedValue(true);
      jest.spyOn(WhiteLabelConfig, 'findByPk').mockResolvedValue({
        id: 2,
        slug: 'techcorp',
        destroy: destroyMock
      } as any);

      const result = await service.deleteConfig(2);
      expect(result).toBe(true);
      expect(destroyMock).toHaveBeenCalled();
    });
  });

  describe('CSS Variables and Theme Injector', () => {
    it('should build valid CSS variables block from configuration', () => {
      const css = service.buildCssVariables({
        slug: 'custom',
        name: 'Custom',
        primary_color: '#FF0000',
        secondary_color: '#990000',
        accent_color: '#FFCCCC',
        background_color: '#FFFFFF',
        text_color: '#000000',
        font_family: 'Arial'
      });

      expect(css).toContain('--brand-primary: #FF0000;');
      expect(css).toContain('--brand-secondary: #990000;');
      expect(css).toContain('--brand-accent: #FFCCCC;');
      expect(css).toContain('--brand-font: Arial;');
    });

    it('should convert WhiteLabelConfig into MobileThemeTokens', () => {
      const tokens = toMobileTheme({
        id: 1,
        slug: 'default',
        name: 'Workix',
        primary_color: '#0A66C2',
        secondary_color: '#004182',
        accent_color: '#70B5F9',
        background_color: '#F3F2EF',
        text_color: '#191919',
        font_family: 'Inter',
        app_title: 'Workix App',
        is_active: true
      });

      expect(tokens.colorPrimary).toBe('#0A66C2');
      expect(tokens.colorPrimaryDark).toBe('#004182');
      expect(tokens.appName).toBe('Workix App');
    });

    it('should execute applyWhiteLabelTheme safely without DOM in test/SSR environment', () => {
      expect(() => {
        applyWhiteLabelTheme({
          id: 1,
          slug: 'default',
          name: 'Workix',
          primary_color: '#0A66C2',
          secondary_color: '#004182',
          accent_color: '#70B5F9',
          background_color: '#F3F2EF',
          text_color: '#191919',
          font_family: 'Inter',
          app_title: 'Workix Portal',
          is_active: true
        });
      }).not.toThrow();
    });
  });
});
