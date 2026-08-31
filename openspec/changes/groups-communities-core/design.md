# Design Document: Comunidades e Grupos de Discussão (`groups-communities-core`)

## Architectural Strategy

A camada de comunidades do Workix atende à necessidade de networking segmentado:
1. **Backend GraphQL (`src/modules/groups`)**:
   - `group(id)`: Obtenção de metadados do grupo.
   - `groupPosts(groupId, limit, offset)`: Feed interno da comunidade.
   - `createGroup(ownerId, name, description, privacy)`: Criação com atribuição de proprietário.
   - `joinGroup(groupId, userId)`: Solicitação/entrada no grupo.
   - `createGroupPost(groupId, authorId, content)`: Publicação no grupo.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/groups.service.ts`: Camada de comunicação GraphQL.
   - `src/stores/groups.ts`: Gerenciamento de estado de grupos, membros e postagens.
   - `src/views/GroupsListView.vue` (`/groups`): Catálogo de grupos com cards, busca e modal de criação.
   - `src/views/GroupDetailView.vue` (`/groups/:id`): Visão da comunidade, botão de entrada e feed de discussões.

3. **Android App (`android/`)**:
   - `GroupsApiService.kt`: Camada de rede nativa em Kotlin com Coroutines.
   - `GroupsFragment.kt` e `GroupDetailActivity.kt`: Interfaces com `RecyclerView` para listagem de comunidades e feed de posts do grupo.
