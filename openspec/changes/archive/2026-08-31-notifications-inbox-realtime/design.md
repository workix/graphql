# Design Document: Central de Notificações (`notifications-inbox-realtime`)

## Context & Architectural Strategy

O módulo de notificações gerencia os alertas orientados a eventos para os usuários:
1. **Backend GraphQL (`src/modules/notifications`)**:
   - `myNotifications(userId, limit, offset)`: Retorna lista de notificações ordenadas pela mais recente.
   - `unreadNotificationsCount(userId)`: Retorna contagem de alertas com `read = false`.
   - `markNotificationAsRead(id, userId)`: Marca uma notificação como lida.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/notifications.service.ts`: Abstração de cliente GraphQL.
   - `src/stores/notifications.ts`: Store Pinia mantendo contagem reativa e lista de alertas.
   - `src/views/NotificationsView.vue` (`/notifications`): Painel com filtros (Todas, Não Lidas), ícones categorizados por tipo (Conexão, Mensagem, Post, Vaga) e ação de marcar todas como lidas.
   - Atualização de `TheHeader.vue` com badge de sino.

3. **Android App (`android/`)**:
   - `NotificationsApiService.kt`: Chamadas GraphQL assíncronas com Kotlin Coroutines.
   - `NotificationsFragment.kt`: Fragment nativo com `RecyclerView` e `NotificationAdapter`.
