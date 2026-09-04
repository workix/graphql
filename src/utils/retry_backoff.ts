export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
  jitter?: boolean;
  shouldRetry?: (error: any, attempt: number) => boolean;
}

/**
 * Executa uma função assíncrona com retentativas baseadas em Exponential Backoff e Jitter.
 */
export async function retryWithBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 100;
  const maxDelayMs = options.maxDelayMs ?? 5000;
  const factor = options.factor ?? 2;
  const useJitter = options.jitter ?? true;

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation(attempt);
    } catch (error: any) {
      lastError = error;

      if (attempt > maxRetries) {
        break;
      }

      if (options.shouldRetry && !options.shouldRetry(error, attempt)) {
        break;
      }

      // Calcula atraso exponencial: baseDelay * factor^(attempt - 1)
      let delay = baseDelayMs * Math.pow(factor, attempt - 1);
      delay = Math.min(delay, maxDelayMs);

      // Adiciona Jitter aleatório (entre 0% e 30% do delay) para evitar picos simultâneos
      if (useJitter) {
        const jitterValue = Math.random() * 0.3 * delay;
        delay = Math.round(delay + jitterValue);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
