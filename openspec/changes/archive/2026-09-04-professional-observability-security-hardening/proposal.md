## Why

Para atender com excelência aos critérios de uma aplicação de software profissional corporativa (conforme documentado no guia de critérios profissionais), a plataforma Workix precisa consolidar mecanismos nativos de observabilidade (Trace ID/Correlation ID, logs estruturados JSON, endpoints aprofundados de liveness/readiness), segurança de APIs (formatação de erros padronizada sem vazamento de stack traces, cabeçalho de idempotência) e governança operacional.

## What Changes

- **Trace ID & Correlation ID**: Middleware para capturar ou gerar identificadores únicos (`x-trace-id`, `x-correlation-id`) propagados no contexto da requisição, no GraphQL, nos logs e no cabeçalho de resposta HTTP.
- **Logs Estruturados JSON**: Utilitário de logging corporativo que registra eventos em formato estruturado (nível, timestamp ISO, tenant, userId, traceId, durationMs, operação e erro).
- **Tratamento de Erros Padronizado**: Formatador unificado de erros GraphQL e Express retornando o contrato `{ code, message, timestamp, traceId }`, evitando exposição de detalhes internos do banco de dados ou stack traces para clientes finais.
- **Health Checks Aprofundados (Liveness/Readiness)**: Endpoints `/health`, `/health/live` e `/health/ready` com sondagem ativa de saúde do Banco de Dados (Sequelize), RabbitMQ e Elasticsearch com medição de latência.
- **Idempotência de Requisições Críticas**: Suporte ao cabeçalho `Idempotency-Key` para prevenir execução duplicada em pagamentos e mutações críticas.
- **Governança & Documentação Técnica**: Criação de `ARCHITECTURE.md`, `OPERATIONS.md`, `SECURITY.md` e `CHANGELOG.md` estruturados.

## Capabilities

### New Capabilities
- `observability-tracing-and-health-core`: Fornece rastreabilidade de requisições com Trace ID, logs estruturados em JSON e endpoints de liveness/readiness para observabilidade e cloud readiness.
- `api-security-and-idempotency-hardening`: Fornece tratamento seguro e padronizado de erros, proteção de mutações com idempotency keys e higienização de respostas de API.

## Impact

- **Backend & Middleware**: Interceptação de requisições Express/GraphQL para injeção de `traceId`, logging estruturado e formatError.
- **Monitoramento & Infraestrutura**: Integração com orquestradores (Kubernetes, AWS ECS, GCP) através de endpoints `/health/live` e `/health/ready`.
- **Compatibilidade**: Total retrocompatibilidade com o ecossistema existente, mantendo 100% de sucesso nos testes.
