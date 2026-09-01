# Known Issues

Registro de issues conhecidas do projeto `graphql`, com contexto suficiente para reprodução e correção futura.

## Formato de registro

Cada issue deve conter:

```
## [ID] Título curto do problema

- **Status**: Aberto / Em análise / Corrigido
- **Data**: AAAA-MM-DD
- **Módulo(s) afetado(s)**: src/modules/...
- **Contexto**: descrição do cenário em que o bug ocorre
- **Passos para reproduzir**:
  1. ...
  2. ...
- **Comportamento esperado**: ...
- **Comportamento atual**: ...
- **Causa raiz (se identificada)**: ...
- **Referências**: PRs, commits, arquivos relacionados
```

---

## [ISSUE-001] Cobertura global do Jest abaixo de 100% (débito pré-existente)

- **Status**: Aberto
- **Data**: 2026-08-29
- **Módulo(s) afetado(s)**: `src/modules/posts`, `src/modules/messaging`, `src/modules/resumes`, `src/modules/selective_processes`, `src/modules/stats`, `src/modules/subscribers`, `src/modules/testimonials`, `src/modules/users`, `src/subscriptions/index.ts`, `src/utils/queryHelper.ts`
- **Contexto**: O `jest.config` define limiar global de 100% de cobertura (statements/branches/functions/lines). Ao rodar `npx jest` (suite completa) na Fase 3, o limiar global falha mesmo com todos os testes passando, pois módulos de fases anteriores (1 e 2) não atingem 100% de cobertura individualmente.
- **Passos para reproduzir**:
  1. `npx jest` na raiz do projeto
  2. Observar "Jest: global coverage threshold ... not met" ao final, apesar de "Test Suites: N passed".
- **Comportamento esperado**: Cobertura global de 100% conforme regra de TDD do projeto (`CLAUDE.md` e critérios de aceite da Fase 3).
- **Comportamento atual**: Cobertura global fica em ~90% statements / ~85% branches / ~91% lines / ~83% functions (medido ao final da Fase 4 completa - hashtags, premium, learning, social_selling e verificação de identidade, todos com 100% de cobertura individual). O módulo `messaging` foi identificado com gap de cobertura pré-existente (fallback `db.Sequelize.Op?.or || '$or'` e `ctx.pubsub || pubsub`, nunca exercitados na branch alternativa) ao ser estendido para o fluxo de InMail na Fase 4. Nenhum módulo novo da Fase 4 contribui para o déficit; a cobertura global vem melhorando levemente a cada fase (Fase 3: ~89/83/91/82, Fase 4: ~90/85/91/83) puramente porque os módulos novos entram com 100%, mas o débito absoluto nos módulos legados (Fases 1-2) permanece sem correção dedicada.
- **Causa raiz (se identificada)**: Débito de testes das Fases 1 e 2 (branches de erro/edge-case não exercitados nesses módulos). Confirmado via `git stash` que o déficit já existia antes de qualquer código da Fase 3 ser adicionado (medição anterior: ~88% statements / ~78% branches / ~89% lines / ~81% functions apenas com módulos até a Fase 2).
- **Referências**: `jest.config.js` (coverageThreshold), módulos citados acima; módulos da Fase 3 (`groups`, `events`, `analytics`) foram entregues com 100% de cobertura individual.

---

## [ISSUE-002] Senha de autenticação hardcoded no arquivo `src/factory/redis_server.ts`

- **Status**: Corrigido
- **Data**: 2026-09-01
- **Módulo(s) afetado(s)**: `src/factory/redis_server.ts`
- **Contexto**: A constante de conexão `connectionOptions` definia estaticamente `password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81"` no código-fonte, violando regras de segurança e boas práticas de 12-factor app.
- **Passos para reproduzir**:
  1. Abrir `src/factory/redis_server.ts`.
  2. Inspecionar as opções de conexão.
- **Comportamento esperado**: Credenciais de acesso ao Redis devem ser obtidas via variáveis de ambiente (`process.env.REDIS_PASSWORD`).
- **Comportamento atual**: Senha estática removida e parametrizada via `process.env.REDIS_PASSWORD` com `ioredis` nativo assíncrono.
- **Causa raiz (se identificada)**: Configuração estática inicial não parametrizada com `process.env`.
- **Referências**: Regra de segurança `CLAUDE.md`, proposta OpenSpec `perf-messaging-backpressure-resilience`, commits `e565133` e `debfb9f`.

---

## [ISSUE-003] Bloqueio do Event Loop por métodos síncronos de Bcrypt em `src/utils/BcryptEncoderDecoder.ts`

- **Status**: Corrigido
- **Data**: 2026-09-01
- **Módulo(s) afetado(s)**: `src/utils/BcryptEncoderDecoder.ts`
- **Contexto**: Operações de criptografia e comparação utilizavam `bcrypt.hashSync`, `bcrypt.genSaltSync` e `bcrypt.compareSync`. Como o algoritmo do Bcrypt é intensivo em CPU, isso bloqueava a thread principal do Node.js por 50-100ms+ a cada requisição.
- **Passos para reproduzir**:
  1. Executar autenticação ou hashing em carga simultânea.
  2. Medir atraso do Event Loop (`event_loop_lag_seconds`).
- **Comportamento esperado**: Hashing e comparação assíncronos delegados ao pool de threads libuv sem travar o Event Loop.
- **Comportamento atual**: Refatorado para `async/await` com `bcrypt.hash` e `bcrypt.compare` com 100% de cobertura de testes unitários TDD.
- **Causa raiz (se identificada)**: Uso de APIs síncronas `*Sync` da biblioteca `bcrypt`.
- **Referências**: Proposta OpenSpec `perf-event-loop-cpu-optimization`, commits `989385f` e `953c6a4`, Fase 8 e 25-B.5 do guia de diagnóstico.

---

## [ISSUE-004] Ausência de prefetch no consumidor `RabbitmqServer` (Risco de OOM)

- **Status**: Corrigido
- **Data**: 2026-09-01
- **Módulo(s) afetado(s)**: `src/factory/rabbitmq_server.ts`, `src/workers/`
- **Contexto**: O método `consume` não definia `channel.prefetch(count)`. Em caso de backlog de mensagens, o broker RabbitMQ empurrava todas as mensagens para a memória do processo simultaneamente, podendo causar estouro de Heap (OOM Kill).
- **Passos para reproduzir**:
  1. Enfileirar 100.000 mensagens no RabbitMQ.
  2. Iniciar o consumidor sem prefetch configurado.
  3. Monitorar o crescimento rápido de RSS/HeapUsed até o crash do processo.
- **Comportamento esperado**: Consumo limitado e controlado por backpressure (`channel.prefetch(10)`).
- **Comportamento atual**: Implementado `prefetchCount = 10` como padrão configurável no canal antes do consumo.
- **Causa raiz (se identificada)**: Falta de invocação de `channel.prefetch()` antes do consumo.
- **Referências**: Proposta OpenSpec `perf-messaging-backpressure-resilience`, commits `e565133` e `debfb9f`, Fases 6, 18 e 25-B.12 do guia de diagnóstico.

---

## [ISSUE-005] Ausência de Heartbeat e Limpeza de Conexões WebSocket Inativas

- **Status**: Corrigido
- **Data**: 2026-09-01
- **Módulo(s) afetado(s)**: `src/subscriptions/index.ts`
- **Contexto**: O `WebSocketServer` não possuía verificação periódica de vivacidade (ping/pong). Conexões de clientes móveis/web desconectadas de forma anômala permaneciam no Heap e no SO como sockets zumbis.
- **Passos para reproduzir**:
  1. Estabelecer conexões WebSocket de subscrição.
  2. Forçar desconexão sem handshake TCP FIN.
  3. Inspecionar `wsServer.clients` e handles abertos do Node.js após repouso.
- **Comportamento esperado**: Descarte e terminação automática de sockets inativos após 30 segundos (`ws.terminate()`).
- **Comportamento atual**: Implementado `setupWebSocketHeartbeat` com ciclo de ping/pong de 30s e terminação forçada (`terminate()`) de clientes inativos, além de limpeza no `close`.
- **Causa raiz (se identificada)**: Falta de rotina de ping/pong heartbeat no `WebSocketServer`.
- **Referências**: Proposta OpenSpec `perf-realtime-subscriptions-lifecycle`, commits `7c6b84f` e `9cf85a3`, Fases 10 e 25-B.3 do guia de diagnóstico.

---

## [ISSUE-006] Ausência de dimensionamento de Connection Pool para Sequelize ORM

- **Status**: Corrigido
- **Data**: 2026-09-01
- **Módulo(s) afetado(s)**: `src/config/config.json`, `src/models/index.ts`
- **Contexto**: As configurações de conexão com banco de dados em `src/config/config.json` não definiam limites de pool (`max`, `min`, `idle`, `acquire`), expondo a aplicação a esgotamento de conexões sob carga.
- **Passos para reproduzir**:
  1. Iniciar servidor com carga de 100 requisições simultâneas contra o banco.
  2. Observar timeouts e alocação não controlada de conexões no banco de dados.
- **Comportamento esperado**: Configuração explícita de pool dimensionada para PostgreSQL em produção e SQLite em desenvolvimento.
- **Comportamento atual**: Configurado pool com `max: 20`, `min: 2`, `idle: 10000`, `acquire: 30000`, `evict: 1000` em produção e `max: 5` em desenvolvimento/teste.
- **Causa raiz (se identificada)**: Bloco `pool` ausente no `config.json`.
- **Referências**: Proposta OpenSpec `perf-db-pooling-query-optimization`, commits `24b4aae` e `10d64bd`, Fases 11 e 25-B.8 do guia de diagnóstico.

