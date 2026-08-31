# Proposal: Implementação de Comunidades e Grupos de Discussão (`groups-communities-core`)

## Summary
Implementar o módulo de **Grupos e Comunidades Profissionais** no **Frontend Cliente** e no **Android**, consumindo as queries e mutations do módulo GraphQL `groups` (`group`, `groupPosts`, `createGroup`, `joinGroup`, `approveGroupMembership`, `createGroupPost`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação da rede social profissional [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md), esta entrega inicia a **Fase 4 (Comunidades, Eventos & Educação - LMS)**:
- Os usuários do ecossistema Workix precisam participar de grupos de discussão nichados por indústria, tecnologia e interesses em comum.
- Devem poder criar novos grupos públicos ou privados (`createGroup`), solicitar entrada (`joinGroup`), moderar membros (`approveGroupMembership`) e interagir em um feed exclusivo para membros da comunidade (`groupPosts`, `createGroupPost`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/groups.service.ts`: Abstração de queries e mutations de grupos, membros e postagens de grupo.
  - `src/stores/groups.ts`: Store Pinia com listagem de grupos, grupo ativo, memberships e feed de grupo.
  - `src/views/GroupsListView.vue` (`/groups`): Catálogo de comunidades, filtro por interesse e modal de criação de grupo.
  - `src/views/GroupDetailView.vue` (`/groups/:id`): Painel detalhado do grupo com informações, status de membership e feed de publicações exclusivo.
  - Rotas registradas no `router/index.ts` e atalho de Grupos no `TheHeader.vue`.
- **Android App (`android/`)**:
  - `GroupsApiService.kt`: Camada de rede nativa em Kotlin para grupos.
  - `GroupsFragment.kt` / `GroupDetailActivity.kt`: Interfaces nativas para exploração de comunidades e interação no grupo.
