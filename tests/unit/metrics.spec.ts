import { getRuntimeMetrics } from '../../src/utils/metrics';

describe('Runtime Metrics & Telemetry (TDD)', () => {
  it('should return valid runtime telemetry metrics payload', () => {
    const metrics = getRuntimeMetrics();

    expect(metrics).toBeDefined();
    expect(metrics.status).toBe('ok');
    expect(typeof metrics.uptimeSeconds).toBe('number');
    expect(metrics.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(Date.parse(metrics.timestamp)).not.toBeNaN();

    expect(metrics.memory).toBeDefined();
    expect(metrics.memory.heapUsedMB).toBeGreaterThan(0);
    expect(metrics.memory.heapTotalMB).toBeGreaterThan(0);
    expect(metrics.memory.rssMB).toBeGreaterThan(0);
    expect(typeof metrics.memory.heapUsedBytes).toBe('number');

    expect(metrics.cpu).toBeDefined();
    expect(typeof metrics.cpu.userMicros).toBe('number');
    expect(typeof metrics.cpu.systemMicros).toBe('number');

    expect(metrics.eventLoop).toBeDefined();
    expect(typeof metrics.eventLoop.lagMeanMs).toBe('number');
    expect(typeof metrics.eventLoop.lagMaxMs).toBe('number');
    expect(typeof metrics.eventLoop.lagP99Ms).toBe('number');
  });
});
