## Context

O módulo de Vagas (`Jobs`) é a principal entidade do sistema. O backend expõe:
- Queries: `allJobs`, `allJobsPaginated(limit, offset, ...)` , `getJobById(id)`, `allJobsFeatured`, `listJobRandomFeatured`, `myJobs`.
- Mutations: `createJob(input)`, `updateJob(id, input)`, `deleteJob(id)`, `subscribeInJob(input)`.

As telas de vagas no Cliente (`frontend/client`) devem seguir o design do template Jobseek (classes CSS `jobs`, `job-post`, filtros laterais). No Admin (`frontend/admin`), a gestão utiliza componentes Vuetify (`v-data-table`, `v-dialog`, `v-form`). No Android (`android/`), as telas utilizam RecyclerView/Compose com `JobViewModel` e consumo via `ApiClient`.

Veja `proposal.md` para motivação e justificativas.

## Goals / Non-Goals

**Goals:**
- Implementar a camada de serviço `jobService` em `frontend/client` e `frontend/admin` com operações tipadas para Jobs.
- Implementar as views de vagas no Cliente: `JobsView.vue`, `JobDetailView.vue`, e componente de candidatura.
- Implementar a view de gestão de vagas no Admin: `AdminJobsView.vue` com CRUD e paginação reativa.
- Implementar a tela de vagas no Android (`JobListFragment` / `JobDetailFragment` ou Compose equivalente).
- Garantir que todos os estados visuais (loading, empty state, erro de rede, sucesso de candidatura) funcionem sem mocks.

**Non-Goals:**
- Não implementar outros módulos como Blog, Testimonials ou JAAS nesta etapa (escopo da Etapa 4).

## Decisions

### 1. Separação em Camada de Serviço e Store
- **Decisão**: Criar `src/services/jobs.service.ts` e `src/stores/jobs.store.ts` no frontend web, desacoplando a query GraphQL dos componentes Vue.
- **Alternativas consideradas**: Executar queries diretamente dentro do `setup()` dos componentes Vue; descartado para manter manutenibilidade e reutilização.

### 2. Tratamento de Paginação Unificada
- **Decisão**: Utilizar `limit` e `offset` (ou paginação baseada em página atual e tamanho da página) convertendo para os argumentos aceitos por `allJobsPaginated`.

### 3. Reatividade de Dados após Mutations
- **Decisão**: Após a execução com sucesso de `createJob`, `updateJob` ou `deleteJob`, a store dispara automaticamente a reconsulta ou atualiza a lista local de forma otimista.

## Risks / Trade-offs

- [Risco: Estrutura do objeto Job no GraphQL conter relacionamentos (ex: Company, Category)] ➔ Mitigação: Declarar fragments GraphQL com os campos necessários (`id, title, description, salary, company { id, name, logo }, createdAt`).
