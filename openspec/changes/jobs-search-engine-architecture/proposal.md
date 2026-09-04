## Why

Atualmente, a busca de vagas na plataforma Workix depende de paginações lineares e filtros simples via banco de dados sem pontuação de relevância lexical, ponderação de campos ou agregação facetada. Para oferecer uma experiência moderna, rápida e altamente assertiva a candidatos e recrutadores (conforme especificado na estratégia de arquitetura de busca e no Plano de Negócios Workix v2.0), é necessário implementar um motor de busca de empregos robusto com cálculo de relevância ponderada (Título 3x-5x, Skills 2x, Descrição 1x), decaimento temporal (*time decay*), filtros facetados dinâmicos, autocompletação (*typeahead suggestions*), sincronização assíncrona orientada a eventos via RabbitMQ e compatibilidade multi-engine (PostgreSQL Full-Text Search com `tsvector`/GIN e Elasticsearch/OpenSearch BM25).

## What Changes

- **Motor de Busca Especializado (`JobSearchEngineService`)**: Criação de serviço de busca centralizado com algoritmo de pontuação ponderada (pesos A, B, C), decaimento temporal por frescor da vaga e suporte a múltiplos backends (PostgreSQL FTS, Elasticsearch/OpenSearch e fallback adaptativo para testes/desenvolvimento).
- **Filtros Facetados e Agregações**: Extração dinâmica de facetas e contadores (`workplace_type`, `job_type`, `seniority`/`level`, `state`/`city`, `skills` e faixas salariais).
- **Sugestões e Autocomplete (`jobSearchSuggestions`)**: Endpoint GraphQL para preenchimento automático de termos de busca, títulos de cargos e tecnologias mais buscadas.
- **Sincronização Orientada a Eventos**: Hooks no modelo `Job` que publicam eventos no RabbitMQ (`search-index-sync`) para manter o índice sempre atualizado em tempo real (inserção, atualização, expiração e exclusão).
- **Preservação do Ranking Orgânico e Destaques Patrocinados**: Inclusão de slots destacados e demarcados (`sponsoredJobs`) na resposta de busca sem distorcer o cálculo orgânico de relevância.
- **Schema e Resolvers GraphQL**: Adição das queries `searchJobs`, `jobSearchFacets` e `jobSearchSuggestions` com paginação, filtros e ordenações configuráveis.
- **Campos Estruturados no Modelo `Job`**: Adição de campos para enriquecimento de busca como `skills` (JSON/Array), `workplace_type`, `seniority_level`, `city`, `state` e `search_vector`.

## Capabilities

### New Capabilities
- `jobs-search-engine`: Motor de busca, normalização, indexação ponderada (pesos A/B/C), decaimento temporal, filtros facetados, agregação estatística, sugestões de preenchimento e sincronização assíncrona de vagas.

### Modified Capabilities
- `graphql-jobs-feature`: Expansão dos recursos de busca e listagem pública de vagas para suportar consultas textuais ranqueadas, facetas dinâmicas e slots patrocinados isolados.

## Impact

- **Modelos e Migrações**: Atualização da tabela `jobs` com campos estruturados (`skills`, `workplace_type`, `seniority_level`, `city`, `state`) e índice `search_vector`.
- **APIs GraphQL**: Novas queries `searchJobs`, `jobSearchFacets` e `jobSearchSuggestions`, com novos tipos (`JobSearchResult`, `JobSearchFacets`, `FacetCount`, `JobSuggestion`, `JobSearchFilterInput`, `JobSearchSortBy`).
- **Workers e Filas**: Worker de indexação (`search_indexer_worker.ts`) e produtor de sincronização no repositório de vagas.
- **Compatibilidade e Testes**: Suporte transparente a testes unitários com banco SQLite/in-memory e PostgreSQL/Elasticsearch em produção.
