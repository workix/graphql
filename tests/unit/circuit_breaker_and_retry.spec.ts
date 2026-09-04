import { CircuitBreaker } from '../../src/utils/circuit_breaker';
import { retryWithBackoff } from '../../src/utils/retry_backoff';

describe('CircuitBreaker & Retry Backoff Unit Tests', () => {
  describe('CircuitBreaker', () => {
    it('should execute successfully in CLOSED state', async () => {
      const breaker = new CircuitBreaker<string>({
        failureThreshold: 3,
        resetTimeoutMs: 50
      });

      const result = await breaker.execute(async () => 'OK_SUCCESS');
      expect(result).toBe('OK_SUCCESS');
      expect(breaker.getState()).toBe('CLOSED');
    });

    it('should trip to OPEN state after hitting failure threshold and execute fallback', async () => {
      const fallbackMock = jest.fn().mockReturnValue('FALLBACK_RESPONSE');
      const breaker = new CircuitBreaker<string>({
        failureThreshold: 2,
        resetTimeoutMs: 50,
        fallback: fallbackMock
      });

      // 1ª falha
      await breaker.execute(async () => { throw new Error('Falha 1'); });
      expect(breaker.getState()).toBe('CLOSED');

      // 2ª falha -> Abre o circuito
      await breaker.execute(async () => { throw new Error('Falha 2'); });
      expect(breaker.getState()).toBe('OPEN');

      // 3ª chamada -> Rejeitada preventivamente sem executar a ação
      const actionMock = jest.fn();
      const result = await breaker.execute(actionMock);

      expect(actionMock).not.toHaveBeenCalled();
      expect(result).toBe('FALLBACK_RESPONSE');
      expect(fallbackMock).toHaveBeenCalled();
    });

    it('should recover from OPEN to HALF_OPEN and then to CLOSED', async () => {
      const breaker = new CircuitBreaker<string>({
        failureThreshold: 1,
        resetTimeoutMs: 20,
        halfOpenSuccessThreshold: 2
      });

      // Força abertura
      breaker.trip();
      expect(breaker.getState()).toBe('OPEN');

      // Aguarda expirar resetTimeoutMs
      await new Promise(r => setTimeout(r, 25));
      expect(breaker.getState()).toBe('HALF_OPEN');

      // 1º sucesso em HALF_OPEN
      await breaker.execute(async () => 'HALF_1');
      expect(breaker.getState()).toBe('HALF_OPEN');

      // 2º sucesso em HALF_OPEN -> Transita de volta para CLOSED
      await breaker.execute(async () => 'HALF_2');
      expect(breaker.getState()).toBe('CLOSED');
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first try without retries', async () => {
      const operation = jest.fn().mockResolvedValue('SUCCESS');
      const result = await retryWithBackoff(operation, { maxRetries: 3 });

      expect(result).toBe('SUCCESS');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed on second attempt', async () => {
      let attemptCount = 0;
      const operation = jest.fn().mockImplementation(async () => {
        attemptCount++;
        if (attemptCount === 1) {
          throw new Error('Erro transitório');
        }
        return 'RECOVERED';
      });

      const result = await retryWithBackoff(operation, {
        maxRetries: 2,
        baseDelayMs: 10,
        jitter: false
      });

      expect(result).toBe('RECOVERED');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should throw last error when all retries are exhausted', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Falha permanente'));

      await expect(
        retryWithBackoff(operation, {
          maxRetries: 2,
          baseDelayMs: 5,
          jitter: false
        })
      ).rejects.toThrow('Falha permanente');

      expect(operation).toHaveBeenCalledTimes(3); // 1 inicial + 2 retries
    });
  });
});
