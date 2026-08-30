## ADDED Requirements

### Requirement: Grafo de Conexões e Seguir (1º, 2º e 3º Grau)
O sistema SHALL permitir o envio, cancelamento, aceite e rejeição de solicitações de conexão entre usuários, além da funcionalidade de seguir (Follow) e do cálculo automático da distância social no grafo (1º, 2º ou 3º grau).

#### Scenario: Envio de solicitação de conexão
- **WHEN** o usuário autenticado executar a mutation `sendConnectionRequest(recipientId: ID!)`
- **THEN** o sistema deve criar o registro em `connection_requests` com status `PENDING` e publicar uma notificação no RabbitMQ para o destinatário.

#### Scenario: Aceite de solicitação de conexão
- **WHEN** o destinatário executar a mutation `acceptConnectionRequest(requestId: ID!)`
- **THEN** o sistema deve alterar o status para `ACCEPTED`, criar as entradas bidirecionais na tabela `connections` e classificar ambos como conexão de 1º grau.

#### Scenario: Cálculo de grau de distância
- **WHEN** um usuário visualizar o perfil de outro usuário
- **THEN** o sistema deve retornar `DEGREE_1` se forem conexões diretas, `DEGREE_2` se possuírem conexões mútuas, ou `DEGREE_3` caso contrário.

### Requirement: Perfil Profissional Estendido (LinkedIn Standard)
O sistema SHALL disponibilizar a consulta e atualização do perfil profissional enriquecido (`user_profiles`), incluindo título (`headline`), resumo (`about`), imagem de capa (`banner_url`), localização, setor e o selo `open_to_work`.

#### Scenario: Atualização de perfil profissional
- **WHEN** o usuário executar a mutation `updateMyProfile(input: ProfileInput!)`
- **THEN** o sistema deve persistir as informações em `user_profiles` e emitir evento de reindexação no Elasticsearch via RabbitMQ `search-index-sync`.

### Requirement: Postagens, Feed Social, Reações Tipadas e Comentários
O sistema SHALL permitir que usuários publiquem posts contendo texto e anexos de mídia, reajam com emoções específicas (LIKE, CELEBRATE, SUPPORT, LOVE, INSIGHTFUL), comentem em postagens e consultem o feed de notícias.

#### Scenario: Criar post com anexo de mídia
- **WHEN** o usuário executar a mutation `createPost(content: String!, mediaIds: [ID])`
- **THEN** o sistema deve criar o registro na tabela `posts`, vincular os ativos de mídia confirmados e disponibilizar o post no feed social.

#### Scenario: Reagir a um post
- **WHEN** o usuário executar a mutation `reactToPost(postId: ID!, type: ReactionType!)`
- **THEN** o sistema deve registrar a reação em `post_reactions` e recalcular os contadores por tipo de reação do post.

### Requirement: Mensageria Direta 1:1 em Tempo Real
O sistema SHALL disponibilizar a troca de mensagens diretas de texto e mídias entre conexões de 1º grau, com sinalização de leitura (`readAt`) e entrega em tempo real através de GraphQL Subscriptions WebSocket.

#### Scenario: Enviar mensagem direta 1:1
- **WHEN** o usuário executar a mutation `sendDirectMessage(recipientId: ID!, content: String!)`
- **THEN** o sistema deve gravar a mensagem em `direct_messages`, atualizar a conversa e publicar o evento `directMessageAdded` na subscription WebSocket do destinatário.
