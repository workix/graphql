## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/groups.service.ts` para queries e mutations de grupos
- [ ] 1.2 Criar `frontend/client/src/stores/groups.ts` para gerenciamento de comunidades e feeds

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/GroupsListView.vue` (`/groups`) com catálogo de grupos e modal de criação
- [ ] 2.2 Criar `frontend/client/src/views/GroupDetailView.vue` (`/groups/:id`) com feed exclusivo de posts
- [ ] 2.3 Registrar rotas `/groups` e `/groups/:id` em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `GroupsApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `GroupsFragment.kt` e `GroupDetailActivity.kt` no pacote `ui/groups` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para o módulo `groups`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate groups-communities-core`
