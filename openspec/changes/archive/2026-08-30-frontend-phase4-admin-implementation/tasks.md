## 1. Layout Mestre e Autenticação (Vuetify 3)

- [x] 1.1 Criar `AdminLayout.vue` com `v-app-bar`, `v-navigation-drawer`, menu com ícones MDI e suporte a logout.
- [x] 1.2 Atualizar `AdminLoginView.vue` integrando a autenticação ao backend e salvando o estado na Pinia store `adminAuth`.

## 2. Dashboard e Gestão de Usuários (Vuetify 3)

- [x] 2.1 Criar a camada de serviço `src/services/admin.ts` para chamadas REST/GraphQL de administração.
- [x] 2.2 Implementar `AdminDashboardView.vue` com estatísticas (`/statistics`) em `v-card` e gráficos/contadores.
- [x] 2.3 Implementar `AdminUsersView.vue` com `v-data-table` para CRUD de Usuários (`/users`) e modal de edição `v-dialog`.
- [x] 2.4 Implementar `AdminJAASUsersView.vue` e `AdminJAASRolesView.vue` para controle de usuários e perfis JAAS (`/jaasusers`, `/jaasroles`).

## 3. Moderação de Vagas, Empresas, Candidatos e Conteúdo (Vuetify 3)

- [x] 3.1 Implementar `AdminJobsView.vue` para moderação e aprovação/exclusão de vagas (`/jobs`).
- [x] 3.2 Implementar `AdminCompaniesView.vue` e `AdminCandidatesView.vue` com `v-data-table` (`/companies`, `/candidates`).
- [x] 3.3 Implementar `AdminTestimonialsView.vue` (`/testimonials`) e `AdminSubscribersView.vue` (`/subscribers`).
