# messaging-chat-realtime Specification

## Purpose
Especifica o comportamento, regras de envio, consumo de histórico e fluxo visual de chat 1:1 e mensageria direta no ecossistema Workix.

## Requirements

### Requirement: Consulta de Histórico de Conversa 1:1
O sistema SHALL permitir que usuários autenticados consultem o histórico cronológico de mensagens trocadas com outro contato via query `directMessages(userId1, userId2, limit, offset)`.

#### Scenario: Carregamento do histórico da conversa
- **WHEN** o usuário seleciona um contato na lista de conversas
- **THEN** o sistema busca as mensagens associadas e as renderiza no painel principal com distinção visual entre mensagens enviadas (lado direito) e recebidas (lado esquerdo).

### Requirement: Envio de Mensagem Direta
O sistema SHALL disponibilizar caixa de envio de mensagens de texto via mutation `sendDirectMessage(senderId, recipientId, content)`.

#### Scenario: Envio de mensagem com sucesso
- **WHEN** o usuário digita um texto e clica em "Enviar" (ou pressiona Enter)
- **THEN** a mensagem é enviada ao servidor GraphQL e adicionada imediatamente à tela de chat.

### Requirement: Marcação de Mensagem como Lida
O sistema SHALL permitir marcar mensagens não lidas como lidas quando visualizadas pelo destinatário via mutation `markDirectMessageAsRead(messageId, recipientId)`.

#### Scenario: Visualização e leitura de mensagens
- **WHEN** o usuário abre a conversa com mensagens pendentes
- **THEN** o sistema atualiza o status de leitura para `read: true`.

### Requirement: Interface Mobile Android de Mensageria
O sistema SHALL disponibilizar telas nativas em Android para listagem de chats recentes (`ChatListFragment.kt`) e tela de bate-papo em tempo real (`DirectChatActivity.kt`).

#### Scenario: Conversa no aplicativo Android
- **WHEN** o usuário toca em uma conversa no app Android
- **THEN** a `DirectChatActivity` é iniciada permitindo leitura e resposta rápida.
