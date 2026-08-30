import pubsub, { NOTIFICATION_ADDED, CHAT_MESSAGE_ADDED } from '../../../src/subscriptions/pubsub';
import { authenticateWebSocketConnection, createWebSocketSubscriptionServer } from '../../../src/subscriptions/index';
import jwt from 'jsonwebtoken';
import http from 'http';

jest.mock('graphql-ws/dist/use/ws', () => ({
  useServer: jest.fn()
}));

jest.mock('ws', () => {
  return {
    WebSocketServer: jest.fn().mockImplementation(() => ({}))
  };
});

describe('Subscriptions & PubSub Unit Tests (TDD)', () => {
  const secret = 'test-secret';
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('should export pubsub instance and constants', () => {
    expect(pubsub).toBeDefined();
    expect(NOTIFICATION_ADDED).toBe('NOTIFICATION_ADDED');
    expect(CHAT_MESSAGE_ADDED).toBe('CHAT_MESSAGE_ADDED');
  });

  describe('authenticateWebSocketConnection', () => {
    it('should return unauthenticated when connectionParams is empty or missing authorization', () => {
      expect(authenticateWebSocketConnection(null)).toEqual({ authenticated: false, user: null });
      expect(authenticateWebSocketConnection({})).toEqual({ authenticated: false, user: null });
    });

    it('should return authenticated user for valid JWT token in authorization param', () => {
      const token = jwt.sign({ id: 1, email: 'user@test.com' }, secret);
      const res = authenticateWebSocketConnection({ authorization: `Bearer ${token}` });

      expect(res.authenticated).toBe(true);
      expect(res.user).toHaveProperty('id', 1);
    });

    it('should return authenticated user for valid JWT token in Authorization param', () => {
      const token = jwt.sign({ id: 2, email: 'user2@test.com' }, secret);
      const res = authenticateWebSocketConnection({ Authorization: `Bearer ${token}` });

      expect(res.authenticated).toBe(true);
      expect(res.user).toHaveProperty('id', 2);
    });

    it('should return authenticated user for valid JWT token without Bearer prefix', () => {
      const token = jwt.sign({ id: 3, email: 'user3@test.com' }, secret);
      const res = authenticateWebSocketConnection({ authorization: token });

      expect(res.authenticated).toBe(true);
      expect(res.user).toHaveProperty('id', 3);
    });

    it('should return unauthenticated for invalid JWT token', () => {
      const res = authenticateWebSocketConnection({ authorization: 'Bearer invalid-token' });
      expect(res.authenticated).toBe(false);
      expect(res.user).toBeNull();
    });
  });

  describe('createWebSocketSubscriptionServer', () => {
    it('should create WebSocketServer and invoke useServer with schema and hooks', () => {
      const mockServer = http.createServer();
      const mockSchema = {};
      const { useServer } = require('graphql-ws/dist/use/ws');

      const wsServer = createWebSocketSubscriptionServer(mockServer, mockSchema);
      expect(wsServer).toBeDefined();
      expect(useServer).toHaveBeenCalledWith(
        expect.objectContaining({
          schema: mockSchema
        }),
        wsServer
      );

      const useServerCallArgs = (useServer as jest.Mock).mock.calls[0][0];

      const token = jwt.sign({ id: 1 }, secret);
      const onConnectResValid = useServerCallArgs.onConnect({ connectionParams: { authorization: `Bearer ${token}` } });
      expect(onConnectResValid).toBe(true);

      const onConnectResInvalid = useServerCallArgs.onConnect({ connectionParams: {} });
      expect(onConnectResInvalid).toBe(false);

      expect(() => {
        useServerCallArgs.onSubscribe({ connectionParams: { authorization: `Bearer ${token}` } }, {});
      }).not.toThrow();

      expect(() => {
        useServerCallArgs.onSubscribe({ connectionParams: {} }, {});
      }).toThrow('Unauthorized connection');
    });
  });
});
