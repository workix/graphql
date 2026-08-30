## Context

Nesta Fase 4, construímos todas as views e componentes operacionais do **Frontend Administrativo** (`frontend/admin`), atendendo a exigência do projeto de utilização 100% dos componentes e design system do **Vuetify 3**.

## Goals / Non-Goals

**Goals:**
- Criar o layout administrativo responsivo em `AdminLayout.vue` utilizando `v-app-bar`, `v-navigation-drawer`, `v-list` e `v-main`.
- Implementar a view de estatísticas em `AdminDashboardView.vue` com `v-card`, `v-icon` e contadores.
- Implementar a gestão CRUD de Usuários em `AdminUsersView.vue` usando `v-data-table`, `v-dialog` e `v-btn`.
- Implementar a moderação de Vagas em `AdminJobsView.vue`.
- Implementar a gestão de Empresas em `AdminCompaniesView.vue` e Candidatos em `AdminCandidatesView.vue`.
- Implementar a gestão de JAAS Users (`AdminJAASUsersView.vue`) e Roles (`AdminJAASRolesView.vue`).
- Implementar moderação de Depoimentos em `AdminTestimonialsView.vue` e Inscritos em `AdminSubscribersView.vue`.

**Non-Goals:**
- Não alterar as telas do portal do cliente (já concluídas na Fase 3).

## Decisions

- **Decisão 1: Vuetify 3 `v-data-table` com Server-Side / Client-Side Search**:
  Utilizar `v-data-table` nativo do Vuetify 3 com botões de ação na coluna final (Editar, Excluir, Status) e busca global via prop `search`.

- **Decisão 2: Dialogs Reutilizáveis de Confirmação**:
  Criar componente `ConfirmDialog.vue` usando `v-dialog` para pedir confirmação do usuário antes de exclusões ou alterações críticas.

## Risks / Trade-offs

- [Incompatibilidade de endpoints legados] → Alguns endpoints REST possuem estruturas diferentes. *Mitigação*: Tratar payloads no serviço `src/services/admin.ts`.
