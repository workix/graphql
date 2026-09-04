import {
  ConcurrencyLockService,
  ConcurrencyConflictError
} from '../../src/utils/concurrency_lock.service';

describe('ConcurrencyLockService Unit Tests', () => {
  let lockService: ConcurrencyLockService;

  beforeEach(() => {
    lockService = ConcurrencyLockService.getInstance();
    lockService.clear();
  });

  describe('Optimistic Versioning', () => {
    it('should verify matching versions without error', () => {
      expect(() => lockService.verifyVersion(3, 3)).not.toThrow();
    });

    it('should throw ConcurrencyConflictError when versions do not match', () => {
      expect(() => lockService.verifyVersion(4, 3)).toThrow(ConcurrencyConflictError);
    });

    it('should correctly increment version number', () => {
      expect(lockService.incrementVersion(0)).toBe(1);
      expect(lockService.incrementVersion(5)).toBe(6);
      expect(lockService.incrementVersion(undefined)).toBe(1);
    });
  });

  describe('Resource Locking', () => {
    it('should acquire and release lock on resource', () => {
      const key = 'job:100';
      expect(lockService.acquireLock(key, 1000)).toBe(true);
      expect(lockService.acquireLock(key, 1000)).toBe(false); // Já bloqueado

      lockService.releaseLock(key);
      expect(lockService.acquireLock(key, 1000)).toBe(true); // Liberado
    });

    it('should execute operation inside withLock and release lock automatically', async () => {
      const key = 'user:50';
      const result = await lockService.withLock(key, async () => {
        return 'DONE';
      });

      expect(result).toBe('DONE');
      // Lock deve ter sido liberado no bloco finally
      expect(lockService.acquireLock(key, 1000)).toBe(true);
    });

    it('should reject concurrent execution when resource is locked in withLock', async () => {
      const key = 'job:200';
      lockService.acquireLock(key, 2000);

      await expect(
        lockService.withLock(key, async () => 'SHOULD_NOT_RUN')
      ).rejects.toThrow(ConcurrencyConflictError);
    });
  });
});
