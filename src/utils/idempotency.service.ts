import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export interface IdempotencyRecord {
  key: string;
  status: 'processing' | 'completed';
  statusCode?: number;
  body?: any;
  createdAt: number;
  expiresAt: number;
}

export class IdempotencyService {
  private static instance: IdempotencyService;
  private cache: Map<string, IdempotencyRecord> = new Map();
  private ttlMs: number = 10 * 60 * 1000; // 10 minutos de retenção

  public static getInstance(): IdempotencyService {
    if (!IdempotencyService.instance) {
      IdempotencyService.instance = new IdempotencyService();
    }
    return IdempotencyService.instance;
  }

  public get(key: string): IdempotencyRecord | null {
    const record = this.cache.get(key);
    if (!record) return null;
    if (Date.now() > record.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return record;
  }

  public lock(key: string): boolean {
    const existing = this.get(key);
    if (existing) {
      return false;
    }
    this.cache.set(key, {
      key,
      status: 'processing',
      createdAt: Date.now(),
      expiresAt: Date.now() + this.ttlMs
    });
    return true;
  }

  public set(key: string, body: any, statusCode: number = 200): void {
    this.cache.set(key, {
      key,
      status: 'completed',
      statusCode,
      body,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.ttlMs
    });
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const idempotencyService = IdempotencyService.getInstance();

export const idempotencyMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rawKey = req.headers['idempotency-key'] as string;
    if (!rawKey || req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') {
      return next();
    }

    const idempotencyKey = rawKey.trim();
    const existing = idempotencyService.get(idempotencyKey);

    if (existing) {
      if (existing.status === 'processing') {
        return res.status(409).json({
          code: 'CONCURRENT_REQUEST',
          message: 'Uma operação com a mesma Idempotency-Key está sendo processada neste momento.',
          timestamp: new Date().toISOString()
        });
      }

      if (existing.status === 'completed') {
        res.setHeader('x-idempotent-replay', 'true');
        logger.info(`Replay de resposta idempotente para a chave: ${idempotencyKey}`, {
          traceId: (req as any).traceId,
          operation: `${req.method} ${req.path}`
        });
        return res.status(existing.statusCode || 200).json(existing.body);
      }
    }

    idempotencyService.lock(idempotencyKey);

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      idempotencyService.set(idempotencyKey, body, res.statusCode);
      return originalJson(body);
    };

    next();
  };
};
