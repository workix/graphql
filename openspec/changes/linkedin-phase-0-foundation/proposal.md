## Why

O levantamento técnico `SPECIFICATION_LINKEDIN.md` definiu a evolução do ecossistema Workix de um portal de vagas e blog para uma rede social profissional completa no padrão LinkedIn. Para suportar as funcionalidades sociais (perfis com avatares/banners, feed de posts com imagens/documentos, mensageria instantânea 1:1, notificações persistentes e busca global), a **Fase 0 — Fundação** é o pré-requisito técnico obrigatório que introduz o armazenamento de mídias binárias, indexação no Elasticsearch, suporte a GraphQL Subscriptions (WebSocket) e o consumidor persistente da fila de notificações do RabbitMQ.

## What Changes

- **Armazenamento de Mídia Binária (Upload URL Assinada)**: Introdução do serviço de armazenamento de objetos (S3/Azure Blob compatible) com fluxo de URL pré-assinada (`requestUploadUrl` e `confirmUpload`), eliminando a limitação atual de armazenar apenas referências estáticas em string.
- **Ativação Real do Elasticsearch**: Conexão singleton via `factory/elasticsearch_server.ts` e pipeline de sincronização de índices assíncronos (`profiles`, `jobs`, `companies`, `posts`) consumindo da fila RabbitMQ `search-index-sync`.
- **GraphQL Subscriptions (Tempo Real)**: Adição do servidor WebSocket (`graphql-ws` / `ws`) integrado ao Express para suportar eventos de mensageria e notificações em tempo real.
- **Consumidor Persistente de Notificações**: Implementação do worker consumidor da fila `notifications` do RabbitMQ com gravação em banco relacional (`notifications`), resolvendo a dívida técnica do `notification.service.ts` e habilitando a consulta `myNotifications`.

## Capabilities

### New Capabilities
- `binary-media-storage`: Serviço de solicitação e confirmação de upload de mídias binárias via URLs pré-assinadas e tabela de ativos de mídia (`media_assets`).
- `elasticsearch-search-index`: Factory de conexão ao Elasticsearch e worker de sincronização assíncrona de índices de busca.
- `graphql-subscriptions-websocket`: Servidor WebSocket e transportador de subscriptions GraphQL em tempo real sobre Express.
- `persistent-notification-service`: Tabela de notificações persistentes, worker consumidor da fila `notifications` do RabbitMQ e consultas GraphQL de notificações.

### Modified Capabilities
<!-- Nenhuma especificação de funcionalidade existente tem seus requisitos funcionais alterados nesta fase de infraestrutura -->

## Impact

- **Código-Fonte**: Adição de `src/factory/elasticsearch_server.ts`, `src/factory/storage_server.ts`, `src/subscriptions/index.ts`, `src/workers/notification_consumer.ts` e módulo `src/modules/notifications`.
- **Dependências NPM**: Adição de `@elastic/elasticsearch`, `graphql-ws`, `ws`, `@aws-sdk/client-s3` (ou utilitário equivalente).
- **Banco de Dados**: Criação das tabelas `media_assets` e `notifications`.
- **Fila / Broker**: Nova fila RabbitMQ `search-index-sync` e consumo persistente da fila `notifications`.
