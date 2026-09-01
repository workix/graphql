## 1. Mapeamento e Diagnóstico da Base de Código

- [ ] 1.1 Realizar levantamento estruturado de componentes e bibliotecas em `package.json`, `tsconfig.json` e `src/index.ts`
- [ ] 1.2 Auditar o ciclo de vida do Event Loop e operações síncronas bloqueantes (bcrypt, parsing)
- [ ] 1.3 Auditar gestão de conexões e retenção de instâncias no ORM Sequelize
- [ ] 1.4 Auditar filas assíncronas RabbitMQ, backpressure e consumo sem limites
- [ ] 1.5 Auditar servidores WebSocket e descarte de listeners de subscrições

## 2. Formalização das Propostas de Otimização

- [ ] 2.1 Criar proposta para otimização de Event Loop e CPU (`perf-event-loop-cpu-optimization`)
- [ ] 2.2 Criar proposta para pools de conexões e projeções de banco de dados (`perf-db-pooling-query-optimization`)
- [ ] 2.3 Criar proposta para mensageria, backpressure e resiliência de filas (`perf-messaging-backpressure-resilience`)
- [ ] 2.4 Criar proposta para ciclo de vida de WebSockets e subscrições realtime (`perf-realtime-subscriptions-lifecycle`)
- [ ] 2.5 Criar proposta para telemetria, observabilidade de GC e profiling (`perf-telemetry-monitoring-runtime`)
