## Context

Para transformar a plataforma Workix em uma aplicação de software corporativa de nível de maturidade profissional elevado, é necessário implementar componentes transversais de observabilidade, segurança de APIs e documentação de governança. Veja `proposal.md` para a motivação.

## Goals / Non-Goals

**Goals:**
- Implementar middleware `traceMiddleware` que gera/extrai Trace ID (`x-trace-id` / `x-correlation-id`) e o injeta no contexto Express e Apollo Server.
- Implementar utilitário `logger` estruturado em JSON com campos padronizados (level, timestamp, traceId, tenant, durationMs, message, error).
- Criar formatador de erros `formatGraphQLError` para o Apollo Server / express-graphql garantindo retorno de `{ code, message, timestamp, traceId }` sem vazamento de stack traces em produção.
- Desenvolver endpoints granulares de health check (`/health`, `/health/live`, `/health/ready`) com verificação ativa de conectividade e latência do Sequelize/Database, RabbitMQ e Elasticsearch.
- Implementar serviço em memória `IdempotencyService` para registrar e responder requisições identificadas por `Idempotency-Key`.
- Criar os documentos canônicos de arquitetura e operação: `ARCHITECTURE.md`, `OPERATIONS.md`, `SECURITY.md`, `CHANGELOG.md`.
- Garantir 100% de cobertura nos testes unitários e de integração existentes.

**Non-Goals:**
- Substituição do motor de banco de dados ou alteração de contratos GraphQL existentes.
- Dependência obrigatória de serviços externos de monitoramento (APM externo é opcional; o logging e health checks funcionam nativamente).

## Decisions

1. **Geração e Propagação de Trace ID**:
   - *Decisão*: Utilizar UUIDv4 com fallback ou extração de `x-trace-id` / `x-correlation-id`. O Trace ID é anexado aos headers de resposta HTTP `x-trace-id` e a todos os registros de log da requisição.
   - *Alternativas consideradas*: OpenTelemetry SDK completo (rejeitado por peso excessivo para esta fase inicial; a estrutura nativa é compatível e leve).

2. **Formatação de Erros Centralizada**:
   - *Decisão*: Função `formatGraphQLError` mapeia erros conhecidos (validação, autenticação, autorização, recurso não encontrado) para códigos semânticos e mascara erros inesperados com uma mensagem genérica apontando para o `traceId`.

3. **Readiness Probe com Timeout e Fallback**:
   - *Decisão*: O endpoint `/health/ready` executa `sequelize.authenticate()` com timeout curto (2s) para garantir que pod containers ou instâncias não travem a verificação em caso de instabilidade.

## Risks / Trade-offs

- **[Risco: Sobrecarga em logs estruturados]** → *Mitigação*: Logging assíncrono e controle de nível (`process.env.LOG_LEVEL || 'info'`).
- **[Risco: Consumo de memória em Idempotency Cache]** → *Mitigação*: TTL curto (10 minutos) e expiração automática de chaves antigas.
