# Proposal: Implementação da Central de Notificações (`notifications-inbox-realtime`)

## Summary
Implementar a central de notificações no **Frontend Cliente** e no **Android**, consumindo as queries, mutations e subscriptions do módulo GraphQL `notifications` (`myNotifications`, `unreadNotificationsCount`, `markNotificationAsRead`, `Subscription.notificationAdded`), com badge no cabeçalho e histórico de eventos.

## Motivation & Background
Conforme diagnosticado no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md), o módulo de notificações conclui a **Fase 2 (Conexões, Rede & Mensageria em Tempo Real)**:
- Os usuários precisam de uma central para receber alertas sobre novas conexões aceitas, comentários e reações em seus posts, mensagens recebidas e atualizações de candidaturas em vagas.
- O cabeçalho deve exibir badge com contagem em tempo real de itens não lidos (`unreadNotificationsCount`).
- Ao clicar em uma notificação, o sistema deve marcá-la como lida (`markNotificationAsRead`) e permitir a navegação para o recurso relacionado.

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/notifications.service.ts`: Abstração de queries e mutations de notificações.
  - `src/stores/notifications.ts`: Store Pinia com listagem de notificações, contador de não lidas e marcação.
  - `src/views/NotificationsView.vue` (`/notifications`): Tela de caixa de entrada de notificações com filtros (Todas, Não Lidas).
  - Atualização do `TheHeader.vue` com ícone de sino e badge reativo.
- **Android App (`android/`)**:
  - `NotificationsApiService.kt`: Camada de rede nativa em Kotlin para notificações.
  - `NotificationsFragment.kt`: Fragment nativo com `RecyclerView` para leitura e marcação de alertas.
