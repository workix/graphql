## 1. Serviços e Camada de Dados GraphQL

- [x] 1.1 Criar `frontend/client/src/services/events.service.ts` para queries e mutations de eventos
- [x] 1.2 Criar `frontend/client/src/stores/events.ts` para gerenciamento de calendário e RSVPs

## 2. Frontend Cliente: Componentes e Views

- [x] 2.1 Criar `frontend/client/src/views/EventsListView.vue` (`/events`) com catálogo de eventos e modal de criação
- [x] 2.2 Criar `frontend/client/src/views/EventDetailView.vue` (`/events/:id`) com botão de RSVP e lista de confirmados
- [x] 2.3 Registrar rotas `/events` e `/events/:id` em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [x] 3.1 Criar `EventsApiService.kt` no módulo de rede do Android
- [x] 3.2 Criar `EventsFragment.kt` e `EventDetailActivity.kt` no pacote `ui/events` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [x] 4.1 Adicionar testes unitários para o módulo `events`
- [x] 4.2 Validar conformidade da proposta via `openspec validate events-rsvp-social-core`
