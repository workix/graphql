import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export interface StandardErrorPayload {
  code: string;
  message: string;
  timestamp: string;
  traceId?: string;
  details?: any;
}

export function classifyErrorCode(error: any): string {
  const msg = (error?.message || '').toLowerCase();
  const name = (error?.name || error?.originalError?.name || '').toLowerCase();

  if (msg.includes('unauthorized') || msg.includes('jwt') || msg.includes('unauthenticated') || name.includes('unauthorized')) {
    return 'UNAUTHENTICATED';
  }
  if (msg.includes('forbidden') || msg.includes('permission') || msg.includes('denied') || msg.includes('access')) {
    return 'FORBIDDEN';
  }
  if (msg.includes('not found') || msg.includes('nao encontrado') || msg.includes('não encontrado')) {
    return 'NOT_FOUND';
  }
  if (msg.includes('validation') || msg.includes('invalid') || msg.includes('required') || name.includes('sequelizevalidationerror')) {
    return 'BAD_USER_INPUT';
  }
  if (msg.includes('idempotent') || msg.includes('duplicate') || name.includes('sequelizetypeerror')) {
    return 'CONFLICT';
  }
  return 'INTERNAL_SERVER_ERROR';
}

/**
 * Formatador unificado de erros para o Apollo Server / express-graphql.
 */
export function formatGraphQLError(error: any, context?: any): any {
  const originalError = error.originalError || error;
  const traceId = context?.traceId || (error as any).traceId;
  const code = error.extensions?.code || classifyErrorCode(originalError);
  const isProduction = process.env.NODE_ENV === 'production';

  // Registra log estruturado de erro
  logger.error(`GraphQL Error: ${error.message}`, originalError, {
    traceId,
    operation: error.path ? error.path.join('.') : undefined,
    context: { code, locations: error.locations }
  });

  const sanitizedMessage =
    isProduction && code === 'INTERNAL_SERVER_ERROR'
      ? 'Ocorreu um erro interno ao processar sua requisição. Por favor, tente novamente mais tarde.'
      : error.message;

  return {
    message: sanitizedMessage,
    locations: error.locations,
    path: error.path,
    extensions: {
      code,
      timestamp: new Date().toISOString(),
      traceId,
      ...(isProduction ? {} : { originalMessage: originalError?.message })
    }
  };
}

/**
 * Middleware Express para captura e padronização de erros HTTP.
 */
export function expressErrorHandler() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    const traceId = (req as any).traceId || (req.headers['x-trace-id'] as string);
    const code = classifyErrorCode(err);
    const isProduction = process.env.NODE_ENV === 'production';

    logger.error(`Express Error: ${err.message}`, err, {
      traceId,
      statusCode: err.statusCode || (code === 'BAD_USER_INPUT' ? 400 : 500),
      operation: `${req.method} ${req.path}`
    });

    const statusCode = err.statusCode || (code === 'BAD_USER_INPUT' ? 400 : code === 'UNAUTHENTICATED' ? 401 : code === 'FORBIDDEN' ? 403 : code === 'NOT_FOUND' ? 404 : 500);

    const payload: StandardErrorPayload = {
      code,
      message: isProduction && statusCode === 500
        ? 'Ocorreu um erro interno no servidor.'
        : err.message || 'Erro inesperado.',
      timestamp: new Date().toISOString(),
      traceId
    };

    res.status(statusCode).json(payload);
  };
}
