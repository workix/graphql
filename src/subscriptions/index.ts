import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

export const authenticateWebSocketConnection = (connectionParams: any): any => {
  if (!connectionParams || (!connectionParams.authorization && !connectionParams.Authorization)) {
    return { authenticated: false, user: null };
  }

  const tokenHeader = connectionParams.authorization || connectionParams.Authorization;
  const token = tokenHeader.replace(/^Bearer\s+/, '');

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);
    return { authenticated: true, user: decoded };
  } catch (err) {
    return { authenticated: false, user: null };
  }
};

export const setupWebSocketHeartbeat = (wsServer: any, intervalMs: number = 30000) => {
  wsServer.on('connection', (ws: any) => {
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  });

  const heartbeatInterval = setInterval(() => {
    if (!wsServer.clients) return;
    wsServer.clients.forEach((ws: any) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      if (typeof ws.ping === 'function') {
        ws.ping();
      }
    });
  }, intervalMs);

  if (heartbeatInterval.unref) {
    heartbeatInterval.unref();
  }

  wsServer.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  return heartbeatInterval;
};

export const createWebSocketSubscriptionServer = (server: any, schema: any): WebSocketServer => {
  const wsServer = new WebSocketServer({
    server,
    path: '/graphql'
  });

  setupWebSocketHeartbeat(wsServer);

  useServer(
    {
      schema,
      onConnect: (ctx) => {
        const auth = authenticateWebSocketConnection(ctx.connectionParams);
        if (!auth.authenticated) {
          return false;
        }
        return true;
      },
      onSubscribe: (ctx, message) => {
        const auth = authenticateWebSocketConnection(ctx.connectionParams);
        if (!auth.authenticated) {
          throw new Error('Unauthorized connection');
        }
      }
    },
    wsServer
  );

  return wsServer;
};
