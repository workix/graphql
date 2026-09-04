export class ConcurrencyConflictError extends Error {
  public code = 'CONCURRENCY_CONFLICT';
  public statusCode = 409;

  constructor(message: string = 'Conflito de concorrência detectado. O registro foi modificado por outra operação.') {
    super(message);
    this.name = 'ConcurrencyConflictError';
  }
}

export class ConcurrencyLockService {
  private static instance: ConcurrencyLockService;
  private locks: Map<string, number> = new Map();

  public static getInstance(): ConcurrencyLockService {
    if (!ConcurrencyLockService.instance) {
      ConcurrencyLockService.instance = new ConcurrencyLockService();
    }
    return ConcurrencyLockService.instance;
  }

  /**
   * Valida a versão esperada contra a versão atual (Optimistic Locking).
   */
  public verifyVersion(currentVersion: number, expectedVersion: number): void {
    if (currentVersion !== expectedVersion) {
      throw new ConcurrencyConflictError(
        `Conflito de versão detectado. Versão atual no banco: ${currentVersion}, Versão fornecida: ${expectedVersion}.`
      );
    }
  }

  /**
   * Incrementa o contador de versão de uma entidade.
   */
  public incrementVersion(currentVersion?: number): number {
    return (currentVersion || 0) + 1;
  }

  /**
   * Tenta adquirir um lock em memória para uma chave de recurso com tempo de expiração.
   */
  public acquireLock(resourceKey: string, lockTtlMs: number = 5000): boolean {
    const now = Date.now();
    const existingExpiresAt = this.locks.get(resourceKey);

    if (existingExpiresAt && now < existingExpiresAt) {
      return false; // Bloqueio ativo
    }

    this.locks.set(resourceKey, now + lockTtlMs);
    return true;
  }

  /**
   * Libera o lock de um recurso.
   */
  public releaseLock(resourceKey: string): void {
    this.locks.delete(resourceKey);
  }

  /**
   * Executa uma operação assíncrona protegida por lock exclusivo.
   */
  public async withLock<T>(
    resourceKey: string,
    operation: () => Promise<T>,
    lockTtlMs: number = 5000
  ): Promise<T> {
    const acquired = this.acquireLock(resourceKey, lockTtlMs);
    if (!acquired) {
      throw new ConcurrencyConflictError(
        `O recurso [${resourceKey}] está sendo modificado por outra operação concorrente neste momento.`
      );
    }

    try {
      return await operation();
    } finally {
      this.releaseLock(resourceKey);
    }
  }

  public clear(): void {
    this.locks.clear();
  }
}

export const concurrencyLockService = ConcurrencyLockService.getInstance();
