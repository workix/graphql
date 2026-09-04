import {
  checkDatabaseHealth,
  checkRabbitMQHealth,
  checkMemoryHealth,
  getReadinessStatus
} from '../../src/utils/health';
import {
  IdempotencyService,
  idempotencyMiddleware
} from '../../src/utils/idempotency.service';

describe('Health Checks & Idempotency Unit Tests', () => {
  let idempotency: IdempotencyService;

  beforeEach(() => {
    jest.restoreAllMocks();
    idempotency = IdempotencyService.getInstance();
    idempotency.clear();
  });

  describe('Health Checks', () => {
    it('should report database up when sequelize authenticate resolves', async () => {
      const mockDb = {
        sequelize: {
          authenticate: jest.fn().mockResolvedValue(true)
        }
      };

      const result = await checkDatabaseHealth(mockDb);
      expect(result.status).toBe('up');
      expect(result.latencyMs).toBeDefined();
    });

    it('should report database down when sequelize authenticate throws', async () => {
      const mockDb = {
        sequelize: {
          authenticate: jest.fn().mockRejectedValue(new Error('Connection refused'))
        }
      };

      const result = await checkDatabaseHealth(mockDb);
      expect(result.status).toBe('down');
      expect(result.message).toContain('Connection refused');
    });

    it('should check RabbitMQ and memory health correctly', () => {
      expect(checkRabbitMQHealth({ conn: {} }).status).toBe('up');
      expect(checkRabbitMQHealth(null).status).toBe('degraded');

      const mem = checkMemoryHealth();
      expect(mem.status).toBeDefined();
    });

    it('should build complete readiness status report', async () => {
      const mockDb = {
        sequelize: {
          authenticate: jest.fn().mockResolvedValue(true)
        }
      };

      const report = await getReadinessStatus(mockDb, { conn: {} });
      expect(report.status).toBe('ok');
      expect(report.checks.database.status).toBe('up');
      expect(report.checks.rabbitmq.status).toBe('up');
      expect(report.uptimeSeconds).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Idempotency Service & Middleware', () => {
    it('should lock and set idempotency record', () => {
      const key = 'idem-test-key-1';
      expect(idempotency.lock(key)).toBe(true);
      expect(idempotency.lock(key)).toBe(false); // Já bloqueado

      idempotency.set(key, { orderId: 123 }, 201);
      const record = idempotency.get(key);
      expect(record).toBeDefined();
      expect(record?.status).toBe('completed');
      expect(record?.body.orderId).toBe(123);
      expect(record?.statusCode).toBe(201);
    });

    it('should replay cached response on duplicate request with same key', () => {
      const key = 'idem-replay-key';
      idempotency.set(key, { success: true, transactionId: 'tx-99' }, 200);

      const req: any = {
        headers: { 'idempotency-key': key },
        method: 'POST',
        path: '/api/v1/checkout'
      };

      const res: any = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      const middleware = idempotencyMiddleware();
      middleware(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('x-idempotent-replay', 'true');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, transactionId: 'tx-99' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 409 conflict when request is currently processing', () => {
      const key = 'idem-concurrent-key';
      idempotency.lock(key);

      const req: any = {
        headers: { 'idempotency-key': key },
        method: 'POST',
        path: '/api/v1/checkout'
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      const middleware = idempotencyMiddleware();
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'CONCURRENT_REQUEST' })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
