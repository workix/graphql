import { Request, Response, NextFunction } from 'express';
import { tenantResolverService } from '../modules/whitelabel/services/tenant_resolver.service';

export const tenantMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req['context']) {
        req['context'] = {};
      }

      const host = req.headers['host'] as string;
      const tenantSlug = (req.headers['x-tenant-slug'] || req.query['tenant'] || req.query['tenant_slug']) as string;
      const tenantId = (req.headers['x-tenant-id'] || req.query['tenant_id']) as string;
      const customDomain = req.headers['x-tenant-domain'] as string;

      const whiteLabelConfig = await tenantResolverService.resolveTenant({
        host,
        tenantSlug,
        tenantId,
        domain: customDomain
      });

      req['context']['tenant'] = whiteLabelConfig.slug;
      req['context']['whiteLabelConfig'] = whiteLabelConfig;
      (req as any).tenant = whiteLabelConfig;

      next();
    } catch (error) {
      // Em caso de erro na resolução, continua com fallback padrão
      const fallbackConfig = await tenantResolverService.getDefaultConfig();
      req['context']['tenant'] = fallbackConfig.slug;
      req['context']['whiteLabelConfig'] = fallbackConfig;
      (req as any).tenant = fallbackConfig;
      next();
    }
  };
};
