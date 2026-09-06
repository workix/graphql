import 'dotenv/config';
import createApp from './app';
import db from './models/index';
import RabbitmqServer from './factory/rabbitmq_server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers';
import typeDefs from './schemas';
import { createWebSocketSubscriptionServer } from './subscriptions';

(async () => {
  const mqserver = new RabbitmqServer(process.env.RABBITMQ_SERVER_HOST || 'amqp://localhost');
  try {
    await mqserver.start();
    console.log('✅ Conectado ao RabbitMQ');
  } catch (err) {
    console.warn('⚠️ RabbitMQ não conectado (opcional para ambiente local)');
  }

  const schema = makeExecutableSchema({
    resolvers,
    typeDefs
  });

  const app = createApp({ db, mqserver, customSchema: schema });
  const port = process.env.PORT || 4000;

  const server = app.listen(port, () => {
    console.log(`Server is running at Port ${port}`);
    console.log(`http://localhost:${port}/graphql`);
  });

  createWebSocketSubscriptionServer(server, schema);
})();