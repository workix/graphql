## Why

Após implementar e integrar o Frontend do Cliente na Fase 3, é necessário desenvolver o **Frontend Administrativo** (`frontend/admin`) utilizando integralmente a biblioteca **Vuetify 3** (Material Design), permitindo a gestão, moderação e administração de usuários, permissões JAAS, vagas, empresas, candidatos, estatísticas e depoimentos através de dashboards modernos e tabelas ricas (`v-data-table`).

## What Changes

- **Layout e Estrutura Vuetify 3 (`frontend/admin`)**:
  - `AdminLayout.vue`: Layout mestre com `v-app-bar`, `v-navigation-drawer`, menu lateral com ícones MDI e perfil do usuário logado.
- **Views do Painel Administrativo (Vuetify 3 + APIs Backend)**:
  - `AdminLoginView.vue`: Tela de login administrativo para gestores e operadores.
  - `AdminDashboardView.vue`: Painel principal com estatísticas (`/statistics`) em cards visuais (`v-card`).
  - `AdminUsersView.vue`: Gestão CRUD de Usuários (`/users`) em `v-data-table` com modais de adição/edição (`v-dialog`).
  - `AdminJAASUsersView.vue` e `AdminJAASRolesView.vue`: Gestão de usuários e permissões JAAS (`/jaasusers`, `/jaasroles`).
  - `AdminJobsView.vue`: Moderação de vagas publicadas (`/jobs`), aprovação e exclusão.
  - `AdminCompaniesView.vue`: Gestão de empresas parceiras e logos (`/companies`).
  - `AdminCandidatesView.vue`: Moderação de candidatos e currículos (`/candidates`, `/resumes`).
  - `AdminTestimonialsView.vue`: Moderação de testemunhos (`/testimonials`).
  - `AdminSubscribersView.vue`: Gestão de inscritos na newsletter (`/subscribers`).

## Capabilities

### New Capabilities
- `frontend-admin-implementation`: Implementação do painel administrativo funcional com Vuetify 3 integrado às APIs administrativas do backend.

### Modified Capabilities

Nenhuma capacidade existente foi modificada.

## Impact

- **Código**: Criação de componentes em `frontend/admin/src/layouts/`, `frontend/admin/src/views/` e serviços HTTP administrativos em `frontend/admin/src/services/`.
- **Sistemas**: Habilita o gerenciamento operacional e moderação do sistema pelos administradores.
