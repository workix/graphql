## Why

Atualmente, o ecossistema Workix é composto por múltiplos projetos interdependentes: o backend GraphQL/REST (`workix-graphql`), as interfaces web (`workix-frontend-client` e `workix-admin-frontend`) e o aplicativo móvel nativo (`android`). Embora existam testes unitários e de serviços isolados, há uma lacuna crítica na cobertura de testes ponta a ponta (End-to-End / E2E). 

O usuário estabeleceu a exigência mandatória de **100% de cobertura nos testes E2E** em todos os projetos. Esta mudança formaliza e estrutura a suíte de testes E2E com cobertura total de todos os módulos de negócio, fluxos de usuário, rotas, operações GraphQL (queries, mutations, subscriptions), interfaces administrativas e telas do aplicativo Android nativo.

## What Changes

- **Backend E2E Testing Suite (100% de Cobertura de Módulos)**: Implementação de suíte de testes E2E no backend (`workix-graphql`) cobrindo 100% dos 36 módulos de negócio (Autenticação/JAAS, Vagas, Candidatos, Currículos, Processos Seletivos, Kanban de Recrutamento, Mensageria em Tempo Real, Notificações, Feed Social, Cursos/Learning, Mídia, Governança, White-Label e Analytics) via GraphQL e rotas REST utilizando banco SQLite isolado e determinístico.
- **Frontend Client E2E Testing Suite (100% de Cobertura de Rotas e Jornadas)**: Implementação de testes E2E no `frontend/client` cobrindo 100% das rotas e jornadas do candidato e empresa (autenticação, catálogo de vagas, busca/filtros, candidatura, gestão de currículos, processos ativos, feed social, networking, chat, analytics e cursos).
- **Frontend Admin E2E Testing Suite (100% de Cobertura Administrativa)**: Implementação de testes E2E no `frontend/admin` cobrindo 100% das rotas e telas de governança corporativa (login administrativo, dashboard, gestão de usuários/JAAS, moderação de empresas e vagas, Kanban de processos seletivos, planos, cursos, formulários e métricas).
- **Android App E2E Instrumentation Testing Suite (100% de Cobertura de Telas e Fluxos Críticos)**: Implementação de testes instrumentados E2E com Espresso e AndroidJUnit no projeto `android`, cobrindo 100% das telas principais e fluxos do aplicativo (login/cadastro, feed de vagas, pesquisa com filtros, detalhes da vaga, submissão de candidatura, perfil e resiliência de rede).
- **Automação e Scripts de Execução Unificada com Verificação de Cobertura**: Criação de scripts no `package.json` raiz para execução e validação da cobertura total de testes E2E.

## Capabilities

### New Capabilities
- `e2e-testing-backend-core`: Cobertura E2E de 100% dos módulos do backend GraphQL/REST (autenticação, vagas, candidaturas, processos seletivos, kanban, mensageria, learning, whitelabel e analytics).
- `e2e-testing-frontend-client`: Suíte de testes E2E com cobertura total das jornadas e rotas do portal do cliente/candidato (`workix-client-frontend`).
- `e2e-testing-frontend-admin`: Suíte de testes E2E com cobertura total das jornadas administrativas e operacionais (`workix-admin-frontend`).
- `e2e-testing-android-app`: Suíte de testes instrumentados E2E cobrindo todas as telas e fluxos essenciais do aplicativo Android nativo (`android`).

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- **Código Afetado**:
  - `tests/e2e/` no backend `workix-graphql` com cobertura total dos módulos
  - `frontend/client/src/__tests__/e2e/` cobrindo todos os fluxos de rotas e componentes
  - `frontend/admin/src/__tests__/e2e/` cobrindo todas as telas administrativas e fluxos de gestão
  - `android/app/src/androidTest/java/br/com/codecode/workix/android/` para testes instrumentados Espresso
  - Scripts no `package.json` raiz e submódulos para execução unificada com verificação de integridade
- **Dependências**:
  - Backend: `supertest` e utilitários de teste GraphQL com banco SQLite isolado (`database_test.sqlite`)
  - Frontends: Vitest + Vue Test Utils + Pinia + Vue Router com interceptação determinística de rede
  - Android: `androidx.test.espresso` e `androidx.test.ext:junit`
