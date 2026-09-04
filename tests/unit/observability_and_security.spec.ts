import { StructuredLogger } from '../../src/utils/logger';
import { traceMiddleware, generateTraceId } from '../../src/middleware/trace.middleware';
import { formatGraphQLError, classifyErrorCode, expressErrorHandler } from '../../src/utils/error_formatter';

describe('Observability & Security Unit Tests', () => {
  let logger: StructuredLogger;

  beforeEach(() => {
    jest.restoreAllMocks();
    logger = StructuredLogger.getInstance();
  });

  describe('StructuredLogger', () => {
    it('should format structured log entries into valid JSON strings', () => {
      const entry = {
        timestamp: '2026-09-04T12:00:00.000Z',
        level: 'info' as const,
        service: 'workix-backend',
        message: 'Operação concluída',
        traceId: 'test-trace-123',
        tenant: 'techcorp',
        durationMs: 45
      };

      const formatted = logger.format(entry);
      expect(typeof formatted).toBe('string');
      const parsed = JSON.parse(formatted);
      expect(parsed.message).toBe('Operação concluída');
      expect(parsed.traceId).toBe('test-trace-123');
      expect(parsed.durationMs).toBe(45);
    });

    it('should log info, warn, and error without throwing exceptions', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      logger.setLevel('debug');
      logger.debug('Mensagem debug', { traceId: 'dbg-1' });
      logger.info('Mensagem info', { traceId: 'inf-1' });
      logger.warn('Mensagem warn', { traceId: 'wrn-1' });
      logger.error('Mensagem erro', new Error('Falha teste'), { traceId: 'err-1' });

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Trace Middleware', () => {
    it('should generate valid trace id', () => {
      const traceId = generateTraceId();
      expect(traceId).toBeDefined();
      expect(typeof traceId).toBe('string');
      expect(traceId.length).toBeGreaterThan(5);
    });

    it('should preserve x-trace-id from request header and set on response', () => {
      const req: any = {
        headers: {
          'x-trace-id': 'custom-client-trace-id-999'
        },
        path: '/graphql',
        method: 'POST'
      };

      const res: any = {
        setHeader: jest.fn(),
        on: jest.fn()
      };

      const next = jest.fn();

      const middleware = traceMiddleware();
      middleware(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('x-trace-id', 'custom-client-trace-id-999');
      expect(req.traceId).toBe('custom-client-trace-id-999');
      expect(req.context.traceId).toBe('custom-client-trace-id-999');
      expect(next).toHaveBeenCalled();
    });

    it('should auto-generate trace id when header is missing', () => {
      const req: any = {
        headers: {},
        path: '/graphql',
        method: 'POST'
      };

      const res: any = {
        setHeader: jest.fn(),
        on: jest.fn()
      };

      const next = jest.fn();

      const middleware = traceMiddleware();
      middleware(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('x-trace-id', expect.any(String));
      expect(req.traceId).toBeDefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Error Formatter', () => {
    it('should classify error codes accurately', () => {
      expect(classifyErrorCode(new Error('Unauthorized access token'))).toBe('UNAUTHENTICATED');
      expect(classifyErrorCode(new Error('Permission denied for resource'))).toBe('FORBIDDEN');
      expect(classifyErrorCode(new Error('User not found'))).toBe('NOT_FOUND');
      expect(classifyErrorCode(new Error('Validation error: email is invalid'))).toBe('BAD_USER_INPUT');
      expect(classifyErrorCode(new Error('Idempotent key duplicate'))).toBe('CONFLICT');
      expect(classifyErrorCode(new Error('Database timeout error'))).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should format GraphQL errors with traceId and semantic codes', () => {
      const gqlError: any = {
        message: 'Registro não encontrado',
        path: ['user'],
        locations: [{ line: 2, column: 3 }]
      };

      const formatted = formatGraphQLError(gqlError, { traceId: 'trace-gql-777' });
      expect(formatted.message).toBe('Registro não encontrado');
      expect(formatted.extensions.code).toBe('NOT_FOUND');
      expect(formatted.extensions.traceId).toBe('trace-gql-777');
      expect(formatted.extensions.timestamp).toBeDefined();
    });

    it('should format Express errors in standard JSON contract', () => {
      const err: any = new Error('Email is invalid');
      err.statusCode = 400;

      const req: any = {
        traceId: 'trace-exp-123',
        method: 'POST',
        path: '/api/v1/users',
        headers: {}
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      const handler = expressErrorHandler();
      handler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'BAD_USER_INPUT',
          message: 'Email is invalid',
          traceId: 'trace-exp-123',
          timestamp: expect.any(String)
        })
      );
    });
  });
});
