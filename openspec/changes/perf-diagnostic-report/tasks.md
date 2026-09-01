## 1. Auditoria e Diagnóstico do Código-Fonte

- [x] 1.1 Realizar levantamento estruturado de componentes e bibliotecas em `package.json`, `tsconfig.json` e `src/index.ts`
- [x] 1.2 Auditar o ciclo de vida do Event Loop e operações síncronas bloqueantes (bcrypt, parsing)
- [x] 1.3 Auditar gestão de conexões e retenção de instâncias no ORM Sequelize
- [x] 1.4 Auditar filas assíncronas RabbitMQ, backpressure e consumo sem limites
- [x] 1.5 Auditar servidores WebSocket e descarte de listeners de subscrições

## 2. Elaboração e Quebra das Propostas de Implementação

- [x] 2.1 Criar proposta para otimização de Event Loop e CPU (`perf-event-loop-cpu-optimization`)
- [x] 2.2 Criar proposta para pools de conexões e projeções de banco de dados (`perf-db-pooling-query-optimization`)
- [x] 2.3 Criar proposta para mensageria, backpressure e resiliência de filas (`perf-messaging-backpressure-resilience`)
- [x] 2.4 Criar proposta para ciclo de vida de WebSockets e subscrições realtime (`perf-realtime-subscriptions-lifecycle`)
- [x] 2.5 Criar proposta para telemetria, observabilidade de GC e profiling (`perf-telemetry-monitoring-runtime`)
