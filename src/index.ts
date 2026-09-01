import 'dotenv/config'
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import resolvers from "./resolvers";
import typeDefs from "./schemas";


import "express-async-errors";
import db from './models/index';

import { DataLoaderFactory } from './dataloader';
import { RequestedFields } from './RequestedFields';
import { extractJWTMiddleware } from './middleware/extract_jwt'
import RabbitmqServer from './factory/rabbitmq_server';
import { createWebSocketSubscriptionServer } from './subscriptions';

import { getRuntimeMetrics } from './utils/metrics';

(async () => {
  
  const app = express();
  const requestedFields = new RequestedFields();
  const dataLoaderFactory = new DataLoaderFactory(db, requestedFields);
  const mqserver = new RabbitmqServer(process.env.RABBITMQ_SERVER_HOST || 'amqp://localhost');
  try {
    await mqserver.start();
    console.log('✅ Conectado ao RabbitMQ');
  } catch (err) {
    console.warn('⚠️ RabbitMQ não conectado (opcional para ambiente local)');
  }
  
  // Habilita CORS para todas as origens dos frontends (3000, 3001, 5173, etc.)
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  }));
  app.options('*', cors());

  app.use(express.json());
  
  
  const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
  });
  
  
  
  app.use("/graphql",
    extractJWTMiddleware(),
    (req, res, next) => {
      if (!req["context"]) {req["context"] = {}}
      req["context"]['orm'] = db;
      req["context"]['dataloaders'] = dataLoaderFactory.getLoaders();
      req["context"]['requestedFields'] = requestedFields;
      req["context"]['mqserver'] = mqserver;
      next();
    },
    graphqlHTTP(req => ({
      schema,
      graphiql: true,
      context: req['context']
    }))
  );
  
  app.get('/health/metrics', (req, res) => res.json(getRuntimeMetrics()));
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: Math.floor(process.uptime()) }));
  app.use('/', (req, res) => res.send({ msg: "Workix Graphql" }))
  
  app.use(
    (error, request, response, next) => {
      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      }
  
      return response.status(500).json(error);
    }
  );
  
  const port = process.env.PORT || 4000
  
  const server = app.listen(port, () => {
    console.log(`Server is running at Port ${port}`)
    console.log(`http://localhost:${port}/graphql`)
  });

  createWebSocketSubscriptionServer(server, schema);
})();