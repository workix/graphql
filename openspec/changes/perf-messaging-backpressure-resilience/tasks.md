## 1. Backpressure no RabbitmqServer

- [ ] 1.1 Atualizar `src/factory/rabbitmq_server.ts` para suportar `channel.prefetch(prefetchCount)` no método `consume`
- [ ] 1.2 Ajustar os workers em `src/workers/notification_consumer.ts` e `src/workers/search_indexer_worker.ts`

## 2. Refatoração e Segurança do RedisServer

- [ ] 2.1 Remover credencial hardcoded de `src/factory/redis_server.ts` e configurar leitura segura de variáveis de ambiente
- [ ] 2.2 Refatorar funções `getRedis` e `setRedis` para invocar métodos assíncronos nativos do `ioredis` sem `promisify`
- [ ] 2.3 Criar testes unitários para o cliente Redis e para o consumidor de mensagens
