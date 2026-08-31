## Purpose

Especifica o comportamento, regras de exibição e fluxo de marcação da central de notificações no ecossistema Workix.

## ADDED Requirements

### Requirement: Listagem Paginada de Notificações
O sistema SHALL exibir as notificações do usuário logado via query `myNotifications(userId, limit, offset)`, apresentando tipo, título, mensagem e data formatada.

#### Scenario: Visualização da caixa de notificações
- **WHEN** o usuário acessa `/notifications` no Frontend ou a aba Notificações no Android
- **THEN** a lista de notificações é exibida com destaque visual para itens não lidos.

### Requirement: Contagem de Notificações Não Lidas
O sistema SHALL obter a quantidade de notificações não lidas via query `unreadNotificationsCount(userId)` e exibir um badge numérico no menu de navegação.

#### Scenario: Atualização de badge no cabeçalho
- **WHEN** existem notificações não lidas
- **THEN** o ícone de sino no cabeçalho exibe o número de notificações pendentes.

### Requirement: Marcação de Notificação como Lida
O sistema SHALL permitir marcar uma notificação específica como lida via mutation `markNotificationAsRead(id, userId)`.

#### Scenario: Leitura de notificação
- **WHEN** o usuário clica em uma notificação não lida
- **THEN** o sistema dispara a mutation `markNotificationAsRead` e atualiza o contador do badge.

### Requirement: Central de Notificações Mobile em Android
O sistema SHALL fornecer fragmento nativo em Android (`NotificationsFragment.kt`) para visualização de alertas.

#### Scenario: Notificações no app Android
- **WHEN** o usuário acessa a tela de notificações no app
- **THEN** as notificações são renderizadas via `RecyclerView` com indicação de status de leitura.
