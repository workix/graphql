## ADDED Requirements

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
