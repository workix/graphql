# Design Document: Gestão Administrativa para Autores, Equipe, Grupos e Eventos (`admin-authors-members-groups-events-core`)

## Architectural Strategy

No Frontend Admin (`frontend/admin` com Vue 3 + Vuetify 3):
1. **Camada de Serviços (`src/services`)**:
   - `authorsAdmin.service.ts`: Abstração de `allAuthors`, `createAuthor`, `deleteAuthor`.
   - `membersAdmin.service.ts`: Abstração de `allMembers`, `createMember`, `deleteMember`.
   - `groupsAdmin.service.ts`: Abstração de auditoria de grupos comunitários.
   - `eventsAdmin.service.ts`: Abstração de auditoria de eventos.

2. **Componentes e Views (`src/views`)**:
   - `AdminAuthorsView.vue` (`/authors`): Tabela com `v-data-table`, modal para cadastrar autor de blog.
   - `AdminMembersView.vue` (`/members`): Tabela de equipe com fotos, modal para cadastrar membro institucional.
   - `AdminGroupsView.vue` (`/groups`): Painel de auditoria de grupos e comunidades ativas.
   - `AdminEventsView.vue` (`/events`): Painel de auditoria de eventos e RSVP.

3. **Navegação & Rotas**:
   - Atualização do menu lateral em `AdminLayout.vue` e registro de rotas em `router/index.ts`.
