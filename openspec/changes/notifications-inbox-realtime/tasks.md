## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/notifications.service.ts` para queries e mutations de notificações
- [ ] 1.2 Criar `frontend/client/src/stores/notifications.ts` para gerenciamento de alertas e contadores

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/NotificationsView.vue` (`/notifications`) com filtros e marcação de lidas
- [ ] 2.2 Registrar rota `/notifications` em `frontend/client/src/router/index.ts` e adicionar ícone com badge em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `NotificationsApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `NotificationsFragment.kt` com `RecyclerView` para listagem de alertas no Android

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para o módulo `notifications`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate notifications-inbox-realtime`
