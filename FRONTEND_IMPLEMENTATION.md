# Documentação de Implementação dos Frontends

Este documento é a fonte central de arquitetura, inventário de funcionalidades e progresso da implementação dos dois frontends da aplicação:
1. **Frontend do Cliente**: `frontend/client` (Vue 3 + Vite + CSS Jobseek Design Spec)
2. **Frontend Administrativo**: `frontend/admin` (Vue 3 + Vite + Vuetify 3)

---

## 1. Arquitetura dos Frontends

### 1.1 Frontend do Cliente (`frontend/client`)
- **Framework**: Vue 3 (Composition API com `<script setup>`) + Vite
- **Estilização**: Preservação 100% do CSS e assets de `frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template`
- **Roteamento**: Vue Router 4 (rotas públicas e protegidas por perfil de candidato/empresa)
- **Gerenciamento de Estado**: Pinia (`useAuthStore`, `useJobsStore`, `useResumesStore`)
- **Comunicação Backend**: Client HTTP centralizado em `src/services/api.ts` (suporte a JWT token)

### 1.2 Frontend Administrativo (`frontend/admin`)
- **Framework**: Vue 3 (Composition API) + Vite + **Vuetify 3**
- **UI System**: Componentes do Vuetify (`v-app`, `v-navigation-drawer`, `v-app-bar`, `v-data-table`, `v-dialog`, `v-snackbar`, `v-form`)
- **Roteamento**: Vue Router 4 com guards de perfil `ROLE_ADMIN` / `ROLE_OPERATOR`
- **Gerenciamento de Estado**: Pinia (`useAdminAuthStore`, `useAdminUsersStore`, `useAdminJobsStore`)
- **Comunicação Backend**: Client HTTP centralizado em `src/services/api.ts`

---

## 2. Inventário Completo de Funcionalidades (Backend x Views)

| Módulo | Funcionalidade | API / GraphQL | Método / Operação | View Correspondente | Permissão | Status |
|---|---|---|---|---|---|---|
| **Autenticação** | Login Usuário/Empresa/Candidato | `/auth/login` | POST / `doLogin` | `LoginView.vue` | Pública | ⏳ Pendente |
| **Autenticação** | Registro de Usuário | `/users` | POST / `createUser` | `RegisterView.vue` | Pública | ⏳ Pendente |
| **Autenticação** | Dados do Perfil Autenticado | `/auth/me` | GET / `aboutMe` | Componente Header / Store | Autenticado | ⏳ Pendente |
| **Cliente** | Home / Portal de Vagas | `/jobs/random_featured`, `/statistics` | GET / `listJobRandomFeatured` | `HomeView.vue` (index.html) | Pública | ⏳ Pendente |
| **Cliente** | Listagem de Vagas | `/jobs`, `/jobs/paginated` | GET / `allJobsPaginated` | `JobsListView.vue` (jobs.html) | Pública | ⏳ Pendente |
| **Cliente** | Detalhes da Vaga | `/jobs/:id` | GET / `getJobById` | `JobDetailView.vue` (job-details.html) | Pública | ⏳ Pendente |
| **Cliente** | Criar/Publicar Vaga | `/jobs`, `/vue/create_or_update_job_by_token` | POST / `createJob` | `PostJobView.vue` (post-a-job.html) | Empresa | ⏳ Pendente |
| **Cliente** | Candidatar-se à Vaga | `/jobs/subscribe` | POST / `subscribeInJob` | `JobDetailView.vue` | Candidato | ⏳ Pendente |
| **Cliente** | Listagem de Currículos | `/resumes`, `/resumes/list_with_candidates_short_paginated` | GET / `allResumesPaginated` | `CandidatesListView.vue` (candidates.html) | Empresa | ⏳ Pendente |
| **Cliente** | Detalhes do Currículo | `/resumes/:id` | GET / `getResumeById` | `CandidateDetailView.vue` (resume.html) | Empresa | ⏳ Pendente |
| **Cliente** | Criar/Editar Currículo | `/resumes`, `/vue/create_or_update_resume_by_token` | POST/PUT / `createResume` | `PostResumeView.vue` (post-a-resume.html) | Candidato | ⏳ Pendente |
| **Cliente** | Perfil da Empresa | `/companies/:id` | GET / `getCompanyById` | `CompanyDetailView.vue` (company.html) | Pública | ⏳ Pendente |
| **Cliente** | Processos Seletivos (Minhas Inscrições) | `/selectiveprocesses/my_selective_processes_subscribed` | GET / `mySelectiveProcessesSubscribed` | `MyApplicationsView.vue` | Candidato | ⏳ Pendente |
| **Cliente** | Processos Seletivos (Meus Processos - Empresa) | `/selectiveprocesses/my_selective_processes` | GET / `mySelectiveProcesses` | `CompanyProcessesView.vue` | Empresa | ⏳ Pendente |
| **Cliente** | Blog - Notícias e Artigos | `/blogs`, `/blogs/paginated` | GET / `allBlogsPaginated` | `BlogListView.vue` (blog.html) | Pública | ⏳ Pendente |
| **Cliente** | Blog - Leitura do Post e Comentários | `/blogs/:id`, `/comments` | GET/POST / `getBlogById`, `createComment` | `BlogPostView.vue` (post.html) | Pública/Autenticado | ⏳ Pendente |
| **Admin** | Dashboard com Estatísticas | `/statistics` | GET / `statisticsCount` | `AdminDashboardView.vue` | Admin | ⏳ Pendente |
| **Admin** | Gestão de Usuários (CRUD) | `/users`, `/users/:id` | GET/POST/PUT/DELETE / `allUsers`, `updateUser` | `AdminUsersView.vue` | Admin | ⏳ Pendente |
| **Admin** | Gestão de Usuários JAAS (CRUD) | `/jaasusers`, `/jaasusers/:id` | GET/POST/PUT/DELETE / `allJAASUsers` | `AdminJAASUsersView.vue` | Admin | ⏳ Pendente |
| **Admin** | Gestão de Perfis/Roles JAAS | `/jaasroles`, `/jaasroles/:id` | GET/POST/PUT/DELETE / `allJAASRoles` | `AdminJAASRolesView.vue` | Admin | ⏳ Pendente |
| **Admin** | Moderação de Vagas | `/jobs`, `/jobs/:id` | GET/PUT/DELETE / `allJobs`, `deleteJob` | `AdminJobsView.vue` | Admin | ⏳ Pendente |
| **Admin** | Gestão de Empresas | `/companies`, `/companies/:id` | GET/PUT/DELETE / `allCompanies` | `AdminCompaniesView.vue` | Admin | ⏳ Pendente |
| **Admin** | Gestão de Candidatos | `/candidates`, `/candidates/:id` | GET/PUT/DELETE / `getAllCandidates` | `AdminCandidatesView.vue` | Admin | ⏳ Pendente |
| **Admin** | Moderar Depoimentos/Testemunhos | `/testimonials`, `/testimonials/:id` | GET/POST/PUT/DELETE / `allTestimonials` | `AdminTestimonialsView.vue` | Admin | ⏳ Pendente |
| **Admin** | Gestão de Inscrições na Newsletter | `/subscribers` | GET/DELETE / `allSubscribers` | `AdminSubscribersView.vue` | Admin | ⏳ Pendente |

---

## 3. Planejamento de Propostas OpenSpec (/opsx-propose em Baby Steps)

O desenvolvimento será executado de forma totalmente modular e incremental em 5 propostas atômicas:

1. **`frontend-phase1-analysis-mapping`** (Concluído)
   - Levantamento de APIs e Design Spec.
   - Criação da especificação de arquitetura e do arquivo `FRONTEND_IMPLEMENTATION.md`.

2. **`frontend-phase2-setup-architecture`** (Concluído)
   - Setup dos diretórios `frontend/client` e `frontend/admin` com Vue 3 + Vite.
   - Configuração do Vuetify 3 no painel administrativo.
   - Configuração de Vue Router, Pinia stores, serviços HTTP/Axios e tratamento de variáveis de ambiente.

3. **`frontend-phase3-client-implementation`** (Concluído)
   - Implementação das views e componentes do **Frontend do Cliente** baseado no template Jobseek.
   - Integração das chamadas de API do Cliente (Vagas, Currículos, Empresas, Inscrições, Blog).

4. **`frontend-phase4-admin-implementation`** (Concluído)
   - Implementação das views e componentes do **Frontend Administrativo** utilizando Vuetify 3.
   - Integração das chamadas de API Administrativas (Usuários, JAAS, Vagas, Moderação, Estatísticas).

5. **`frontend-phase5-audit-docs-build`** (Próxima etapa)
   - Tratamento final de estados (Loading, Sucesso, Erro, Vazio) e formulários com validação.
   - Auditoria de cobertura das rotas e regras de negócio.
   - Build final de produção para ambos os frontends.
