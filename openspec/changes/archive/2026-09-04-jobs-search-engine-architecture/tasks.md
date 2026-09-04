## 1. Modelagem & Migrações de Busca

- [x] 1.1 Criar migração para adicionar campos de busca estruturada (`skills`, `workplace_type`, `seniority_level`, `city`, `state`) na tabela `jobs`
- [x] 1.2 Atualizar o modelo `Job` e os DTOs (`CreateJobDTO`, `UpdateJobDTO`, `JobDTO`) com os novos campos

## 2. Drivers de Busca & Estratégia Multi-Engine

- [x] 2.1 Criar a interface `JobSearchDriver` e contratos de parâmetros e resultados
- [x] 2.2 Implementar o `PostgresSearchDriver` com suporte a `tsvector`, `ts_rank` (pesos A, B, C) e filtros estruturados
- [x] 2.3 Implementar o `ElasticsearchSearchDriver` com consultas BM25 ponderadas, agregações e decaimento temporal
- [x] 2.4 Implementar o `AdaptiveSearchDriver` com cálculo de relevância ponderada em memória para testes e SQLite
- [x] 2.5 Criar a `SearchDriverFactory` para seleção dinâmica do driver conforme variáveis de ambiente

## 3. Motor de Busca de Empregos (JobSearchEngineService)

- [x] 3.1 Implementar `JobSearchEngineService` com busca ranqueada, time-decay, paginação e facetas
- [x] 3.2 Implementar extração de sugestões e autocomplete de termos de busca (`getSuggestions`)
- [x] 3.3 Implementar extração dedicada de facetas (`getFacets`)
- [x] 3.4 Implementar isolamento e injeção de slots de vagas patrocinadas (`sponsoredJobs`)

## 4. Sincronização Assíncrona via RabbitMQ & Workers

- [x] 4.1 Atualizar `jobs.repo.ts` e ciclo de vida do modelo `Job` para publicar eventos de sincronização (`search-index-sync`)
- [x] 4.2 Atualizar o worker `search_indexer_worker.ts` para processar e indexar documentos de vagas estruturados

## 5. Schema GraphQL & Resolvers de Busca de Vagas

- [x] 5.1 Adicionar novos tipos, inputs e enums de busca no `schema.gql` do módulo `jobs`
- [x] 5.2 Implementar os resolvers das queries `searchJobs`, `jobSearchFacets` e `jobSearchSuggestions` em `jobs.resolvers.ts`

## 6. Testes Automatizados TDD

- [x] 6.1 Criar testes unitários para a pontuação ponderada de relevância e time decay (`job_search_ranking.spec.ts`)
- [x] 6.2 Criar testes unitários para filtros facetados e contadores (`job_search_facets.spec.ts`)
- [x] 6.3 Criar testes unitários para sugestões e autocomplete (`job_search_suggestions.spec.ts`)
- [x] 6.4 Criar testes de integração GraphQL para `searchJobs` e preservação dos slots de vagas patrocinadas (`job_search_graphql.spec.ts`)
