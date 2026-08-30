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

export const createWebSocketSubscriptionServer = (server: any, schema: any): WebSocketServer => {
  const wsServer = new WebSocketServer({
    server,
    path: '/graphql'
  });

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
