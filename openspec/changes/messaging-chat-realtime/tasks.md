## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/messaging.service.ts` para queries e mutations de mensagens diretas
- [ ] 1.2 Criar `frontend/client/src/stores/messaging.ts` para controle reativo de conversas e mensagens

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/MessagingView.vue` (`/messaging`) com layout de 2 colunas e chat interativo
- [ ] 2.2 Registrar rota `/messaging` em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `MessagingApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `ChatListFragment.kt` para listagem de conversas no Android
- [ ] 3.3 Criar `DirectChatActivity.kt` para tela de conversa no Android e registrar em `AndroidManifest.xml`

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para o módulo `messaging`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate messaging-chat-realtime`
