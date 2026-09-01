## Why

No arquivo `src/factory/rabbitmq_server.ts`, o consumo de filas assíncronas é realizado sem configuração de `prefetch` no canal do RabbitMQ. Sem esse limite, o broker envia todas as mensagens enfileiradas para a memória do processo Node.js simultaneamente, gerando alocação descontrolada e risco de colapso por Out-Of-Memory (OOM). Além disso, `src/factory/redis_server.ts` contém uma senha hardcoded no código (violando as regras de segurança do projeto) e utiliza wrappers `promisify` sobre métodos nativamente assíncronos do `ioredis`.

## What Changes

- Adição de configuração explícita de `prefetch(count)` no `RabbitmqServer` para garantir backpressure e limitar a quantidade de mensagens não confirmadas em trânsito no heap do processo.
- Remoção da senha estática em `src/factory/redis_server.ts`, passando a utilizar variáveis de ambiente com fallback seguro (`process.env.REDIS_PASSWORD`, `process.env.REDIS_HOST`, `process.env.REDIS_PORT`).
- Simplificação das operações assíncronas do Redis com uso direto de Promises nativas do `ioredis` em substituição ao `promisify`.

## Capabilities

### New Capabilities
- `performance-messaging-backpressure`: Controle de backpressure para filas de mensagens e conexão segura e assíncrona ao Redis.

### Modified Capabilities

## Impact

- `src/factory/rabbitmq_server.ts`: Suporte a parâmetro de prefetch em canais de consumo.
- `src/factory/redis_server.ts`: Remoção de credencial sensível no repositório e otimização de chamadas de leitura/escrita.
- Proteção contra OOM em cenários de acúmulo de mensagens nas filas.
