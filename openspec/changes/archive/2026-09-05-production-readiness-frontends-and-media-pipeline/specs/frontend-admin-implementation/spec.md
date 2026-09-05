## ADDED Requirements

### Requirement: Operações Administrativas Integradas e Conectadas ao GraphQL
O Frontend Web Admin SHALL disponibilizar todos os painéis administrativos (`AdminJobsView`, `AdminCandidatesView`, `AdminCompaniesView`, `AdminPlansView`, `AdminJAASUsersView`, `AdminJAASRolesView`, `AdminResumesView`, `AdminCoursesView`, `AdminEventsView`, `AdminBlogsView`) operando com dados reais da API GraphQL, suportando paginação nativa, busca textual, alternância de status, exclusão e criação com feedback visual de notificação (*snackbar*).

#### Scenario: Gestão e Moderação de Vagas pelo Administrador
- **WHEN** o administrador acessa o painel de vagas (`/admin/jobs`), aplica filtros por categoria e altera o status de ativação de uma vaga
- **THEN** a alteração é enviada em tempo real via mutation GraphQL `updateJob` e o estado da listagem é atualizado imediatamente.

#### Scenario: Gestão de Papéis e Permissões JAAS
- **WHEN** o administrador cria um novo papel ou atribui permissões em `/admin/jaas-roles`
- **THEN** a operação é persistida via GraphQL no banco de dados e refletida instantaneamente na interface.
