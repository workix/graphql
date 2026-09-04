import { logger } from './logger';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions<T = any> {
  failureThreshold?: number;
  resetTimeoutMs?: number;
  halfOpenSuccessThreshold?: number;
  fallback?: (error: any, ...args: any[]) => Promise<T> | T;
  name?: string;
}

export class CircuitBreaker<T = any> {
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private nextAttemptTime: number = 0;

  private failureThreshold: number;
  private resetTimeoutMs: number;
  private halfOpenSuccessThreshold: number;
  private fallback?: (error: any, ...args: any[]) => Promise<T> | T;
  private name: string;

  constructor(options: CircuitBreakerOptions<T> = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeoutMs = options.resetTimeoutMs || 10000;
    this.halfOpenSuccessThreshold = options.halfOpenSuccessThreshold || 2;
    this.fallback = options.fallback;
    this.name = options.name || 'CircuitBreaker';
  }

  public getState(): CircuitState {
    this.evaluateState();
    return this.state;
  }

  public getMetrics() {
    return {
      name: this.name,
      state: this.getState(),
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime
    };
  }

  public async execute(action: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
    this.evaluateState();

    if (this.state === 'OPEN') {
      const openError = new Error(`[${this.name}] Circuito ABERTO. Chamada rejeitada preventivamente para proteger o sistema.`);
      if (this.fallback) {
        return await this.fallback(openError, ...args);
      }
      throw openError;
    }

    try {
      const result = await action(...args);
      this.onSuccess();
      return result;
    } catch (error: any) {
      this.onFailure(error);
      if (this.fallback) {
        return await this.fallback(error, ...args);
      }
      throw error;
    }
  }

  public trip(): void {
    this.state = 'OPEN';
    this.lastFailureTime = Date.now();
    this.nextAttemptTime = Date.now() + this.resetTimeoutMs;
  }

  public reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.nextAttemptTime = 0;
  }

  private evaluateState(): void {
    if (this.state === 'OPEN' && Date.now() >= this.nextAttemptTime) {
      this.state = 'HALF_OPEN';
      this.successCount = 0;
      logger.info(`[${this.name}] Circuito transitou para HALF_OPEN para testes de recuperação.`);
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.halfOpenSuccessThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
        logger.info(`[${this.name}] Circuito RECUPERADO e transitou para CLOSED.`);
      }
    } else if (this.state === 'CLOSED') {
      this.failureCount = 0;
    }
  }

  private onFailure(error: any): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.trip();
      logger.warn(`[${this.name}] Limite de falhas atingido (${this.failureCount}/${this.failureThreshold}). Circuito transitou para OPEN por ${this.resetTimeoutMs}ms.`, {
        error: error?.message
      });
    }
  }
}
