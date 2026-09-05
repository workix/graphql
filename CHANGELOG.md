# Changelog - Workix Platform

Todas as alterações relevantes neste projeto são documentadas neste arquivo seguindo o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- **Novas Categorias de Vagas & Tipos de Contratação (Multi-Plataforma)**:
  - Suporte completo às 7 novas categorias de vagas: `MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE`, `PERICULOSIDADE`.
  - Suporte a múltiplos tipos de contratação: `CLT`, `PJ`, `CONTRATO_TEMPORARIO`.
  - **Backend GraphQL**: Schema SDL atualizado com enums `JobCategory`, `JobEmploymentType`, campos em `Job`, `JobInput`, `JobSearchFilterInput` e `JobSearchFacets`.
  - **Persistência**: Migration Sequelize segura com retrocompatibilidade (`categories` serializado em JSON, `employment_type` default `CLT`).
  - **Motor de Busca**: Drivers Adaptativo, PostgreSQL e Elasticsearch com suporte a filtros combinados e facetas dinâmicas por categoria e tipo de contratação.
  - **Frontend Web Admin**: Seleção de categorias e tipo de contratação na criação/edição de vagas.
  - **Frontend Web Cliente**: Filtros interativos na busca, chips de filtros ativos, badges nos cards de vagas e seção de navegação por categorias na Home.
  - **Aplicativo Android**: Modelos Kotlin (`JobGraphQL`, `JobFilterInput`, `JobSearchData`), repositório GraphQL, ViewModel reativo, BottomSheet de filtros e navegação por categorias na tela inicial.
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
