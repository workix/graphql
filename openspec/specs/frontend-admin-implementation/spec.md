# frontend-admin-implementation Specification

## Purpose
TBD - created by archiving change frontend-phase4-admin-implementation. Update Purpose after archive.
## Requirements
### Requirement: Layout Base Administrativo com Vuetify 3
O frontend administrativo SHALL implementar um layout mestre com `v-app-bar`, `v-navigation-drawer` retrátil, atalhos de navegação e exibição do perfil autenticado.

#### Scenario: Navegação no Painel Admin
- **WHEN** um administrador navega entre os módulos (Usuários, Vagas, Empresas, JAAS Roles)
- **THEN** o menu lateral retém o estado da rota ativa e o conteúdo principal atualiza dinamicamente na área `v-main`.

### Requirement: Dashboard de Métricas Administrativas
O painel admin SHALL apresentar em `/dashboard` os cartões de estatísticas contatados a partir do endpoint `/statistics` (`statisticsCount`).

#### Scenario: Visualização de Estatísticas
- **WHEN** o administrador acessa o Dashboard
- **THEN** os contadores de Vagas, Usuários, Empresas e Inscrições são renderizados em cards Vuetify (`v-card`).

### Requirement: Moderação e CRUD de Entidades com Vuetify Data Table
O painel admin SHALL disponibilizar tabelas `v-data-table` com busca, filtros, ordenação e modais `v-dialog` para cadastro, edição e exclusão de Usuários (`/users`), Vagas (`/jobs`), Empresas (`/companies`), JAAS Users (`/jaasusers`) e JAAS Roles (`/jaasroles`).

#### Scenario: Edição de Usuário pelo Administrador
- **WHEN** o administrador abre o modal de edição em `v-data-table` e atualiza a role de um usuário
- **THEN** a chamada `PUT /users/:id` é realizada e a tabela é recarregada automaticamente.

### Requirement: Operações Administrativas Integradas e Conectadas ao GraphQL
O Frontend Web Admin SHALL disponibilizar todos os painéis administrativos (`AdminJobsView`, `AdminCandidatesView`, `AdminCompaniesView`, `AdminPlansView`, `AdminJAASUsersView`, `AdminJAASRolesView`, `AdminResumesView`, `AdminCoursesView`, `AdminEventsView`, `AdminBlogsView`) operando com dados reais da API GraphQL, suportando paginação nativa, busca textual, alternância de status, exclusão e criação com feedback visual de notificação (*snackbar*).

#### Scenario: Gestão e Moderação de Vagas pelo Administrador
- **WHEN** o administrador acessa o painel de vagas (`/admin/jobs`), aplica filtros por categoria e altera o status de ativação de uma vaga
- **THEN** a alteração é enviada em tempo real via mutation GraphQL `updateJob` e o estado da listagem é atualizado imediatamente.

#### Scenario: Gestão de Papéis e Permissões JAAS
- **WHEN** o administrador cria um novo papel ou atribui permissões em `/admin/jaas-roles`
- **THEN** a operação é persistida via GraphQL no banco de dados e refletida instantaneamente na interface.


