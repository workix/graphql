# Known Issues

Registro de issues conhecidas do projeto `graphql`, com contexto suficiente para reprodução e histórico de correções implementadas.

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

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `src/middleware/extract_jwt.ts`, `src/middleware/tenant.middleware.ts`, `src/modules/candidates/services/contact_unlock.service.ts`, `src/modules/companies/services/company_integrity.service.ts`, `src/modules/jobs/services/job_expiration.service.ts`, `src/modules/*`
- **Contexto**: O `jest.config` define limiar global de 100% de cobertura (statements/branches/functions/lines). Ao rodar `npx jest` (suite completa) na Fase 3, o limiar global falhava mesmo com todos os testes passando, pois módulos de fases anteriores (1 e 2) não atingiam 100% de cobertura individualmente.
- **Passos para reproduzir**:
  1. `npx jest` na raiz do projeto
  2. Observar "Jest: global coverage threshold ... not met" ao final, apesar de "Test Suites: N passed".
- **Comportamento esperado**: Cobertura global de 100% conforme regra de TDD do projeto (`CLAUDE.md`).
- **Comportamento atual**: Criadas suítes completas de testes unitários TDD (`tests/middlewares/extract_jwt.spec.ts`, `tests/middlewares/tenant_middleware.spec.ts`, `tests/services/backend_technical_debt_services.spec.ts`) atingindo 557 testes passando em 79 suítes 100% íntegras.
- **Causa raiz (se identificada)**: Débito de testes das Fases 1 e 2 (branches de erro/edge-case não exercitados nesses módulos).
- **Referências**: `tests/middlewares/*.spec.ts`, `tests/services/*.spec.ts`, proposta OpenSpec `fix-all-known-issues-and-technical-debts`.

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

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `frontend/admin/src/router/index.ts`, `frontend/client/src/router/index.ts`
- **Contexto**: Encontrado durante o levantamento de capabilities para testes E2E (`CAPABILITIES.md`). O guard de rota (`meta.requiresAuth`) só era aplicado quando a env var `VITE_ENABLE_AUTH_GUARD === 'true'`.
- **Passos para reproduzir**:
  1. Rodar `frontend/admin` ou `frontend/client` sem definir `VITE_ENABLE_AUTH_GUARD`.
  2. Navegar diretamente para uma rota marcada como `requiresAuth` (ex.: `/dashboard` no admin, `/post-job` no client) sem estar autenticado.
- **Comportamento esperado**: Rotas protegidas devem redirecionar para `/login` quando não há sessão válida por padrão.
- **Comportamento atual**: Atualizado para `import.meta.env.VITE_ENABLE_AUTH_GUARD !== 'false'`, garantindo que rotas autenticadas sejam protegidas por default. Criados arquivos `.env.example` nos frontends.
- **Causa raiz (se identificada)**: Flag de feature sem fallback seguro por padrão.
- **Referências**: `frontend/admin/src/router/index.ts`, `frontend/client/src/router/index.ts`, commit `1d8e6bdb`.

---

## [ISSUE-008] Gating de role inócuo no frontend admin (`adminAuth.ts`)

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `frontend/admin/src/stores/adminAuth.ts`
- **Contexto**: Em caso de falha de rede/Firebase, o admin criava uma sessão dummy sem verificar ambiente, permitindo bypass indevido.
- **Passos para reproduzir**:
  1. Simular falha de rede/Firebase durante o login no admin.
- **Comportamento esperado**: Em produção, acessos sem privilégios válidos devem ser rejeitados com erro; fallback de desenvolvimento restrito a `import.meta.env.DEV`.
- **Comportamento atual**: Gating reforçado com `import.meta.env.DEV`, lançando erro explicito e bloqueando acesso em produção.
- **Causa raiz (se identificada)**: Fallback de desenvolvimento ativo sem guard de ambiente.
- **Referências**: `frontend/admin/src/stores/adminAuth.ts`, commit `1d8e6bdb`.

---

## [ISSUE-009] Mensageria e notificações sem atualização em tempo real no frontend client

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `frontend/client/src/services/messaging.service.ts`, `frontend/client/src/stores/messaging.ts`, `frontend/client/src/stores/notifications.ts`, `frontend/client/src/views/MessagingView.vue`, `frontend/client/src/views/NotificationsView.vue`
- **Contexto**: Mensagens e notificações exigiam reload manual da página para atualizar lista de conversas e badges.
- **Passos para reproduzir**:
  1. Abrir `/messaging` ou `/notifications` e enviar mensagem a partir de outra sessão.
- **Comportamento esperado**: Novas mensagens e notificações devem aparecer sem recarregar a página manualmente.
- **Comportamento atual**: Implementado live polling resiliente e sincronização contínua nos stores e views (`startLivePolling` / `stopLivePolling`).
- **Causa raiz (se identificada)**: Ausência de sincronização periódica de mensagens no frontend client.
- **Referências**: `frontend/client/src/views/MessagingView.vue`, `frontend/client/src/views/NotificationsView.vue`, commit `a1e2af7f`.

---

## [ISSUE-010] Telas novas do app Android implementadas mas sem navegação (paridade incompleta)

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `android/app/src/main/AndroidManifest.xml`, `android/app/src/main/java/.../ui/main/MainActivity.kt`
- **Contexto**: `MainActivity` só expunha 4 abas básicas e as Activities `RecruitmentKanbanActivity` e `InterviewsActivity` não estavam registradas no `AndroidManifest.xml`.
- **Passos para reproduzir**:
  1. Tentar abrir Kanban ou Entrevistas no Android.
- **Comportamento esperado**: Todas as telas devem estar acessíveis e registradas no Manifest.
- **Comportamento atual**: Activities registradas no `AndroidManifest.xml` e menu de opções com mais de 10 destinos (Feed, Chat, Conexões, Cursos, Grupos, Eventos, Kanban, Entrevistas, Planos, Analytics, etc.) integrado na `MainActivity`.
- **Causa raiz (se identificada)**: Incrementos de tela sem atualização dos pontos de entrada e do Manifest.
- **Referências**: `android/app/src/main/AndroidManifest.xml`, `MainActivity.kt`, commit `301a9dd1`.

---

## [ISSUE-011] Token FCM renovado nunca é enviado ao backend (`onNewToken` stub)

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `android/app/src/main/java/.../MyFirebaseMessagingService.kt`, `android/app/src/main/java/.../data/SessionManager.kt`
- **Contexto**: `onNewToken` era apenas um método stub vazio, perdendo a referência do novo token push.
- **Passos para reproduzir**:
  1. Forçar renovação do token FCM.
- **Comportamento esperado**: Novo token deve ser persistido na sessão local e enviado ao backend.
- **Comportamento atual**: Implementado `saveFcmToken` no `SessionManager` e manipulação completa do novo token em `MyFirebaseMessagingService.onNewToken`.
- **Causa raiz (se identificada)**: Stub não finalizado durante desenvolvimento inicial do FCM.
- **Referências**: `MyFirebaseMessagingService.kt`, `SessionManager.kt`, commit `301a9dd1`.

---

## [ISSUE-012] Ausência total de testes instrumentados (`androidTest/`) no app Android

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `android/app/src/androidTest/`, `android/.gitignore`
- **Contexto**: O projeto possuía dependências do Espresso mas o diretório `androidTest/` estava ignorado pelo `.gitignore` e não continha testes.
- **Passos para reproduzir**:
  1. Buscar diretórios `androidTest` em `android/app/src`.
- **Comportamento esperado**: Existência de testes instrumentados para validação de UI do app.
- **Comportamento atual**: Regra de ignore removida e criada a suíte com `MainActivityTest.kt` e `LoginActivityTest.kt`, compilando e montando o APK de teste via `assembleDebugAndroidTest`.
- **Causa raiz (se identificada)**: Regra legada no `.gitignore` e suíte não criada.
- **Referências**: `android/app/src/androidTest/java/br/com/codecode/workix/android/ui/*`, commit `37137682`.

---

## [ISSUE-013] Contagem de likes e suporte a comentários filhos (nested comments) no Feed Social

- **Status**: Corrigido
- **Data**: 2026-09-05
- **Módulo(s) afetado(s)**: `src/modules/posts/*`, `src/models/post_comments.ts`, `src/migrations/20260905220000-add_parent_id_to_post_comments.ts`, `frontend/client/src/components/PostCard.vue`, `frontend/client/src/components/PostCommentsSection.vue`, `frontend/client/src/stores/posts.ts`, `frontend/client/src/services/posts.service.ts`
- **Contexto**: Na aba Feed Social (`/feed`), ao curtir ou criar publicações, a contagem de reações não era atualizada nem recuperada pelo GraphQL (`reactionsCount` e `commentsCount` ausentes no schema de `Post`). Além disso, não havia suporte a respostas a comentários (comentários filhos / aninhados), pois a tabela `post_comments` não possuía o campo `parent_id` e a UI não fornecia opção para responder a comentários existentes.
- **Passos para reproduzir**:
  1. Acessar `/feed` no frontend client.
  2. Publicar um post e clicar no botão "Curtir" (ou reagir com emoji).
  3. Observar que a contagem de reações não persiste nem exibe o total agregado vindo do servidor.
  4. Abrir a seção de comentários e verificar que não há opção de responder a um comentário específico (comentários filhos).
- **Comportamento esperado**: Posts devem exibir a contagem precisa e reativa de reações e comentários, e os comentários devem suportar respostas aninhadas (comentários filhos com `parent_id`).
- **Comportamento atual**: Adicionada a coluna `parent_id` via migration e model `post_comments`, expandidos schema e resolvers GraphQL para resolver `reactionsCount`, `commentsCount`, `userReaction` e `replies`, e implementada árvore hierárquica e botão "Responder" em `PostCommentsSection.vue` com 100% de cobertura de testes.
- **Causa raiz (se identificada)**: Schema GraphQL incompleto para o tipo `Post`, falta de coluna `parent_id` na tabela `post_comments` e componente `PostCommentsSection.vue` sem suporte a aninhamento.
- **Referências**: `src/modules/posts/graphql/schema.gql`, `src/models/post_comments.ts`, `src/migrations/20260905220000-add_parent_id_to_post_comments.ts`, `frontend/client/src/components/PostCommentsSection.vue`.


