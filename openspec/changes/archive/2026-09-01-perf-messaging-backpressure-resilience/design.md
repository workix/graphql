## Context

Conforme estabelecido nas Fases 6, 18 e 25-B.12 do diagnóstico, a recepção desgovernada de mensagens de filas RabbitMQ sem backpressure (`prefetch`) é uma das principais causas de colapso de heap no ecossistema Node.js. Em paralelo, a presença de uma senha estática no código em `src/factory/redis_server.ts` viola o princípio de segurança e o arquivo `CLAUDE.md`.

## Goals / Non-Goals

**Goals:**
- Adicionar o método ou parâmetro `prefetch` ao iniciar o canal em `RabbitmqServer.consume(queue, callback, prefetchCount = 10)`.
- Sanitizar `src/factory/redis_server.ts` para ler configurações de ambiente (`process.env`).
- Substituir chamadas obsoletas `promisify(redisClient.get)` por chamadas assíncronas nativas `redisClient.get(key)`.

**Non-Goals:**
- Não substituir o broker RabbitMQ ou a biblioteca `ioredis`.
- Não alterar a estrutura de eventos e tópicos trafegados.

## Decisions

- **Decisão 1: Prefetch Padrão de 10 Mensagens**:
  - *Opção escolhida*: `prefetchCount = 10` como padrão seguro para consumo balanceado sem overhead excessivo de rede.
  - *Alternativa descartada*: Manter prefetch infinito/ilimitado.
- **Decisão 2: Eliminação de `promisify`**:
  - *Opção escolhida*: Uso direto das Promises do `ioredis`.
  - *Alternativa descartada*: Manter `util.promisify` alocando wrappers adicionais a cada chamada.

## Risks / Trade-offs

- [Risco] Worker processando mais lentamente lotes massivos se o prefetch for muito pequeno → [Mitigação] Permitir parametrização customizada do prefetch por tipo de worker (ex.: `notification_consumer` vs `search_indexer_worker`).
