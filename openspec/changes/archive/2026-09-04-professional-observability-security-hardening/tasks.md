## 1. Observabilidade & Trace ID

- [x] 1.1 Criar utilitário `src/utils/logger.ts` para emissão de logs estruturados em JSON com campos de trace, tenant e métricas
- [x] 1.2 Implementar middleware `src/middleware/trace.middleware.ts` para propagação de `x-trace-id` / `x-correlation-id`
- [x] 1.3 Criar serviço e rotas aprofundadas de Health Check (`/health`, `/health/live`, `/health/ready`) em `src/utils/health.ts`

## 2. Segurança de APIs & Idempotência

- [x] 2.1 Implementar formatador de erros padronizado `src/utils/error_formatter.ts` para GraphQL e Express
- [x] 2.2 Implementar serviço `src/utils/idempotency.service.ts` e middleware de suporte ao cabeçalho `Idempotency-Key`
- [x] 2.3 Integrar Trace ID, Error Formatter, Idempotency e Health Checks no servidor em `src/index.ts`

## 3. Governança & Documentação Técnica Corporativa

- [x] 3.1 Criar `ARCHITECTURE.md` detalhando as camadas, fluxos, módulos e arquitetura limpa
- [x] 3.2 Criar `OPERATIONS.md` detalhando procedimentos operacionais, deploy, health check, logs, migrações e rollback
- [x] 3.3 Criar `SECURITY.md` e `CHANGELOG.md` documentando diretrizes de segurança, LGPD e histórico de versões

## 4. Testes Automatizados & Validação

- [x] 4.1 Criar testes unitários para `trace.middleware`, `logger` e `error_formatter` em `tests/unit/observability_and_security.spec.ts`
- [x] 4.2 Criar testes unitários para `health.ts` e `idempotency.service` em `tests/unit/health_and_idempotency.spec.ts`
- [x] 4.3 Executar bateria completa de testes (`npm test`) garantindo 100% de aprovação
