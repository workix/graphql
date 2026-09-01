## Context

O backend `graphql` é um servidor Apollo/Express-GraphQL construído em TypeScript e Node.js, com banco relacional gerenciado via Sequelize ORM, pubsub realtime via WebSockets (`graphql-ws` + `ws`), integração com RabbitMQ para mensageria assíncrona, e Elasticsearch / Redis. Uma auditoria detalhada com base no guia técnico de 27 fases (`prompt-diagnostico-memoria-cpu-typescript-v2.md`) identificou gargalos como processamento síncrono de bcrypt no Event Loop, ausência de prefetch em consumidores RabbitMQ, ausência de pool explícito para Sequelize, e falta de heartbeat/limpeza de sockets WS.

## Goals / Non-Goals

**Goals:**
- Estruturar o relatório executivo e técnico detalhado de diagnóstico de CPU e memória.
- Mapear a arquitetura de componentes do sistema e os fluxos de dados de alto impacto.
- Estabelecer a divisão do trabalho em 5 proposals complementares de otimização aplicadas em baby steps.

**Non-Goals:**
- Não aplicar alterações especulativas de código sem que cada alteração faça parte de uma proposta validada e coberta por testes.
- Não refatorar regras de negócio ou schemas de GraphQL fora do escopo de desempenho e contenção de recursos.

## Decisions

- **Decisão 1: Abordagem Modular de Decomposição (Fase 25-B)**:
  - *Opção escolhida*: Decompor o diagnóstico em proposals especializadas por subsistema (`perf-event-loop-cpu-optimization`, `perf-db-pooling-query-optimization`, `perf-messaging-backpressure-resilience`, `perf-realtime-subscriptions-lifecycle`, `perf-telemetry-monitoring-runtime`).
  - *Alternativa descartada*: Fazer uma única proposta monolítica de dezenas de arquivos, aumentando o risco de regressão e violando a regra de baby steps.
- **Decisão 2: TDD e Validação com Métricas Objetivas**:
  - *Opção escolhida*: Exigir testes unitários/integração para cada otimização antes de alterar a implementação, mantendo 100% dos testes passando.
  - *Alternativa descartada*: Modificar apenas configurações sem validação de regressão.

## Risks / Trade-offs

- [Risco] Overhead de manter múltiplos OpenSpec changes → [Mitigação] Estruturar proposals bem delimitadas e com dependências claras.
- [Risco] Alterações em pools de banco afetarem latência de testes locais em SQLite → [Mitigação] Configurar pools específicos por ambiente (test, development, production).
