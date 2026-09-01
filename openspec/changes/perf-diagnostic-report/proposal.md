## Why

A aplicação Node.js / TypeScript GraphQL precisa de uma auditoria profunda de desempenho, consumo de CPU e gestão de memória heap/nativa com base nas 27 fases do guia técnico de diagnóstico. Identificar gargalos de Event Loop, alocações excessivas no ORM/Sequelize, ausência de backpressure em mensageria RabbitMQ e falta de controle em WebSockets e pools de conexão é essencial para evitar incidentes de Out-Of-Memory (OOM) e travamentos sob alta concorrência.

## What Changes

- Levantamento e consolidação do relatório executivo de diagnóstico de memória (V8 Heap vs RSS nativo) e CPU em toda a base de código do projeto `graphql`.
- Mapeamento das matrizes de causas e severidades (Crítico, Alto, Médio, Baixo) para coleções, closures, workers, timers, pools de banco, event loop, queries e mensageria.
- Formalização do plano mestre de medidas de gerenciamento (Fase 25-B) decomposto em proposals modulares e independentes para implementação incremental em baby steps.
- Estabelecimento dos critérios objetivos de evidência, métricas de validação e requisitos de telemetria contínua.

## Capabilities

### New Capabilities
- `performance-memory-cpu-diagnostic`: Relatório de diagnóstico técnico e plano arquitetural mestre de gestão de memória e CPU para o ecossistema TypeScript / GraphQL.

### Modified Capabilities

## Impact

- Documentação técnica e arquitetural consolidada no ecossistema OpenSpec.
- Define a base de requisitos, evidências e critérios de aceitação para os subsequentes pacotes de otimização (`perf-event-loop-cpu-optimization`, `perf-db-pooling-query-optimization`, `perf-messaging-backpressure-resilience`, `perf-realtime-subscriptions-lifecycle`, `perf-telemetry-monitoring-runtime`).
