## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/events.service.ts` para queries e mutations de eventos
- [ ] 1.2 Criar `frontend/client/src/stores/events.ts` para gerenciamento de calendário e RSVPs

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/EventsListView.vue` (`/events`) com catálogo de eventos e modal de criação
- [ ] 2.2 Criar `frontend/client/src/views/EventDetailView.vue` (`/events/:id`) com botão de RSVP e lista de confirmados
- [ ] 2.3 Registrar rotas `/events` e `/events/:id` em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `EventsApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `EventsFragment.kt` e `EventDetailActivity.kt` no pacote `ui/events` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para o módulo `events`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate events-rsvp-social-core`
