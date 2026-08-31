## 1. Serviços e Camada de Dados GraphQL

- [x] 1.1 Criar `frontend/client/src/services/messaging.service.ts` para queries e mutations de mensagens diretas
- [x] 1.2 Criar `frontend/client/src/stores/messaging.ts` para controle reativo de conversas e mensagens

## 2. Frontend Cliente: Componentes e Views

- [x] 2.1 Criar `frontend/client/src/views/MessagingView.vue` (`/messaging`) com layout de 2 colunas e chat interativo
- [x] 2.2 Registrar rota `/messaging` em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [x] 3.1 Criar `MessagingApiService.kt` no módulo de rede do Android
- [x] 3.2 Criar `ChatListFragment.kt` para listagem de conversas no Android
- [x] 3.3 Criar `DirectChatActivity.kt` para tela de conversa no Android e registrar em `AndroidManifest.xml`

## 4. Validação e Testes

- [x] 4.1 Adicionar testes unitários para o módulo `messaging`
- [x] 4.2 Validar conformidade da proposta via `openspec validate messaging-chat-realtime`
