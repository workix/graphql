## ADDED Requirements

### Requirement: Upload e Armazenamento de Mídias Binárias via URLs Pré-Assinadas
O sistema SHALL disponibilizar um serviço de solicitação e confirmação de upload de mídias binárias (avatares, banners, documentos, imagens de post), gerando URLs pré-assinadas e registrando os ativos na tabela `media_assets`.

#### Scenario: Solicitação de URL pré-assinada de upload
- **WHEN** o cliente GraphQL executar a mutation `requestUploadUrl` fornecendo `fileName`, `fileType` e `context`
- **THEN** o sistema deve retornar uma URL pré-assinada de upload com tempo de expiração determinado e o identificador do ativo de mídia (`mediaId`).

#### Scenario: Confirmação de upload e atualização do ativo
- **WHEN** o cliente GraphQL executar a mutation `confirmUpload` fornecendo `mediaId`
- **THEN** o sistema deve alterar o status da mídia para `CONFIRMED` e disponibilizar a URL pública de acesso.

### Requirement: Ativação do Motor de Busca Elasticsearch e Sincronização Assíncrona
O sistema SHALL estabelecer uma fábrica de conexão singleton com o Elasticsearch (`factory/elasticsearch_server.ts`) e manter os índices (`profiles`, `jobs`, `companies`, `posts`) sincronizados de forma assíncrona através da fila RabbitMQ `search-index-sync`.

#### Scenario: Publicação de evento de sincronização de busca
- **WHEN** uma entidade indexável (Usuário, Vaga, Empresa, Post) for criada, atualizada ou excluída
- **THEN** o sistema deve publicar uma mensagem com o payload da operação na fila `search-index-sync` para ser processado pelo worker do Elasticsearch.

### Requirement: Servidor WebSocket e Subscriptions GraphQL
O sistema SHALL integrar um servidor WebSocket (`graphql-ws` / `ws`) ao servidor HTTP Express para permitir a transmissão de dados em tempo real através de subscriptions GraphQL.

#### Scenario: Conexão WebSocket e inscrição em eventos em tempo real
- **WHEN** um cliente GraphQL se conectar via protocolo WebSocket e inscrever-se em uma Subscription
- **THEN** o sistema deve autenticar a conexão via JWT e transmitir eventos publicados em tempo real para o cliente.

### Requirement: Consumidor Persistente de Notificações
O sistema SHALL implementar um worker consumidor da fila RabbitMQ `notifications` que persiste cada notificação na tabela `notifications` do banco de dados relacional e expõe as consultas GraphQL `myNotifications` e `unreadNotificationsCount`.

#### Scenario: Consumo e persistência de notificação
- **WHEN** uma notificação for publicada na fila `notifications` do RabbitMQ
- **THEN** o consumidor deve gravar o evento na tabela `notifications`, emitir o push notification (se houver token FCM) e atualizar o contador de não-lidas no Redis (`unread-notif-${userId}`).
