## 1. Serviços e Camada de Dados GraphQL

- [x] 1.1 Criar `frontend/client/src/services/groups.service.ts` para queries e mutations de grupos
- [x] 1.2 Criar `frontend/client/src/stores/groups.ts` para gerenciamento de comunidades e feeds

## 2. Frontend Cliente: Componentes e Views

- [x] 2.1 Criar `frontend/client/src/views/GroupsListView.vue` (`/groups`) com catálogo de grupos e modal de criação
- [x] 2.2 Criar `frontend/client/src/views/GroupDetailView.vue` (`/groups/:id`) com feed exclusivo de posts
- [x] 2.3 Registrar rotas `/groups` e `/groups/:id` em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [x] 3.1 Criar `GroupsApiService.kt` no módulo de rede do Android
- [x] 3.2 Criar `GroupsFragment.kt` e `GroupDetailActivity.kt` no pacote `ui/groups` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [x] 4.1 Adicionar testes unitários para o módulo `groups`
- [x] 4.2 Validar conformidade da proposta via `openspec validate groups-communities-core`
