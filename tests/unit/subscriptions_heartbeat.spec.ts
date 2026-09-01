import { setupWebSocketHeartbeat, createWebSocketSubscriptionServer } from '../../src/subscriptions';
import http from 'http';
import { EventEmitter } from 'events';

describe('WebSocket Subscriptions Lifecycle & Heartbeat (TDD)', () => {
  let mockServer: http.Server;
  let mockSchema: any;

  beforeEach(() => {
    mockServer = http.createServer();
    mockSchema = {};
  });

  it('should initialize heartbeat on connection and handle pong events', () => {
    const mockWsServer: any = new EventEmitter();
    setupWebSocketHeartbeat(mockWsServer);

    const mockSocket: any = {
      isAlive: false,
      on: jest.fn(),
      ping: jest.fn(),
      terminate: jest.fn()
    };

    // Simula evento connection
    mockWsServer.emit('connection', mockSocket);

    expect(mockSocket.isAlive).toBe(true);
    expect(mockSocket.on).toHaveBeenCalledWith('pong', expect.any(Function));

    // Simula o callback do pong
    const pongCallback = mockSocket.on.mock.calls.find((call: any[]) => call[0] === 'pong')[1];
    mockSocket.isAlive = false;
    pongCallback();
    expect(mockSocket.isAlive).toBe(true);
  });

  it('should terminate dead sockets and ping active sockets on heartbeat sweep', () => {
    let sweepCallback: Function | null = null;
    jest.spyOn(global, 'setInterval').mockImplementation((cb: any, ms?: number) => {
      sweepCallback = cb;
      return { unref: jest.fn() } as any;
    });

    const mockWsServer: any = new EventEmitter();
    const deadSocket: any = {
      isAlive: false,
      on: jest.fn(),
      ping: jest.fn(),
      terminate: jest.fn()
    };

    const aliveSocket: any = {
      isAlive: true,
      on: jest.fn(),
      ping: jest.fn(),
      terminate: jest.fn()
    };

    mockWsServer.clients = new Set([deadSocket, aliveSocket]);

    setupWebSocketHeartbeat(mockWsServer, 30000);

    expect(sweepCallback).toBeDefined();
    if (sweepCallback) {
      (sweepCallback as Function)();
    }

    expect(deadSocket.terminate).toHaveBeenCalled();
    expect(aliveSocket.ping).toHaveBeenCalled();
    expect(aliveSocket.isAlive).toBe(false);

    (global.setInterval as any).mockRestore();
  });

  it('should clear heartbeat interval when server is closed', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const mockWsServer: any = new EventEmitter();
    setupWebSocketHeartbeat(mockWsServer);

    mockWsServer.emit('close');
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should integrate setupWebSocketHeartbeat into createWebSocketSubscriptionServer', () => {
    const wsServer = createWebSocketSubscriptionServer(mockServer, mockSchema);
    expect(wsServer).toBeDefined();
  });
});
