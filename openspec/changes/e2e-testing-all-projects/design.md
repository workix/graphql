## Context

O ecossistema Workix compreende múltiplos projetos com diferentes pilhas tecnológicas:
1. **Backend** (`workix-graphql`): Node.js 18+, TypeScript, Express, GraphQL (Apollo Server / express-graphql), Sequelize ORM com SQLite (`database_test.sqlite`), WebSocket/PubSub, Dataloaders e autenticação JAAS/JWT.
2. **Frontend Cliente** (`frontend/client`): Vue 3, Vite, Pinia, Vue Router, Axios, Vitest.
3. **Frontend Admin** (`frontend/admin`): Vue 3, Vuetify 3, Vite, Pinia, Vue Router, Axios, Vitest.
4. **App Android** (`android`): Kotlin, Android SDK 34, AndroidX, ViewBinding, ViewModel/LiveData, Navigation Component, Apollo GraphQL Client 3, Retrofit, JUnit 4, Espresso.

O objetivo mandatório desta iniciativa é garantir **100% de cobertura de testes E2E** dos módulos de negócio, jornadas de usuário e superfícies públicas em todos os 4 pilares do sistema.

## Goals / Non-Goals

**Goals:**
- Implementar suíte E2E no backend (`tests/e2e/`) cobrindo 100% dos 36 módulos de negócio com `supertest` e queries/mutations GraphQL completas em banco determinístico (`database_test.sqlite`).
- Implementar suíte E2E no frontend cliente (`frontend/client/src/__tests__/e2e/`) validando 100% das rotas e jornadas do candidato (login, catálogo de vagas, filtros, candidatura, acompanhamento, networking, feed social e player de cursos).
- Implementar suíte E2E no frontend administrativo (`frontend/admin/src/__tests__/e2e/`) validando 100% das rotas e telas de gestão administrativa (autenticação, usuários/JAAS, empresas, moderação de vagas, Kanban corporativo, planos e métricas).
- Implementar testes de instrumentação E2E no app Android (`android/app/src/androidTest/`) usando Espresso e ActivityScenario para testar 100% das telas e fluxos principais (login, home/feed de vagas, busca/filtros, detalhes e submissão de candidatura).
- Criar scripts de execução unificada no `package.json` para rodar todas as suítes de testes E2E com facilidade no ambiente Windows e relatar métricas de sucesso.

**Non-Goals:**
- Substituir testes unitários (os testes unitários continuam existindo de forma complementar aos testes E2E).
- Dependência de servidores em nuvem de terceiros durante a execução de testes locais.

## Decisions

### 1. Estrutura Modular da Suíte E2E do Backend (100% de Módulos)
- **Decisão**: Dividir a suíte do backend em arquivos especializados cobrindo grupos funcionais de módulos:
  - `auth_jaas.e2e.spec.ts`: Autenticação, Tokens JWT, Refresh, JAAS Roles e Permissões.
  - `jobs_candidates_applications.e2e.spec.ts`: Criação de vagas, currículos, busca multifacetada, filtros e candidaturas.
  - `recruitment_kanban_interviews.e2e.spec.ts`: Kanban, transição de fases de processos seletivos e entrevistas.
  - `messaging_notifications_social.e2e.spec.ts`: Mensageria, notificações, posts, comentários, eventos e grupos.
  - `learning_media_whitelabel_governance.e2e.spec.ts`: Cursos, uploads de mídia, parametrização white-label e formulários.
- **Justificativa**: Garante rastreabilidade clara de cada um dos 36 módulos com execução rápida sobre `database_test.sqlite`.

### 2. Frontend Web E2E com Vitest + Vue Router + Stores Reais
- **Decisão**: Simular a montagem de aplicação completa em memória com Vue Test Utils, instâncias reais de Pinia e Vue Router com guardas de autenticação ativadas e mock da camada de transporte HTTP/GraphQL.
- **Justificativa**: Valida 100% das transições de tela, renderização condicional de componentes, despacho de actions e armazenamento de tokens de sessão sem flakiness de timing de rede.

### 3. Android E2E com Espresso e AndroidJUnitRunner
- **Decisão**: Implementar testes instrumentados no módulo `android/app/src/androidTest` utilizando `ActivityScenario`, `Espresso` (`onView`, `perform`, `check`, `matches`), e `AndroidJUnitRunner`.
- **Justificativa**: É o padrão oficial do ecossistema Android para validação de layout, interação de toque, digitação e transições de tela.

### 4. Orquestração Unificada de Scripts
- **Decisão**: Adicionar comandos no `package.json` raiz (`npm run test:e2e`, `npm run test:e2e:backend`, `npm run test:e2e:frontend`, `npm run test:e2e:all`).
- **Justificativa**: Facilita a execução com um único comando por qualquer desenvolvedor ou agente.

## Risks / Trade-offs

- **[Risco: Estado residual de banco afetando testes subsequentes]** → *Mitigação*: Reset e truncamento de tabelas determinístico no `beforeEach`/`afterEach` dos testes E2E do backend.
- **[Risco: Conflitos de tipagem de bibliotecas no TypeScript]** → *Mitigação*: Manter tipos estritos configurados no `tsconfig.json` e tipar payloads de GraphQL e respostas REST.
- **[Risco: Tempo elevado de execução dos testes]** → *Mitigação*: Utilização de SQLite em memória/arquivo rápido e testes paralelizáveis sem timeouts excessivos.
