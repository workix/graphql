## Context

A Fase 0 da evolução para o clone do LinkedIn lida com a infraestrutura crítica e transversal que suportará os módulos sociais posteriores. A arquitetura atual do Workix é um Monólito Modular em Node.js com Express, GraphQL (Apollo/GraphQL-tools), Sequelize ORM, Redis (cache), RabbitMQ (filas) e Jest/ts-jest.

Nesta fase de fundação, estruturamos os 4 pilares:
1. Armazenamento de mídias binárias via URLs pré-assinadas.
2. Fábrica de conexão do Elasticsearch e worker de indexação assíncrona.
3. Servidor de WebSockets/Subscriptions via `graphql-ws`.
4. Módulo de notificações persistentes e consumidor da fila `notifications`.

## Goals / Non-Goals

**Goals:**
- Prover abstração de storage para mídias binárias sem sobrecarregar o Express com fluxos multipart.
- Ativar fábrica de conexão ao Elasticsearch e sincronização de índices desacoplada via RabbitMQ.
- Estender o servidor HTTP Express para suportar WebSockets e Subscriptions GraphQL em tempo real.
- Persistir e expor notificações via GraphQL e resolver a dívida técnica do `notification.service.ts`.
- Manter 100% de cobertura de testes unitários TDD (`ts-jest`) em todos os componentes.

**Non-Goals:**
- Construir a interface visual de chat ou feed (serão desenvolvidas nas Fases 1+).
- Migrar todo o banco relacional para banco de grafos (o MySQL/PostgreSQL via Sequelize atende o MVP).

## Decisions

1. **Decisão de Mídia Binária**: Utilizar o fluxo de URL pré-assinada (*Pre-signed URL*) onde o cliente solicita permissão via GraphQL (`requestUploadUrl`), envia o binário direto ao Object Storage e confirma a criação (`confirmUpload`).
   - *Alternativa descartada*: Receber uploads multipart diretamente no servidor Express via multer/busboy. Motivo: causa gargalo de I/O e CPU no event loop do Node.js.
2. **Decisão do Elasticsearch**: Sincronizar os índices de forma 100% assíncrona através da fila RabbitMQ `search-index-sync`.
   - *Alternativa descartada*: Indexar diretamente nos hooks do Sequelize (`afterSave`). Motivo: adicionaria a latência da requisição HTTP ao Elasticsearch na transação de escrita do banco relacional.
3. **Decisão de Subscriptions**: Utilizar `graphql-ws` sobre o módulo `ws` integrado ao servidor HTTP nativo do Node.js (`http.createServer(app)`).
   - *Alternativa descartada*: Criar um servidor WebSocket separado em outra porta. Motivo: complica a infraestrutura e o roteamento de CORS em produção.
4. **Decisão de Notificações**: Criar a tabela `notifications` e o worker consumidor `notification_consumer.ts` que consome a fila `notifications` do RabbitMQ, grava no banco e atualiza o Redis.

## Risks / Trade-offs

- **[Risco] Expiração de URLs pré-assinadas**: URLs de upload expiradas antes da conclusão pelo cliente.
  - *Mitigação*: Definir tempo de expiração razoável (15 minutos) e incluir tratamento de erro claro na mutation de confirmação.
- **[Risco] Desincronização do Elasticsearch**: Falhas temporárias no cluster do Elasticsearch.
  - *Mitigação*: Fila RabbitMQ com política de retentativa (DLQ - Dead Letter Queue) para reenviar mensagens com falha.
