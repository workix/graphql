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

---

## [ISSUE-007] Auth guard desligado por padrão nos frontends admin e client

- **Status**: Aberto
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `frontend/admin/src/router/index.ts`, `frontend/client/src/router/index.ts`
- **Contexto**: Encontrado durante o levantamento de capabilities para testes E2E (`CAPABILITIES.md`). O guard de rota (`meta.requiresAuth`) só é aplicado quando a env var `VITE_ENABLE_AUTH_GUARD === 'true'`. Nenhum dos dois projetos possui `.env`/`.env.example` versionado definindo essa variável.
- **Passos para reproduzir**:
  1. Rodar `frontend/admin` ou `frontend/client` sem definir `VITE_ENABLE_AUTH_GUARD`.
  2. Navegar diretamente para uma rota marcada como `requiresAuth` (ex.: `/dashboard` no admin, `/post-job` no client) sem estar autenticado.
- **Comportamento esperado**: Rotas protegidas devem redirecionar para `/login` quando não há sessão válida, independentemente de configuração de ambiente.
- **Comportamento atual**: Rota é acessada normalmente sem autenticação, pois o guard nunca é ativado por padrão.
- **Causa raiz (se identificada)**: Flag de feature (`VITE_ENABLE_AUTH_GUARD`) usada para controlar comportamento de segurança crítico, sem valor padrão seguro (`true`) nem arquivo de exemplo documentando a variável.
- **Referências**: `CAPABILITIES.md` (seções 2, 3 e 5), `frontend/admin/src/router/index.ts`, `frontend/client/src/router/index.ts`.

---

## [ISSUE-008] Gating de role inócuo no frontend admin (`adminAuth.ts`)

- **Status**: Aberto
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `frontend/admin/src/services/adminAuth.ts` (ou equivalente — `syncAdminBackendSession`)
- **Contexto**: Encontrado durante o levantamento de capabilities para testes E2E. O spec `firebase-auth-frontend-admin` descreve bloqueio de usuários que não sejam `ROLE_ADMIN`/`ROLE_OPERATOR`, mas a implementação atual fixa `role: 'ROLE_ADMIN'` para qualquer usuário Firebase autenticado com sucesso, e em erro de rede/Firebase cria uma sessão admin local fake em vez de bloquear o acesso.
- **Passos para reproduzir**:
  1. Autenticar no admin com um usuário Firebase válido que não deveria ter papel de admin.
  2. Observar que o app trata a sessão como `ROLE_ADMIN` sem nenhuma verificação adicional.
  3. Simular falha de rede/Firebase durante o login e observar a criação de sessão local fake (`admin-fb-token-*`).
- **Comportamento esperado**: Apenas usuários com role `ROLE_ADMIN`/`ROLE_OPERATOR` (validado no backend) devem ter acesso; falhas de rede/Firebase devem bloquear o acesso, não criar uma sessão de fallback.
- **Comportamento atual**: Todo usuário autenticado vira admin; falha de rede vira sessão fake válida.
- **Causa raiz (se identificada)**: Fallback de desenvolvimento (sessão local dummy) aparentemente deixado ativo sem guard de ambiente (`NODE_ENV`/`import.meta.env.DEV`).
- **Referências**: `CAPABILITIES.md` (seção 2), spec `openspec/specs/firebase-auth-frontend-admin/spec.md`.

---

## [ISSUE-009] Mensageria e notificações sem atualização em tempo real no frontend client

- **Status**: Aberto
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `frontend/client/src/services/messaging.service.ts`, `frontend/client/src/services/notifications.service.ts`, `frontend/client/src/views/MessagingView.vue`
- **Contexto**: Encontrado durante o levantamento de capabilities para testes E2E. O spec `messaging-chat-realtime` descreve mensageria em tempo real, mas não foi encontrado nenhum código de subscription GraphQL, WebSocket ou polling nas views/serviços correspondentes do frontend client — a implementação parece ser puramente request/response (necessário refresh manual).
- **Passos para reproduzir**:
  1. Abrir `/messaging` ou `/notifications` em duas sessões (remetente e destinatário).
  2. Enviar uma mensagem/gerar uma notificação a partir da sessão A.
  3. Observar que a sessão B não recebe a atualização sem recarregar/reabrir a tela.
- **Comportamento esperado**: Novas mensagens e notificações devem aparecer sem ação manual do usuário (via GraphQL subscription, WebSocket ou polling).
- **Comportamento atual**: Nenhuma atualização em tempo real observada no código do frontend client.
- **Causa raiz (se identificada)**: Backend expõe schema/infraestrutura de tempo real (`performance-realtime-subscriptions`), mas o frontend client não consome subscriptions para mensageria/notificações.
- **Referências**: `CAPABILITIES.md` (seção 3), specs `messaging-chat-realtime`, `notifications-inbox-realtime`, `performance-realtime-subscriptions`.

---

## [ISSUE-010] Telas novas do app Android implementadas mas sem navegação (paridade incompleta)

- **Status**: Aberto
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `android/app/src/main/java/.../ui/*` (feed social, chat, conexões, grupos, eventos, cursos, notificações, premium, kanban, entrevistas), `android/app/src/main/AndroidManifest.xml`, `MainActivity`
- **Contexto**: Encontrado durante o levantamento de capabilities para testes E2E. `MainActivity` monta a `BottomNavigationView` programaticamente com apenas 4 itens (Início, Vagas, Candidatos, Blog). Diversas telas mais recentes (`SocialFeedFragment`, `ChatListFragment`, `ConnectionsFragment`, `NotificationsFragment`, `GroupsFragment`, `EventsFragment`, `CoursesFragment`, `PremiumPlansActivity`, `MyApplicationsFragment`, `TeamFragment`, `ProfileAnalyticsActivity`) existem no código mas não possuem nenhum caller externo encontrado. `RecruitmentKanbanActivity` e `InterviewsActivity` nem estão declaradas no `AndroidManifest.xml`, portanto não podem ser abertas pelo sistema operacional.
- **Passos para reproduzir**:
  1. Navegar pelo app Android usando apenas a bottom navigation (4 abas).
  2. Confirmar que nenhuma das telas listadas acima é alcançável.
  3. Buscar `<activity` no `AndroidManifest.xml` e confirmar ausência de `RecruitmentKanbanActivity`/`InterviewsActivity`.
- **Comportamento esperado**: Telas implementadas para atingir paridade com o frontend client (per spec `frontend-android-parity-survey`) devem estar navegáveis a partir da UI principal.
- **Comportamento atual**: Telas existem em código, compilam, mas não são alcançáveis pelo usuário; duas delas nem estão registradas no manifest.
- **Causa raiz (se identificada)**: Trabalho de paridade implementado incrementalmente sem atualizar a navegação principal (`MainActivity`) nem o manifest para as duas Activities faltantes.
- **Referências**: `CAPABILITIES.md` (seção 4), spec `frontend-android-parity-survey`, `android/ANDROID_MIGRATION_PROGRESS.md`.

---

## [ISSUE-011] Token FCM renovado nunca é enviado ao backend (`onNewToken` stub)

- **Status**: Aberto
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `android/app/src/main/java/.../MyFirebaseMessagingService.kt`
- **Contexto**: Encontrado durante o levantamento de capabilities para testes E2E. O método `onNewToken` do serviço de mensageria Firebase está implementado como stub — o token FCM renovado não é enviado ao backend, o que pode causar falha silenciosa de entrega de push notifications após rotação de token.
- **Passos para reproduzir**:
  1. Forçar renovação do token FCM (reinstalar app ou invalidar token via Firebase Console).
  2. Verificar no backend se o novo token foi persistido para o usuário.
- **Comportamento esperado**: `onNewToken` deve enviar o token atualizado ao backend (mutation/endpoint de registro de device), garantindo entrega contínua de notificações push.
- **Comportamento atual**: Novo token não é propagado; apenas o token inicial (capturado em outro ponto do app) permanece registrado, se houver.
- **Causa raiz (se identificada)**: Implementação de `onNewToken` deixada incompleta (stub) durante o desenvolvimento do serviço FCM.
- **Referências**: `CAPABILITIES.md` (seção 4), spec `android-testing-fcm-release`.

---

## [ISSUE-012] Ausência total de testes instrumentados (`androidTest/`) no app Android

- **Status**: Aberto
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `android/app` (build.gradle, estrutura de diretórios de teste)
- **Contexto**: Encontrado durante o levantamento de capabilities para testes E2E. O `build.gradle` do módulo Android declara dependências de teste instrumentado (`androidx.test.ext:junit`, `espresso-core:3.6.1`, `testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"`), mas não existe nenhuma pasta `androidTest/` no projeto. Todos os testes existentes (`JobRepositoryTest`, `JobGraphQLTest`, `JobSearchTest`, `GraphQLApiClientTest`, `MediaApiServiceTest`, `NetworkResultTest`, `RecruitmentCapabilitiesTest`, `CategoryNavigationTest`, `JobViewModelFilterTest`) são testes JVM unitários (`src/test/`), não testes de UI instrumentados.
- **Passos para reproduzir**:
  1. Buscar diretórios `androidTest` em `android/app/src`.
  2. Confirmar ausência total (apenas `src/test` existe).
- **Comportamento esperado**: Dado que o projeto já declara dependências Espresso/AndroidJUnitRunner, seria esperado haver ao menos uma suíte básica de smoke-test instrumentado.
- **Comportamento atual**: Zero cobertura de UI/E2E no Android — qualquer suíte E2E para este app começará do zero.
- **Causa raiz (se identificada)**: Dependências de teste adicionadas preventivamente, mas suíte nunca implementada.
- **Referências**: `CAPABILITIES.md` (seção 4 e 6), `android/app/build.gradle`.

