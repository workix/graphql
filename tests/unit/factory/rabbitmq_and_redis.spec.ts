import RabbitmqServer from '../../../src/factory/rabbitmq_server';
import { redisClient, getRedis, setRedis } from '../../../src/factory/redis_server';

describe('RabbitmqServer & RedisServer Resilient Configuration (TDD)', () => {
  describe('RabbitmqServer with Prefetch Backpressure', () => {
    it('should set channel.prefetch with default count of 10 during consume', async () => {
      const server = new RabbitmqServer('amqp://localhost');
      
      const mockChannel = {
        prefetch: jest.fn().mockResolvedValue(true),
        consume: jest.fn().mockResolvedValue({ consumerTag: 'tag-1' }),
        ack: jest.fn()
      };
      server.channel = mockChannel as any;

      const callback = jest.fn();
      await server.consume('test-queue', callback);

      expect(mockChannel.prefetch).toHaveBeenCalledWith(10);
      expect(mockChannel.consume).toHaveBeenCalledWith('test-queue', expect.any(Function));
    });

    it('should allow custom prefetch count', async () => {
      const server = new RabbitmqServer('amqp://localhost');
      
      const mockChannel = {
        prefetch: jest.fn().mockResolvedValue(true),
        consume: jest.fn().mockResolvedValue({ consumerTag: 'tag-2' }),
        ack: jest.fn()
      };
      server.channel = mockChannel as any;

      await server.consume('high-volume-queue', jest.fn(), 50);

      expect(mockChannel.prefetch).toHaveBeenCalledWith(50);
    });
  });

  describe('RedisServer Security and Native Async Operations', () => {
    it('should not contain any hardcoded static password in connection options', () => {
      const redisModule = require('../../../src/factory/redis_server');
      const password = redisModule.connectionOptions?.password;
      expect(password).not.toBe('eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81');
    });

    it('should execute getRedis and setRedis returning native Promises', async () => {
      const mockGet = jest.spyOn(redisClient, 'get').mockResolvedValue('test-value' as never);
      const mockSet = jest.spyOn(redisClient, 'set').mockResolvedValue('OK' as never);
      const mockDel = jest.spyOn(redisClient, 'del').mockResolvedValue(1 as never);

      const setResult = await setRedis('test-key', 'test-value');
      expect(setResult).toBe('OK');
      expect(mockSet).toHaveBeenCalledWith('test-key', 'test-value');

      const getResult = await getRedis('test-key');
      expect(getResult).toBe('test-value');
      expect(mockGet).toHaveBeenCalledWith('test-key');

      await setRedis('test-key', null);
      expect(mockDel).toHaveBeenCalledWith('test-key');

      mockGet.mockRestore();
      mockSet.mockRestore();
      mockDel.mockRestore();
    });
  });
});
