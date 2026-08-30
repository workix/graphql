## Context

A Fase 1 constrói as funcionalidades sociais primárias do clone do LinkedIn (Grafo de Conexões, Perfil Estendido, Feed de Posts com Reações/Comentários e Chat 1:1) sobre a infraestrutura da Fase 0 (Storage, Subscriptions WebSocket, RabbitMQ e Elasticsearch).

## Goals / Non-Goals

**Goals:**
- Implementar modelo relacional de conexões (`connections`, `connection_requests`, `follows`) com calculador de grau social.
- Estender perfil do usuário (`user_profiles`) integrado com busca global no Elasticsearch.
- Criar módulo de posts com mídia binária anexada, feed dinâmico e 5 tipos de reações (LIKE, CELEBRATE, SUPPORT, LOVE, INSIGHTFUL).
- Desenvolver mensageria 1:1 com entrega instantânea via GraphQL Subscriptions (`graphql-ws`).
- Manter 100% de cobertura de testes unitários TDD (`ts-jest`).

**Non-Goals:**
- Grupos, eventos ou hashtags (planejados para a Fase 3).
- Recomendação algorítmica por Machine Learning (o feed será ordenado por data e conexões de 1º grau no MVP).

## Decisions

1. **Decisão de Conexões (Grafo Relacional)**: Utilizar tabela `connections` com pares ordenados `(user_id_1, user_id_2)` indexados e tabela `follows` para seguir sem conexão mútua.
   - *Alternativa descartada*: Adicionar banco de dados de grafos (ex: Neo4j) nesta fase. Motivo: O volume inicial e as consultas SQL com `EXISTS` e CTEs atendem com performance sub-millissegunda.
2. **Decisão de Feed de Posts**: O feed consulta posts do próprio usuário e de suas conexões de 1º grau (`user_id IN (SELECT connection_id FROM connections WHERE user_id = :currentUserId)`), paginado via cursor.
3. **Decisão de Mensageria 1:1**: Restringir envio de mensagens diretas no MVP para conexões de 1º grau. Mensagens para não-conexões (InMail pago) são reservadas para a Fase 4.

## Risks / Trade-offs

- **[Risco] Fan-out de Notificações em Posts de Alta Relevância**: Múltiplas reações/comentários gerando carga no RabbitMQ.
  - *Mitigação*: Agrupamento de notificações no consumidor (`notification_consumer.ts`) antes da emissão.
