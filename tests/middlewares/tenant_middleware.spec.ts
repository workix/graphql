import { tenantMiddleware } from '../../src/middleware/tenant.middleware';
import { tenantResolverService } from '../../src/modules/whitelabel/services/tenant_resolver.service';

describe('tenantMiddleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve resolver o tenant com sucesso a partir dos headers e preencher context', async () => {
    const mockConfig: any = {
      id: 1,
      tenant_id: 'tenant-enterprise',
      slug: 'enterprise',
      brand_name: 'Enterprise Corp',
      theme_primary_color: '#0055ff'
    };

    jest.spyOn(tenantResolverService, 'resolveTenant').mockResolvedValue(mockConfig);

    const middleware = tenantMiddleware();
    const req: any = {
      headers: {
        host: 'enterprise.workix.com',
        'x-tenant-slug': 'enterprise',
        'x-tenant-id': 'org-123',
        'x-tenant-domain': 'enterprise.com'
      },
      query: {}
    };
    const res: any = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(tenantResolverService.resolveTenant).toHaveBeenCalledWith({
      host: 'enterprise.workix.com',
      tenantSlug: 'enterprise',
      tenantId: 'org-123',
      domain: 'enterprise.com'
    });
    expect(req.context.tenant).toBe('enterprise');
    expect(req.context.whiteLabelConfig).toEqual(mockConfig);
    expect(req.tenant).toEqual(mockConfig);
    expect(next).toHaveBeenCalled();
  });

  it('deve aplicar fallback para o tenant padrão em caso de erro na resolução', async () => {
    const fallbackConfig: any = {
      id: 0,
      tenant_id: 'default',
      slug: 'default',
      brand_name: 'Workix Default'
    };

    jest.spyOn(tenantResolverService, 'resolveTenant').mockRejectedValue(new Error('Tenant inválido'));
    jest.spyOn(tenantResolverService, 'getDefaultConfig').mockResolvedValue(fallbackConfig);

    const middleware = tenantMiddleware();
    const req: any = {
      headers: { host: 'unknown.domain.com' },
      query: {}
    };
    const res: any = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(tenantResolverService.getDefaultConfig).toHaveBeenCalled();
    expect(req.context.tenant).toBe('default');
    expect(req.context.whiteLabelConfig).toEqual(fallbackConfig);
    expect(req.tenant).toEqual(fallbackConfig);
    expect(next).toHaveBeenCalled();
  });
});
