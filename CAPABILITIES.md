# CAPABILITIES.md — Inventário de Capabilities do Ecossistema Workix

> Documento gerado em 2026-09-05 como ponto de partida (boot) para a criação de testes end-to-end (E2E) em todos os frontends e no app Android.
> Fonte primária: os ~80 specs já existentes em `openspec/specs/*/spec.md`, cruzados com o código-fonte real de cada app (rotas, telas, resolvers, endpoints) para identificar divergências entre o que a especificação descreve e o que está de fato implementado.

## 0. Escopo real dos projetos (achado importante)

O `CLAUDE.md` deste projeto referencia 4 projetos-irmãos (`java-graphql`, `java-stack`, `workix-spring-boot`, `workix-frontend-vue`) sob `C:\Packsys\NetBeansProjects`. Na máquina atual:

- `C:\Packsys\NetBeansProjects` **não existe**.
- Em `D:\Packsys\NetBeansProjects` só existem, de fato: este projeto `graphql` (que já contém em si o backend GraphQL, os frontends `frontend/admin` e `frontend/client`, e o app `android`) e o projeto `workix-frontend-vue`.
- Os backends legados `java-graphql`, `java-stack` e `workix-spring-boot` **não estão presentes localmente**.

**Conclusão sobre o `workix-frontend-vue`:** é um frontend Vue 3 legado, desenhado para consumir um backend REST (`java-stack`/`workix-spring-boot`) que não existe nesta máquina. Além disso, o código já teve suas chamadas HTTP reais **substituídas por mocks** (`src/mock/mockHttp.js`), restando apenas Firebase Auth como integração real, e está publicado como site estático no GitHub Pages. **Recomendação: fora do escopo do esforço de E2E principal** — não há integração viva com o sistema atual para validar. No máximo vale um smoke-test de UI estático, separado do plano principal.

Este relatório cobre, portanto, os **4 alvos reais de E2E**:
1. Backend GraphQL/REST (`src/`)
2. Frontend Admin (`frontend/admin`)
3. Frontend Client (`frontend/client`)
4. App Android (`android/app`)

---

## 1. Backend (GraphQL + REST) — `src/`

Arquitetura: GraphQL (`/graphql`) é a superfície primária e atual. Os endpoints REST documentados em `REST_ENDPOINTS.md` foram majoritariamente migrados para mutations/queries GraphQL. Rotas REST **realmente montadas** hoje: `GET /`, `GET|POST|PUT /api/v1/media/upload/:id`, `POST /api/v1/media/direct-upload`, estático `/uploads/media`, e `/health`, `/health/live`, `/health/ready`, `/health/metrics`.

### Autenticação e Identidade
- `doLogin(firebaseUUID, email)`, `createUser`, query protegida `aboutMe`. Auth 100% via Firebase UID/token (sem senha armazenada). Erro padrão: `Unauthorized! Token not provided`.

### Vagas (Jobs)
- CRUD: `searchJobs`, `allJobsPaginated`, `allJobsFeatured`, `getJobById`, `subscribeInJob`, `createJob`/`updateJob`/`deleteJob` (admin, limitado por plano via `can()`).
- Busca: `searchJobs` (relevância ponderada título > skills > descrição, decaimento temporal), `jobSearchFacets`, `jobSearchSuggestions(prefix)` (typeahead), vagas patrocinadas (`sponsoredJobs`) separadas das orgânicas, eventos RabbitMQ `search-index-sync` em CUD.
- Categorias/tipos: enums `JobCategory` (MEIO_PERIODO, PRIMEIRA_OPORTUNIDADE, ESTAGIO, NOTURNO, TEMPORARIO, FREELANCE, PERICULOSIDADE), `JobEmploymentType` (CLT, PJ, CONTRATO_TEMPORARIO).
- Integridade anti-vaga-fantasma: `expires_at` obrigatório, expiração automática, registro obrigatório de desfecho por candidato, cálculo diário de `response_rate_90d`, selo "Empresa Verificada" (CNPJ + domínio + taxa de resposta ≥80% + mediana ≤14 dias, com suspensão automática em regressão).
- Vagas patrocinadas: `job_boosts`/`purchases`, `is_sponsored`/`sponsor_label` imutáveis, limite `max_concurrent_slot`, ranking orgânico nunca rebaixado.
- Vagas confidenciais (premium): `isConfidential` gated por `can('POST_CONFIDENTIAL_JOBS')`; visão pública mascara nome/logo/contatos da empresa; Kanban/entrevistas/relatórios internos mantêm dados reais.

### Candidatos / Perfil / Privacidade
- Sem CPF obrigatório no cadastro (só e-mail). Configurações de visibilidade: `searchable_by_recruiters`, `open_to_work_visible`, `show_as_viewed`, visibilidade de status de carreira. Gate `reveal()` no servidor sobrepõe até planos pagos. Retenção de `profile_views`: 12 meses (Premium) / 7 dias (Free).
- Flags de transição de carreira: `lookingForJob`, `inCareerTransition`, `careerTransitionTarget`, `acceptsEntryLevel` (badges Web/Android).
- Currículo markdown normalizado: `saveNormalizedResume`, geração automática a partir do perfil, renderização segura contra XSS, indexação de busca.
- Desbloqueio de contato/InMail: recrutador desbloqueia via débito de crédito → tabela `contact_unlocks`; notificação obrigatória ao candidato (`notified_candidate_at`) — nunca acesso silencioso.
- `validateCPF(cpf)` query; auditoria de mídia admin (`getMediaById`, `/media`).

### Social / Rede (núcleo estilo LinkedIn)
- Conexões: `myConnections`, `pendingConnectionRequests`, `acceptConnectionRequest`/`rejectConnectionRequest`, `sendConnectionRequest`, `followUser`/`unfollowUser`, `socialDistanceDegree`.
- Endosses/recomendações: `endorseSkill`/`unendorseSkill`, `createRecommendation`, `respondToRecommendation` (aceitar/rejeitar).
- Feed social: `socialFeed`, `rankedSocialFeed`, `createPost` (mídia+menções), `reactToPost` (LIKE/CELEBRATE/SUPPORT/LOVE/INSIGHTFUL/FUNNY), `postComments`/`commentOnPost`, `postsByHashtag`.
- Grupos: `group(id)`, `createGroup`, `joinGroup` (membership ativo/pendente), `groupPosts`/`createGroupPost`.
- Eventos: `event(id)`, `createEvent`, `attendEvent` (RSVP), `eventAttendees`.
- Mensageria: `directMessages(userId1,userId2,limit,offset)`, `sendDirectMessage`, `markDirectMessageAsRead`.
- Notificações: `myNotifications`, `unreadNotificationsCount`, `markNotificationAsRead`.
- SSI/Analytics: `mySocialSellingIndex` (4 pilares, 0-100), `recalculateSocialSellingIndex`, `whoViewedMyProfile`.

### Aprendizado (LMS)
- `course(id)`, `courseLessons`, `enrollInCourse`, `completeCourse` (emite URL de certificado).

### Monetização / Billing / Entitlements
- `entitlements-plans-engine`: tabelas `plans`/`plan_features`; autorização centralizada `can(organization, feature_key, quantity)`; downgrade gracioso (arquiva excedente, preserva histórico).
- `premium-subscriptions-core`: `subscriptionPlans`, `mySubscription(organizationId)`, `subscribeToPlan` (trial 14 dias, desconto fundador); status trialing/active/past_due/paused/canceled.
- `billing-gateway-integration`: Asaas/Iugu (Pix/Cartão/Boleto), NFS-e automática, processamento idempotente de webhooks via `webhook_events`+`gateway_event_id`.
- `recruitment-kanban-board-premium`: gated por `can('USE_RECRUITMENT_KANBAN')`; colunas customizáveis por vaga; `moveKanbanCard` com histórico auditado.
- `interview-scheduler-premium`: gated por `can('SCHEDULE_INTERVIEWS')` (FORBIDDEN caso contrário); `createInterview`, `respondInterview` (CONFIRMED/DECLINED/RESCHEDULE_REQUESTED).

### Governança / Compliance
- LGPD: `exportMyData` (portabilidade Art. 18, dossiê JSON), `anonymizeMyAccount` (anonimização irreversível, integridade referencial preservada, sessões encerradas), feature flags dinâmicas por tenant.
- Transparência: "5 Pactos" públicos, fórmula de ranking auditável, núcleo AGPLv3 + CLA, fronteira de módulo comercial.
- White label: resolução de tenant via `Host`/`x-tenant-id`/`x-tenant-slug`/query params; `whiteLabelConfig`/`upsertWhiteLabelConfig`; isolamento total de cor/logo/CSS por tenant.

### Hardening / Não-funcionais (testáveis via comportamento de API)
- Contrato de erro padronizado `{code,message,timestamp,traceId}`; `Idempotency-Key` deduplica retries de mutation.
- Upload seguro: validação por magic-byte (PDF/JPEG/PNG/WEBP), rejeita executáveis disfarçados, sanitização de filename (path traversal).
- Controle de concorrência: lock otimista → `CONCURRENCY_CONFLICT`.
- Circuit breaker: CLOSED/OPEN/HALF_OPEN, backoff exponencial com jitter.
- Dataloaders (3 specs): correção de batch-loading (sem N+1) para feed/posts, mensageria/notificações/endosses, cursos/grupos/eventos.
- Observabilidade: propagação `x-trace-id`/`x-correlation-id`, logs estruturados JSON; `/health`, `/health/live`, `/health/ready`, `/health/metrics`.
- Performance (6 specs): pool de conexões DB, bcrypt assíncrono, diagnóstico heap/CPU, backpressure RabbitMQ + higiene de credenciais Redis, ping/pong WebSocket para subscriptions, telemetria `/health/metrics`.
- Monitoramento SSL: varredura de expiração de certificados (plataforma + domínios White Label custom).
- Backup/DR: rotina de backup+teste de restore, relatório de conformidade RPO≤15min/RTO≤1h.
- CI/CD: pipeline build/lint/Jest em PR/push; matriz de auditoria de padrões profissionais (73 critérios).

### Conteúdo / Institucional
- Empresas (`allCompanies`, `allCompaniesPaginated`, `getCompanyById`, `listRandomLogos`, CRUD), Currículos CRUD, Processos Seletivos (`subscribeInSelectiveProcess`, `mySelectiveProcessesSubscribed`, `notifyCandidate`), Blog/Comentários/Depoimentos/Formulários (`createComment`, `subscribeMail`), dashboard admin `statisticsCount`, gestão de roles/usuários JAAS (`allJAASRolesPaginated`, `allJAASUsersPaginated`).
- Admin institucional: autores de blog, membros da equipe, grupos/eventos, moderação de blogs, cursos LMS, planos, mensagens de contato.

### Prioridades de teste (backend)
Gating de auth (público vs autenticado vs role/plano via `can()`/`reveal()`); replay de idempotency-key; dedupe de webhook; rejeição de upload por magic-byte + path traversal; integridade de ranking patrocinado vs orgânico; export/anonimização LGPD; isolamento multi-tenant (White Label); conflitos de lock otimista; preservação de dados em downgrade de entitlement; gates de feature premium (Kanban, Entrevistas, Vagas Confidenciais) retornando `FORBIDDEN` para não-premium; notificação obrigatória em desbloqueio de contato.

---

## 2. Frontend Admin (`frontend/admin`) — Vue 3 + Vuetify + Pinia + Firebase

**⚠️ Achado crítico #1 — guard de autenticação desligado por padrão.** `router/index.ts` só aplica `requiresAuth` se `VITE_ENABLE_AUTH_GUARD === 'true'`. Não existe `.env`/`.env.example` no projeto — logo, **por padrão todas as rotas admin são acessíveis sem login**. Testes E2E devem cobrir os dois cenários (guard ligado/desligado).

**⚠️ Achado crítico #2 — gating de role não é aplicado de fato no client.** O spec (`firebase-auth-frontend-admin`) diz que usuários não-ADMIN/OPERATOR devem ser bloqueados, mas `adminAuth.ts` fixa `role: 'ROLE_ADMIN'` para qualquer usuário autenticado com sucesso, e em erro de Firebase/rede cai para uma **sessão admin local fake** em vez de bloquear. Não há diferenciação de UI admin vs operador em nenhuma das 23 telas.

### Telas / capabilities (23 rotas + login)
- **Auth**: `/login` — e-mail/senha via Firebase, mapeamento de erros (`auth/invalid-email`, `auth/user-not-found`, `auth/wrong-password`/`invalid-credential`, `auth/too-many-requests`, `auth/network-request-failed`), redirect via `?redirect=` ou `/dashboard`, fallback silencioso para sessão local em erro de rede/config.
- **Dashboard** (`/dashboard`): 4 cards de métricas (vagas, empresas, currículos, membros); falhas de API não quebram a página (ficam em 0, sem alerta visível).
- **Acesso/JAAS**: `/users` (CRUD completo, sem campo de role reatribuível apesar do spec dizer o contrário), `/jaas-users` (somente leitura), `/jaas-roles` (criar/deletar, sem editar).
- **Vagas/Recrutamento**: `/jobs` (CRUD completo, `companyId` fixo em 1 — sem seletor de empresa), `/selective-processes` (leitura+delete), `/candidates` (leitura+delete+notificar candidato via dialog), `/companies` (CRUD completo, sem validação de formato de CNPJ), `/resumes` (leitura+delete).
- **Moderação de conteúdo**: `/blogs` (criar+delete, `authorId` numérico manual sem validação), `/authors` (criar+delete), `/social-posts` (somente inspeção de comentários/reações, sem ação de moderar/deletar post), `/testimonials` (criar+delete), `/courses` (somente criar, `instructorId` manual).
- **Comunidade**: `/groups` e `/events` (auditoria somente leitura, zero ações), `/members` — "Equipe Institucional" (criar+delete, campo picture é URL texto, sem upload), `/profiles` (auditoria somente leitura).
- **Plano/Billing**: `/plans` (somente criar — nome, preço, período MONTHLY/YEARLY, créditos InMail/mês); nenhuma UI de gateway/webhook/fatura.
- **Suporte/Mídia**: `/forms` (inbox de suporte, leitura+delete, sem fluxo de resposta/status), `/subscribers` (newsletter, leitura+delete), `/media` (auditoria somente leitura de assets — **sem UI de validação de CPF**, apesar do nome do spec `media-admin-and-cpf-validation-core`; possível gap ou funcionalidade só no backend).
- **i18n**: locales pt-BR/en-US/es-ES existem, mas as telas usam strings PT-BR hardcoded nos templates (não `$t()`) — trocar idioma provavelmente não afeta o conteúdo das páginas, só o chrome do layout.

### Prioridades de teste (admin)
1. Comportamento do auth guard ligado/desligado e do gating de role (hoje inócuo).
2. Inconsistência leitura-only vs CRUD completo por módulo — confirmar que a UI esconde corretamente as ações que não existem.
3. Campos de FK manual (`companyId`, `authorId`, `instructorId`) sem validação referencial — testar IDs inválidos/inexistentes.
4. Efeito (ou ausência de efeito) do switcher de idioma no conteúdo hardcoded.
5. Fallback de login com sessão Firebase dummy — confirmar que só ocorre em dev, nunca em produção.
6. Ausência de fluxo de validação de CPF na tela de mídia — confirmar se está em outro app.

---

## 3. Frontend Client (`frontend/client`) — Vue 3 + Vite + Pinia + Firebase

Stack: cliente GraphQL "na mão" (`src/services/graphql.ts`), i18n pt-BR/en-US/es-ES, guard de rota **também desligado por padrão** (mesmo padrão `VITE_ENABLE_AUTH_GUARD`). 33 views.

### Auth / Onboarding
- **Login** (`/login`): e-mail/senha Firebase + **botões de "Acesso Rápido"** (candidato/empresa) que pulam Firebase e chamam `syncBackendSession` direto com UIDs fixos — testar os dois caminhos. Fallback silencioso para UID `dev-uid-*` em erro de rede/config do Firebase.
- **Registro** (`/register`): nome/e-mail/senha (mín. 6 chars)/role (CANDIDATE/COMPANY). Cadastro de candidato usa **dados de perfil fixos/placeholder** (nascimento 1990-01-01, endereço São Paulo, telefone fake) — gap: sem captura real de perfil no registro.
- Guard de role só em `/post-job` e `/my-jobs` (role COMPANY) — testar bloqueio de não-empresas.
- Sessão em `localStorage` (`workix_token`, `workix_user`).

### Perfil
- `/profile/edit` (maior view, 881 linhas): itens em destaque, currículo markdown.
- `/in/:id` (perfil público): registra visualização (`RecordProfileView`), gated por privacidade.
- `/analytics/views`, `/analytics/ssi`: retenção 12 meses (Premium) vs 7 dias (Free) — verificável só via backend, não pela UI.

### Feed / Social
- `/`, `/feed`: feed social/ranqueado, criar post, reagir, comentar.
- `/hashtag/:tag`: feed por hashtag.
- Endosses/recomendações no perfil.

### Rede / Conexões
- `/mynetwork`: abas todas/pendentes, buscar, aceitar/rejeitar, seguir/deixar de seguir, grau de distância social.

### Mensageria e Notificações
- `/messaging`, `/notifications`: **sem subscription/websocket/polling encontrado** — apesar do spec `messaging-chat-realtime` prometer tempo real, a implementação parece ser apenas request/response. Testar se mensagens/notificações novas aparecem sem refresh manual (provavelmente não aparecem).

### Vagas — lado candidato
- `/jobs`, `/jobs/:id` (com máscara "Empresa Confidencial" quando `isConfidential`), `/my-applications` (via `SubscribeInJob` e via processos seletivos — dois mecanismos distintos, testar que não se confundem), `/post-resume`.

### Empresa / Recrutamento
- `/post-job` (checkbox "Confidencial" com badge PREMIUM — confirmar gating real no servidor), `/my-jobs`, `/candidates`, `/candidates/:id` (gating de `searchable_by_recruiters` sem indicação visual clara de bloqueio/InMail no detalhe do candidato — possível gap), `/kanban/:jobId?` (criar estágio, mover card, avaliar 1-5 estrelas, notas), `/interviews` (abas UPCOMING/PENDING/COMPLETED/CANCELLED; agendar/responder/cancelar).

### Aprendizado (LMS)
- `/learning`, `/learning/:id`, `/learning/:courseId/lesson/:lessonId` — testar matrícula → progressão → conclusão, e bloqueio de player sem matrícula (verificar se realmente bloqueia).

### Grupos e Eventos
- `/groups`, `/groups/:id` (fluxo de aprovação de membership), `/events`, `/events/:id` (RSVP).

### Premium / Monetização
- `/premium`: gating de features calculado no client por faixas de preço (0, <100, >100) — **frágil, testar limites**; nenhuma tela dedicada para vagas patrocinadas (provavelmente embutido em `AllJobsFeatured`).

### Misc
- `/blog`, `/blog/:id`, `/team`, `/contact` (formulário via `CreateForm`), upload de mídia (URL presignada + confirmação), `ValidateCPF` (localizar ponto de uso no fluxo de contratação).

### Prioridades de teste (client)
1. Guard de auth inerte por padrão — suíte E2E deve setar `VITE_ENABLE_AUTH_GUARD=true` explicitamente.
2. Gaps de tempo real em mensageria/notificações — decidir se o comportamento atual (sem live update) é o esperado ou um bug.
3. Vagas confidenciais / privacidade de candidato / desbloqueio de contato — validar através do fluxo completo (candidatar → ver detalhe → desbloquear contato → notificação).
4. Gating premium calculado por faixa de preço no client — fonte provável de flakiness.
5. Dados placeholder no registro de candidato — qualquer asserção de dados reais pós-registro deve considerar isso.

---

## 4. App Android (`android/app`) — Kotlin, Views/XML (sem Compose)

**⚠️ Nenhum teste instrumentado existe hoje.** `build.gradle` declara Espresso/AndroidJUnit, mas não há pasta `androidTest/` em lugar nenhum — só testes JVM unitários (`JobRepositoryTest`, `JobGraphQLTest`, etc). Uma suíte E2E Android começará do zero.

### Achado crítico — navegação real é muito mais estreita que o código-fonte
`MainActivity` monta a `BottomNavigationView` programaticamente com **apenas 4 itens**: Início, Vagas, Candidatos, Blog. Isso bate com o spec `android-auth-navigation` e o inventário legado de 12 telas do `ANDROID_MIGRATION_PROGRESS.md`.

Porém a árvore `ui/` contém muitas telas adicionais (feed social, chat, conexões, grupos, eventos, cursos, notificações, premium, kanban, entrevistas) que **não são chamadas de lugar nenhum** exceto entre si — nenhum caller externo encontrado. `RecruitmentKanbanActivity` e `InterviewsActivity` **nem sequer estão declaradas no `AndroidManifest.xml`** (só 19 `<activity>` no total).

### Tier A — Fluxos alcançáveis hoje (testáveis via navegação normal)
- **LoginActivity** (launcher): e-mail/senha Firebase → sessão via `SessionManager`. Testar credenciais inválidas, sem rede, bypass automático se sessão já existe.
- **RegisterActivity**: candidato/empresa, Firebase + GraphQL, auto-login.
- **MainActivity**: shell pós-login, guarda contra sessão ausente.
- **HomeFragment**: dashboard (vagas destaque, banner de blog, métricas).
- **JobsListFragment → JobDetailActivity**: busca paginada, badges PCD/remoto, candidatura autenticada (`subscribeJob`).
- **PostJobActivity** (empresa): criar vaga com campos PCD/remoto.
- **CandidatesListFragment → CandidateDetailActivity**: listagem paginada, currículo markdown.
- **PostResumeActivity** (candidato): editar currículo.
- **CompanyDetailActivity**: perfil público de empresa.
- **BlogListFragment → BlogPostActivity**: listagem/detalhe, comentários.
- **ProfileActivity → EditProfileActivity**: único par "novo" com navegação confirmada.

### Tier B — Implementado mas sem ponto de entrada confirmado (gap)
SocialFeedFragment/PostDetailActivity, ChatListFragment/DirectChatActivity, ConnectionsFragment, NotificationsFragment, GroupsFragment/GroupDetailActivity, EventsFragment/EventDetailActivity, CoursesFragment/LessonPlayerActivity, PremiumPlansActivity, MyApplicationsFragment, TeamFragment/ContactActivity, ProfileAnalyticsActivity, RecruitmentKanbanActivity, InterviewsActivity (estas duas últimas nem no manifest).

**Recomendação**: marcar cada tela Tier B como "implementada, não integrada" — gap real vs. o spec `frontend-android-parity-survey`, que afirma paridade de feed/chat/notificações/perfil.

### Push Notifications (FCM)
`MyFirebaseMessagingService` cria notificação nativa com `PendingIntent` para `MainActivity`. **`onNewToken` é um stub — o token renovado nunca é enviado ao backend**, gap funcional real. Sem pedido de permissão `POST_NOTIFICATIONS` (Android 13+) encontrado.

### Sessão / Auth cross-cutting
`SessionManager` + `AuthInterceptor` (Bearer token automático); `ConnectivityReceiver` para modo offline; `NetworkResult` (Success/Error/Loading) uniforme nos ViewModels — bom hook para asserts de loading/erro em testes de UI. Fluxo de logout não confirmado no bottom nav de 4 abas (provavelmente dentro de `ProfileActivity`).

### i18n
`values-pt-rBR`, `values-en`/`values-en-rUS`, `values-es` existem; confirmar entry point do seletor de idioma (spec cita `LocaleHelper`).

### Prioridades de teste (Android)
1. Suíte de auth (login/registro/persistência de sessão/logout).
2. Navegação central (as 4 abas reais).
3. Vagas (busca, badges PCD/remoto, candidatura, postar vaga).
4. Candidatos/currículo.
5. Empresa, Blog.
6. FCM (exibição, deep link, canal O+, permissão 13+).
7. Conectividade/offline.
8. i18n.
9. Suíte "gap" Tier B — escrever como pending/skipped até a navegação ser corrigida (ou via `adb shell am start` direto na Activity como workaround, exceto Kanban/Interviews que precisam antes ser declaradas no manifest).

---

## 5. Achados transversais (para priorização geral do plano de E2E)

1. **Guard de autenticação desligado por padrão** em ambos os frontends web (admin e client) — a suíte E2E precisa fixar `VITE_ENABLE_AUTH_GUARD=true` explicitamente ou os testes de segurança passam "por acidente".
2. **Gating de role/plano inconsistente entre camadas**: o client (Vue) mostra badges de "premium" mas a aplicação real da regra depende do backend (`can()`/`reveal()`); o admin não aplica role nenhuma de fato. Testes devem validar a fronteira real (resposta do servidor), não só a UI.
3. **Tempo real prometido, não implementado**: mensageria e notificações não têm subscription/polling nem no client nem indicação de WebSocket ativo na tela — mas o backend expõe schema/spec de tempo real. Decidir com o time se isso é um bug a corrigir antes dos testes ou um comportamento aceito.
4. **Paridade Android incompleta**: metade das telas "novas" (feed, chat, grupos, eventos, cursos, premium, kanban, entrevistas) existem no código mas não são alcançáveis pela navegação — Kanban e Entrevistas nem estão no manifest.
5. **`workix-frontend-vue` fora de escopo**: mockado, estático, sem backend real conectado.
6. **Cadastro com dados placeholder** (client web) e **campos de FK manuais sem validação** (admin) são fontes previsíveis de dados de teste inconsistentes — a suíte de E2E deve gerar massa de dados própria em vez de depender de dados "reais" pós-cadastro.

---

## 6. Estrutura sugerida do backlog de testes E2E (por app)

- **Backend**: testes de contrato/API (Playwright/Supertest contra GraphQL) cobrindo auth, gating de planos/roles, idempotência, upload seguro, LGPD, multi-tenant.
- **Admin (Vue)**: Playwright/Cypress cobrindo os 23 módulos, com guard ligado e desligado, focando nos gaps de CRUD incompleto e FK sem validação.
- **Client (Vue)**: Playwright/Cypress cobrindo os fluxos de candidato e empresa ponta a ponta (cadastro → perfil → busca de vaga → candidatura → mensagens/notificações → premium).
- **Android**: Espresso (criar `androidTest/` do zero) cobrindo Tier A primeiro; Tier B como testes "pending" documentando o gap de navegação.
- **workix-frontend-vue**: opcional, smoke-test de UI estática, fora do plano principal.
