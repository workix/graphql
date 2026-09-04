export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogMetadata {
  traceId?: string;
  tenant?: string;
  userId?: string | number;
  operation?: string;
  durationMs?: number;
  statusCode?: number;
  context?: Record<string, any>;
  [key: string]: any;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  traceId?: string;
  tenant?: string;
  userId?: string | number;
  operation?: string;
  durationMs?: number;
  statusCode?: number;
  context?: Record<string, any>;
  error?: {
    name?: string;
    message?: string;
    code?: string;
    stack?: string;
  };
}

const LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

export class StructuredLogger {
  private static instance: StructuredLogger;
  private currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  private serviceName: string = 'workix-backend';

  public static getInstance(): StructuredLogger {
    if (!StructuredLogger.instance) {
      StructuredLogger.instance = new StructuredLogger();
    }
    return StructuredLogger.instance;
  }

  public setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  public getLevel(): LogLevel {
    return this.currentLevel;
  }

  public debug(message: string, meta: LogMetadata = {}): void {
    this.log('debug', message, meta);
  }

  public info(message: string, meta: LogMetadata = {}): void {
    this.log('info', message, meta);
  }

  public warn(message: string, meta: LogMetadata = {}): void {
    this.log('warn', message, meta);
  }

  public error(message: string, error?: any, meta: LogMetadata = {}): void {
    const errorDetails = error ? {
      name: error.name || 'Error',
      message: error.message || String(error),
      code: error.code || error.statusCode,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    } : undefined;

    this.log('error', message, meta, errorDetails);
  }

  public format(entry: StructuredLogEntry): string {
    return JSON.stringify(entry);
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITIES[level] >= LEVEL_PRIORITIES[this.currentLevel];
  }

  private log(level: LogLevel, message: string, meta: LogMetadata = {}, error?: any): void {
    if (!this.shouldLog(level)) return;

    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      ...(meta.traceId ? { traceId: meta.traceId } : {}),
      ...(meta.tenant ? { tenant: meta.tenant } : {}),
      ...(meta.userId ? { userId: meta.userId } : {}),
      ...(meta.operation ? { operation: meta.operation } : {}),
      ...(meta.durationMs !== undefined ? { durationMs: meta.durationMs } : {}),
      ...(meta.statusCode !== undefined ? { statusCode: meta.statusCode } : {}),
      ...(meta.context ? { context: meta.context } : {}),
      ...(error ? { error } : {})
    };

    const output = this.format(entry);

    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }
}

export const logger = StructuredLogger.getInstance();
