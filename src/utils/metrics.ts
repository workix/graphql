import { monitorEventLoopDelay } from 'perf_hooks';

let histogram: any = null;
try {
  histogram = monitorEventLoopDelay({ resolution: 20 });
  histogram.enable();
} catch (e) {
  // Fallback silencioso se monitorEventLoopDelay não estiver disponível
}

export interface RuntimeMetrics {
  status: string;
  uptimeSeconds: number;
  timestamp: string;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
    externalMB: number;
    heapUsedBytes: number;
    heapTotalBytes: number;
    rssBytes: number;
  };
  cpu: {
    userMicros: number;
    systemMicros: number;
  };
  eventLoop: {
    lagMeanMs: number;
    lagMaxMs: number;
    lagP99Ms: number;
  };
}

export function getRuntimeMetrics(): RuntimeMetrics {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();
  const toMB = (bytes: number) => Math.round((bytes / 1024 / 1024) * 100) / 100;

  const lagMeanMs = histogram && histogram.mean ? Math.round((histogram.mean / 1e6) * 100) / 100 : 0;
  const lagMaxMs = histogram && histogram.max ? Math.round((histogram.max / 1e6) * 100) / 100 : 0;
  const lagP99Ms = histogram && typeof histogram.percentile === 'function' ? Math.round((histogram.percentile(99) / 1e6) * 100) / 100 : 0;

  return {
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    memory: {
      heapUsedMB: toMB(mem.heapUsed),
      heapTotalMB: toMB(mem.heapTotal),
      rssMB: toMB(mem.rss),
      externalMB: toMB(mem.external || 0),
      heapUsedBytes: mem.heapUsed,
      heapTotalBytes: mem.heapTotal,
      rssBytes: mem.rss
    },
    cpu: {
      userMicros: cpu.user,
      systemMicros: cpu.system
    },
    eventLoop: {
      lagMeanMs,
      lagMaxMs,
      lagP99Ms
    }
  };
}
