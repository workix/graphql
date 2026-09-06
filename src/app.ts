import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import resolvers from './resolvers';
import typeDefs from './schemas';
import defaultDb from './models/index';
import { DataLoaderFactory } from './dataloader';
import { RequestedFields } from './RequestedFields';
import { extractJWTMiddleware } from './middleware/extract_jwt';
import { tenantMiddleware } from './middleware/tenant.middleware';
import { traceMiddleware } from './middleware/trace.middleware';
import { idempotencyMiddleware } from './utils/idempotency.service';
import { createHealthRouter } from './utils/health';
import { formatGraphQLError, expressErrorHandler } from './utils/error_formatter';
import { createMediaRouter } from './modules/media/media.router';

export interface AppOptions {
  db?: any;
  mqserver?: any;
  customSchema?: any;
}

export function createApp(options: AppOptions = {}): Express {
  const app = express();
  const db = options.db || defaultDb;
  const mqserver = options.mqserver || {
    publishInQueue: async () => true,
    publishInExchange: async () => true,
    start: async () => {}
  };

  const requestedFields = new RequestedFields();
  const dataLoaderFactory = new DataLoaderFactory(db, requestedFields);

  const schema = options.customSchema || makeExecutableSchema({
    resolvers,
    typeDefs
  });

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'x-tenant-id',
      'x-tenant-slug',
      'x-tenant-domain',
      'x-trace-id',
      'x-correlation-id',
      'x-file-name',
      'x-file-context',
      'idempotency-key'
    ],
    exposedHeaders: ['x-trace-id', 'x-idempotent-replay']
  }));
  app.options('*', cors());

  app.use(express.raw({
    type: ['image/*', 'application/pdf', 'application/octet-stream', 'multipart/form-data'],
    limit: '25mb'
  }));
  app.use(express.json());
  app.use(traceMiddleware());
  app.use(tenantMiddleware());
  app.use(idempotencyMiddleware());

  const uploadDir = path.join(process.cwd(), 'uploads', 'media');
  app.use('/uploads/media', express.static(uploadDir));

  app.use('/api/v1/media', createMediaRouter());

  app.use('/graphql',
    extractJWTMiddleware(),
    (req: any, _res, next) => {
      if (!req['context']) {
        req['context'] = {};
      }
      req['context']['orm'] = db;
      req['context']['dataloaders'] = dataLoaderFactory.getLoaders();
      req['context']['requestedFields'] = requestedFields;
      req['context']['mqserver'] = mqserver;
      next();
    },
    graphqlHTTP((req: any) => ({
      schema,
      graphiql: true,
      context: req['context'],
      customFormatErrorFn: (error: any) => formatGraphQLError(error, req['context'])
    }))
  );

  app.use('/health', createHealthRouter(db, mqserver));
  app.get('/', (_req, res) => res.send({ msg: 'Workix Graphql' }));

  app.use(expressErrorHandler());

  return app;
}

export default createApp;
