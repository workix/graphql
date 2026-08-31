# Design Document: Eventos Profissionais e RSVP (`events-rsvp-social-core`)

## Architectural Strategy

A camada de eventos do Workix conecta profissionais através de encontros presenciais e remotos:
1. **Backend GraphQL (`src/modules/events`)**:
   - `event(id)`: Metadados do evento (título, descrição, tipo, data/hora, link/local).
   - `eventAttendees(eventId, limit, offset)`: Lista de participantes confirmados.
   - `createEvent(...)`: Cadastro de novos eventos com organizador.
   - `attendEvent(eventId, userId, status)`: Confirmação de presença / RSVP.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/events.service.ts`: Camada de comunicação GraphQL.
   - `src/stores/events.ts`: Gerenciamento de estado de eventos, evento ativo, lista de confirmados e RSVP.
   - `src/views/EventsListView.vue` (`/events`): Catálogo com filtros de tipo de evento e modal de criação.
   - `src/views/EventDetailView.vue` (`/events/:id`): Painel detalhado do evento com contador de confirmados e botão RSVP.

3. **Android App (`android/`)**:
   - `EventsApiService.kt`: Camada de rede nativa em Kotlin com Coroutines.
   - `EventsFragment.kt` e `EventDetailActivity.kt`: Interfaces para listagem de eventos e RSVP.
