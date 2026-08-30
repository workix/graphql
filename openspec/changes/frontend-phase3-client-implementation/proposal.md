## Why

Após concluir a análise (Fase 1) e a estruturação física da arquitetura dos frontends (Fase 2), é necessário implementar todas as views e componentes visuais do **Frontend do Cliente** (`frontend/client`), reproduzindo 100% da identidade visual do Design Spec Jobseek (`frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template`) e integrando a aplicação às APIs reais do backend (REST/GraphQL).

## What Changes

- **Componentes Visuais Reutilizáveis do Cliente**:
  - `TheHeader.vue`: Header com topo, navegação principal e status do usuário.
  - `TheFooter.vue`: Footer institucional e links rápidos.
  - `JobCard.vue`: Card visual de vagas de emprego.
  - `CandidateCard.vue`: Card visual de candidatos/currículos.
  - `Pagination.vue`, `LoadingOverlay.vue`, `ErrorAlert.vue`.
- **Views do Cliente (Design Spec Jobseek + Integração Backend)**:
  - `HomeView.vue`: Página inicial com busca de vagas, destaques, contador de estatísticas e depoimentos.
  - `LoginView.vue` e `RegisterView.vue`: Telas de login e cadastro integradas a `/auth/login` e `/users`.
  - `JobsListView.vue`: Listagem de vagas com filtros por tipo, localização e busca com paginação server-side (`/jobs/paginated`).
  - `JobDetailView.vue`: Detalhes da vaga com formulário de candidatura (`/jobs/subscribe`).
  - `PostJobView.vue`: Formulário de publicação de vaga para empresas (`/jobs`).
  - `CandidatesListView.vue`: Listagem de currículos e talentos (`/resumes/list_with_candidates_short_paginated`).
  - `CandidateDetailView.vue`: Detalhes do currículo e perfil do candidato (`/resumes/:id`).
  - `PostResumeView.vue`: Formulário de envio/edição de currículo para candidatos (`/resumes`).
  - `CompanyDetailView.vue`: Perfil da empresa com lista de vagas publicadas (`/companies/:id`).
  - `BlogListView.vue` e `BlogPostView.vue`: Portal de notícias/artigos com comentários (`/blogs`, `/comments`).

## Capabilities

### New Capabilities
- `frontend-client-implementation`: Implementação completa e integração do portal do cliente em Vue 3 respeitando o Design Spec Jobseek e integrando às APIs reais do backend.

### Modified Capabilities

Nenhuma capacidade existente foi modificada.

## Impact

- **Código**: Criação e atualização de componentes em `frontend/client/src/components/`, `frontend/client/src/views/` e `frontend/client/src/services/`.
- **Interface**: O portal do cliente torna-se 100% funcional e interativo para visitantes, candidatos e empresas.
