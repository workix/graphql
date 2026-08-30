## Context

Nesta Fase 3, construímos as views e componentes completos do **Frontend do Cliente** (`frontend/client`), garantindo a preservação total da identidade visual do Jobseek Design Spec (`frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template`) e integrando todas as chamadas de API reais.

## Goals / Non-Goals

**Goals:**
- Criar componentes base reutilizáveis (`TheHeader.vue`, `TheFooter.vue`, `JobCard.vue`, `CandidateCard.vue`, `Pagination.vue`, `LoadingOverlay.vue`).
- Implementar as views de Autenticação (`LoginView.vue`, `RegisterView.vue`).
- Implementar as views de Vagas (`HomeView.vue`, `JobsListView.vue`, `JobDetailView.vue`, `PostJobView.vue`).
- Implementar as views de Currículos e Talentos (`CandidatesListView.vue`, `CandidateDetailView.vue`, `PostResumeView.vue`).
- Implementar a view de Perfil da Empresa (`CompanyDetailView.vue`).
- Implementar o Portal de Notícias/Blog (`BlogListView.vue`, `BlogPostView.vue`).
- Integrar os formulários com os serviços de API Axios em `src/services/jobs.ts`, `src/services/resumes.ts`, `src/services/auth.ts`, `src/services/blogs.ts`.

**Non-Goals:**
- As telas exclusivas do painel administrativo (Vuetify 3) serão implementadas na Fase 4.

## Decisions

- **Decisão 1: Componentização Modular Vue 3 SFC**:
  Modularizar o HTML do Jobseek em componentes SFC reutilizáveis, mantendo os seletores CSS originais intactos para preservar os estilos `style.css` e `bootstrap.css`.

- **Decisão 2: Pinia Store para Vagas e Currículos**:
  Criar `useJobsStore` e `useResumesStore` para armazenar o estado das pesquisas e evitar recarregamentos desnecessários ao navegar entre a listagem e os detalhes.

## Risks / Trade-offs

- [Integração de JavaScript legado do Jobseek] → O template original usa jQuery para alguns plugins. *Mitigação*: Substituir animações e seletores dinâmicos por reatividade nativa do Vue 3 (`ref`, `computed`, `v-model`), preservando as classes de estilo CSS.
