## 1. Armazenamento de Mídia Binária (`media_assets`)

- [x] 1.1 Criar modelo Sequelize `MediaAsset` e migration para tabela `media_assets`
- [x] 1.2 Criar fábrica `src/factory/storage_server.ts` para geração de URLs pré-assinadas de upload/download
- [x] 1.3 Criar suíte de testes unitários TDD em `tests/unit/factory/storage_server.spec.ts` com 100% de cobertura
- [x] 1.4 Criar módulo GraphQL `src/modules/media` com schema, resolvers e repositório para `requestUploadUrl` e `confirmUpload`

## 2. Motor de Busca Elasticsearch Operacional

- [x] 2.1 Criar fábrica singleton `src/factory/elasticsearch_server.ts` para conexão ao Elasticsearch
- [x] 2.2 Criar worker de sincronização assíncrona `src/workers/search_indexer_worker.ts` consumindo a fila RabbitMQ `search-index-sync`
- [x] 2.3 Criar suíte de testes unitários TDD em `tests/unit/factory/elasticsearch_server.spec.ts` com 100% de cobertura

## 3. GraphQL Subscriptions (WebSocket)

- [x] 3.1 Instalar e integrar `graphql-ws` e `ws` ao servidor HTTP Express em `src/index.ts` / `src/server.ts`
- [x] 3.2 Criar infraestrutura de PubSub para Subscriptions e autenticação de token JWT em conexões WebSocket
- [x] 3.3 Criar suíte de testes unitários TDD para transportadores WebSocket e Subscriptions

## 4. Consumidor Persistente de Notificações

- [x] 4.1 Criar modelo Sequelize `Notification` e migration para a tabela `notifications`
- [x] 4.2 Criar consumidor da fila RabbitMQ `src/workers/notification_consumer.ts` para persistência em banco e invalidação de cache Redis
- [x] 4.3 Criar módulo GraphQL `src/modules/notifications` com queries `myNotifications` e `unreadNotificationsCount` e mutação `markNotificationAsRead`
- [x] 4.4 Criar suíte de testes unitários TDD para o módulo de notificações com 100% de cobertura e validação geral do Jest
