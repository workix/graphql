# Design Document: Mensageria Direta e Chat (`messaging-chat-realtime`)

## Context & Architectural Strategy

O módulo de mensageria direta 1:1 viabiliza o contato privado entre candidatos, empresas e membros da rede:
1. **Backend GraphQL (`src/modules/messaging`)**:
   - `directMessages(userId1, userId2, limit, offset)`: Retorna mensagens ordenadas cronologicamente.
   - `sendDirectMessage(senderId, recipientId, content)`: Persiste a mensagem e emite evento PubSub `DIRECT_MESSAGE_ADDED`.
   - `markDirectMessageAsRead(messageId, recipientId)`: Atualiza a flag `read = true`.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/messaging.service.ts`: Abstração de cliente GraphQL.
   - `src/stores/messaging.ts`: Store Pinia com lista de conversas recentes, mensagens ativas da conversa selecionada e status de envio.
   - `src/views/MessagingView.vue` (`/messaging`): Layout profissional estilo LinkedIn Messaging (coluna esquerda com lista de conversas, coluna direita com header do contato, área de rolagem de balões de mensagens e barra inferior de digitação).

3. **Android App (`android/`)**:
   - `MessagingApiService.kt`: Chamadas de rede assíncronas com Kotlin Coroutines.
   - `ChatListFragment.kt`: Lista de conversas com `RecyclerView`.
   - `DirectChatActivity.kt`: Chat com layout de balões (enviados e recebidos) e campo de texto com botão Enviar.
