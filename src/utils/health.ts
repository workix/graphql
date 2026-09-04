import { Router, Request, Response } from 'express';
import { getRuntimeMetrics } from './metrics';

export interface HealthCheckDetail {
  status: 'up' | 'down' | 'degraded';
  latencyMs?: number;
  message?: string;
}

export interface ReadinessReport {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    database: HealthCheckDetail;
    rabbitmq: HealthCheckDetail;
    memory: HealthCheckDetail;
  };
}

export async function checkDatabaseHealth(dbInstance: any): Promise<HealthCheckDetail> {
  const start = Date.now();
  try {
    if (!dbInstance || !dbInstance.sequelize) {
      return { status: 'down', message: 'Instância Sequelize não configurada' };
    }
    await dbInstance.sequelize.authenticate();
    return {
      status: 'up',
      latencyMs: Date.now() - start
    };
  } catch (error: any) {
    return {
      status: 'down',
      latencyMs: Date.now() - start,
      message: error?.message || 'Falha ao autenticar com o banco de dados'
    };
  }
}

export function checkRabbitMQHealth(mqserver: any): HealthCheckDetail {
  if (!mqserver || !mqserver.conn) {
    return { status: 'degraded', message: 'RabbitMQ desconectado ou em modo mock' };
  }
  return { status: 'up' };
}

export function checkMemoryHealth(): HealthCheckDetail {
  const memory = process.memoryUsage();
  const heapUsedMb = Math.round(memory.heapUsed / 1024 / 1024);
  const heapTotalMb = Math.round(memory.heapTotal / 1024 / 1024);

  if (heapUsedMb > 1024) {
    return { status: 'degraded', message: `Alto consumo de heap: ${heapUsedMb}MB / ${heapTotalMb}MB` };
  }
  return { status: 'up', message: `${heapUsedMb}MB / ${heapTotalMb}MB` };
}

export async function getReadinessStatus(dbInstance: any, mqserver: any): Promise<ReadinessReport> {
  const dbHealth = await checkDatabaseHealth(dbInstance);
  const mqHealth = checkRabbitMQHealth(mqserver);
  const memHealth = checkMemoryHealth();

  const isHealthy = dbHealth.status === 'up';
  const isDegraded = isHealthy && (mqHealth.status !== 'up' || memHealth.status !== 'up');

  return {
    status: !isHealthy ? 'down' : isDegraded ? 'degraded' : 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      database: dbHealth,
      rabbitmq: mqHealth,
      memory: memHealth
    }
  };
}

export function createHealthRouter(dbInstance: any, mqserver: any): Router {
  const router = Router();

  // 1. Endpoint geral /health
  router.get('/', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'workix-backend',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime())
    });
  });

  // 2. Liveness probe (Kubernetes / ECS)
  router.get('/live', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString()
    });
  });

  // 3. Readiness probe (Kubernetes / ECS)
  router.get('/ready', async (req: Request, res: Response) => {
    const report = await getReadinessStatus(dbInstance, mqserver);
    const httpStatus = report.status === 'down' ? 503 : 200;
    res.status(httpStatus).json(report);
  });

  // 4. Métricas de runtime
  router.get('/metrics', (req: Request, res: Response) => {
    res.json(getRuntimeMetrics());
  });

  return router;
}
