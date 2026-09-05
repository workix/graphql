# Proposta: Cobertura Completa de Testes Unitários para os Frontends Web (Client e Admin)

## Objetivo

Implementar uma infraestrutura robusta e moderna de testes unitários baseada em **Vitest** e **@vue/test-utils** para ambos os frontends da plataforma Workix (`frontend/client` e `frontend/admin`), criando testes unitários exaustivos para stores (Pinia), serviços de comunicação de rede (GraphQL e REST), utilitários e componentes de interface, com commits individuais em *baby steps* arquivo por arquivo.

## Motivação & Contexto

Com a consolidação do Backend (538 testes unitários passando) e do Aplicativo Android (testes de rede e repositório passando), é fundamental garantir que as camadas de apresentação web possuam igual nível de confiabilidade e blindagem contra regressões. Os frontends Web Cliente e Web Admin contêm lógica crítica de autenticação com JWT/Firebase, gerenciamento de estado de vagas, currículos, formulários de perfil, kanban de recrutamento, agendamento de entrevistas, planos premium, mídias e moderação de painéis administrativos.

## Escopo

1. **Configuração de Infraestrutura de Testes**:
   - Adicionar `vitest`, `@vue/test-utils`, `jsdom` (ou `happy-dom`), `@vitest/coverage-v8` aos `devDependencies` de `frontend/client` e `frontend/admin`.
   - Configurar `vitest.config.ts` com ambiente DOM, aliases e mocks globais de navegador/storage.
   - Adicionar scripts `"test"` e `"test:coverage"` em ambos os `package.json`.

2. **Frontend Web Cliente (`frontend/client`)**:
   - Testes unitários para Stores: `auth.ts`, etc.
   - Testes unitários para Serviços: `api.ts`, `media.service.ts`, `jobs.service.ts`, `resumes.service.ts`, `posts.service.ts`, `messaging.service.ts`, `learning.service.ts`, `analytics.service.ts`, `events.service.ts`, `groups.service.ts`, `testimonials.service.ts`, `authors.service.ts`, etc.
   - Testes unitários para Componentes: `JobCard.vue`, `PostCard.vue`, `LoadingOverlay.vue`, `Pagination.vue`, `TheFooter.vue`, etc.

3. **Frontend Web Admin (`frontend/admin`)**:
   - Testes unitários para Stores: `auth.ts`, etc.
   - Testes unitários para Serviços: `adminApi.ts`, `mediaAdmin.service.ts`, `jobs.service.ts`, `resumes.service.ts`, `companies.service.ts`, `users.service.ts`, `jaas.service.ts`, `plans.service.ts`, `selectiveProcesses.service.ts`, `stats.service.ts`, `forms.service.ts`, `courses.service.ts`, `events.service.ts`, `blogs.service.ts`, etc.
   - Testes unitários para Layouts e Componentes administrativos.

4. **Integração no CI/CD**:
   - Atualizar `.github/workflows/ci.yml` para executar `npm test` em ambos os frontends durante as execuções de CI.

5. **Execução Incremental**:
   - Implementação em baby steps, commitando arquivo por arquivo com autor configurado.
