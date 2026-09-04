# Changelog - Workix Platform

Todas as alterações relevantes neste projeto são documentadas neste arquivo seguindo o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- **White Label Multi-Tenant Architecture**:
  - Modelo `WhiteLabelConfig`, migração e seeder com tenant default e TechCorp.
  - `TenantResolverService` com cache em memória, suporte a domínios customizados, `Host` header, `x-tenant-slug` e `x-tenant-id`.
  - Injeção dinâmica de CSS variables no DOM (`theme_injector.ts`) e tokens para Android Mobile.
- **Motor de Busca de Empregos**:
  - Drivers de busca multi-engine: Postgres FTS (`pg_trgm` + `tsvector`), Elasticsearch e driver adaptativo.
  - Ranking ponderado A/B/C, decaimento temporal de relevância e destaque para vagas PCD e Remotas.
  - Facetamento dinâmico e sugestões de digitação (typeahead autocomplete).
- **Observabilidade & Confiabilidade Profissional**:
  - Middleware de **Trace ID / Correlation ID** (`x-trace-id`, `x-correlation-id`).
  - **Logs Estruturados em JSON** (`StructuredLogger`).
  - Sondas aprofundadas de **Health Check** (`/health`, `/health/live`, `/health/ready`).
  - **Formatador Padronizado de Erros** GraphQL e Express sem vazamento técnico.
  - **Idempotency Guard** com suporte ao cabeçalho `Idempotency-Key`.
  - Documentação canônica corporativa (`ARCHITECTURE.md`, `OPERATIONS.md`, `SECURITY.md`).
