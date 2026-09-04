import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

export function generateTraceId(): string {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `trace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const traceMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rawTraceId =
      (req.headers['x-trace-id'] as string) ||
      (req.headers['x-correlation-id'] as string) ||
      (req.headers['x-request-id'] as string);

    const traceId = rawTraceId && rawTraceId.trim().length > 0 ? rawTraceId.trim() : generateTraceId();

    // Injeta na resposta HTTP
    res.setHeader('x-trace-id', traceId);

    // Injeta no request Express e no contexto GraphQL
    (req as any).traceId = traceId;
    if (!req['context']) {
      req['context'] = {};
    }
    req['context']['traceId'] = traceId;

    const startTime = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      const tenant = req['context']?.tenant || (req as any).tenant?.slug;
      const userId = req['context']?.user?.id;

      // Não loga poluição excessiva em health checks
      if (!req.path.startsWith('/health')) {
        logger.info(`${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${durationMs}ms)`, {
          traceId,
          tenant,
          userId,
          durationMs,
          statusCode: res.statusCode,
          operation: `${req.method} ${req.path}`
        });
      }
    });

    next();
  };
};
