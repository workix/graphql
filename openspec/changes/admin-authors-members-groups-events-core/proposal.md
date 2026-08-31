# Proposal: Implementação de Gestão Administrativa para Autores, Equipe, Grupos e Eventos (`admin-authors-members-groups-events-core`)

## Summary
Implementar no **Frontend Admin (`frontend/admin`)** os painéis de cadastro e auditoria para autores de blog (`authors`), equipe institucional (`members`), comunidades/grupos (`groups`) e eventos profissionais (`events`).

## Motivation & Background
Para consolidar a cobertura do ecossistema e atingir paridade plena de governança:
- Autores de blog corporativo necessitam de tela dedicada para CRUD no painel administrativo (`allAuthors`, `createAuthor`, `updateAuthor`, `deleteAuthor`).
- A equipe institucional e liderança necessita de gestão no admin (`allMembers`, `createMember`, `deleteMember`).
- As comunidades/grupos e os eventos corporativos necessitam de painéis de auditoria e governança no painel admin (`group`, `event`).

## Impacted Areas
- **Frontend Admin (`frontend/admin`)**:
  - `src/services/authorsAdmin.service.ts`: Abstração de queries e CRUD de autores de blog.
  - `src/services/membersAdmin.service.ts`: Abstração de queries e CRUD de membros da equipe.
  - `src/services/groupsAdmin.service.ts`: Abstração de auditoria de grupos e comunidades.
  - `src/services/eventsAdmin.service.ts`: Abstração de auditoria de eventos profissionais.
  - `src/views/AdminAuthorsView.vue` (`/authors`): Painel de gestão de autores de blog.
  - `src/views/AdminMembersView.vue` (`/members`): Painel de gestão da equipe institucional.
  - `src/views/AdminGroupsView.vue` (`/groups`): Painel de auditoria de grupos comunitários.
  - `src/views/AdminEventsView.vue` (`/events`): Painel de auditoria de eventos.
  - Atualização do menu lateral em `AdminLayout.vue` e rotas em `router/index.ts`.
