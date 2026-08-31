# events-rsvp-social-core Specification

## Purpose
Especifica o comportamento, regras de exibição e fluxo de confirmação de presença (RSVP) em eventos profissionais no ecossistema Workix.

## Requirements

### Requirement: Consulta e Detalhes de Eventos Profissionais
O sistema SHALL permitir que o usuário consulte eventos e os detalhes de um evento via query `event(id)` exibindo título, descrição, tipo (ONLINE ou IN_PERSON), data/hora de início/fim e link de transmissão ou endereço.

#### Scenario: Visualização de detalhes do evento
- **WHEN** o usuário acessa `/events/:id`
- **THEN** o sistema exibe os detalhes completos do evento, botão de RSVP e lista de confirmados.

### Requirement: Criação de Novo Evento Profissional
O sistema SHALL permitir que usuários autenticados criem novos eventos via mutation `createEvent(organizerId, title, description, eventType, startTime, endTime, locationOrUrl)`.

#### Scenario: Criação de evento com sucesso
- **WHEN** o organizador preenche os dados do evento e submete o formulário
- **THEN** o evento é registrado no calendário com data, hora e link/local.

### Requirement: Confirmação de Presença (RSVP)
O sistema SHALL permitir que usuários confirmem sua participação no evento via mutation `attendEvent(eventId, userId, status)`.

#### Scenario: Confirmação de presença no evento
- **WHEN** o usuário clica no botão "Confirmar Presença (RSVP)"
- **THEN** a participação é registrada e o usuário é adicionado à lista de participantes confirmados.

### Requirement: Lista de Participantes Confirmados
O sistema SHALL listar os participantes confirmados de um evento via query `eventAttendees(eventId, limit, offset)`.

#### Scenario: Visualização de networking do evento
- **WHEN** o usuário consulta a seção de participantes
- **THEN** a lista de profissionais confirmados é renderizada.

### Requirement: Interface Mobile de Eventos no Android
O sistema SHALL disponibilizar suporte a eventos no app Android através do `EventsFragment.kt` e `EventDetailActivity.kt`.

#### Scenario: Visualização e RSVP no Android
- **WHEN** o usuário acessa a aba de Eventos no app Android
- **THEN** ele pode navegar nos eventos disponíveis e confirmar presença com um toque.
