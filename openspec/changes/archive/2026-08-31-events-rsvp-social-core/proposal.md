# Proposal: Implementação de Eventos Profissionais e Confirmação de Presença / RSVP (`events-rsvp-social-core`)

## Summary
Implementar o módulo de **Eventos Profissionais e Confirmação de Presença (RSVP)** no **Frontend Cliente** e no **Android**, consumindo as queries e mutations do módulo GraphQL `events` (`event`, `eventAttendees`, `createEvent`, `attendEvent`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação da rede social profissional [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md), esta entrega avança na **Fase 4 (Comunidades, Eventos & Educação - LMS)**:
- Os profissionais e empresas precisam divulgar webinars, meetups técnicos, feiras de recrutamento e workshops presenciais e online.
- Os usuários do Workix devem poder explorar o calendário de eventos (`event`), confirmar sua presença (`attendEvent`), visualizar a lista de participantes confirmados (`eventAttendees`) e publicar novos eventos como organizadores (`createEvent`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/events.service.ts`: Abstração de queries e mutations de eventos e participantes.
  - `src/stores/events.ts`: Store Pinia com listagem de eventos, evento ativo, participantes e confirmação de presença (RSVP).
  - `src/views/EventsListView.vue` (`/events`): Calendário/catálogo de eventos com filtros por tipo (Online/Presencial) e modal de criação.
  - `src/views/EventDetailView.vue` (`/events/:id`): Painel detalhado do evento, link/localização, botão RSVP e lista de confirmados.
  - Rotas registradas no `router/index.ts` e atalho de Eventos no `TheHeader.vue`.
- **Android App (`android/`)**:
  - `EventsApiService.kt`: Camada de rede nativa em Kotlin para eventos.
  - `EventsFragment.kt` / `EventDetailActivity.kt`: Interfaces nativas para calendário de eventos e confirmação de presença.
