## Context

Veja a motivação detalhada em `proposal.md` e as diretrizes do documento de arquitetura `prompt-motor_de_busca_empregos.md`.

A plataforma Workix opera com stack Node.js/TypeScript, Apollo GraphQL, Sequelize ORM (PostgreSQL em produção e SQLite em testes/desenvolvimento), mensageria RabbitMQ e cliente `@elastic/elasticsearch`. O objetivo deste design é implementar um motor de busca modular, de alta performance e desacoplado, capaz de operar tanto com bancos relacionais (PostgreSQL FTS com `tsvector` e índice GIN) quanto com engines dedicadas (Elasticsearch/OpenSearch com BM25) ou em memória para testes.

## Goals / Non-Goals

**Goals:**
- Implementar o padrão **Search Driver Strategy** (`JobSearchDriver`) com suporte para:
  1. `ElasticsearchSearchDriver`: Consultas BM25 com `multi_match` ponderado (`title^4`, `skills^2`, `description^1`), filtros facetados (`terms`, `range`) e decaimento temporal (`gauss`/`decay` de 14 dias).
  2. `PostgresSearchDriver`: Consultas FTS com `tsvector`, `ts_rank` (pesos A, B, C), dicionário de idioma `'portuguese'` e índice GIN.
  3. `AdaptiveSearchDriver` / `SqliteSearchDriver`: Mecanismo adaptativo determinístico para testes unitários e CI sem dependência de serviços externos.
- Criar serviço centralizador `JobSearchEngineService` com métodos `search()`, `getFacets()`, `getSuggestions()` e `indexJob()`.
- Implementar extração de facetas agregadas (`workplace_type`, `job_type`, `seniority_level`, `state`, `skills`).
- Implementar endpoint de sugestões/autocomplete (`jobSearchSuggestions`).
- Atualizar hooks de ciclo de vida do modelo `Job` e o worker de fila RabbitMQ (`search_indexer_worker.ts`) para sincronização em tempo real.
- Integrar os novos tipos, queries e inputs no schema GraphQL do módulo de vagas.
- Garantir isolamento das vagas patrocinadas (`sponsoredJobs`) para preservação inegociável do ranking orgânico (`RANKING.md`).

**Non-Goals:**
- Indexação semântica vetorial pesada (PGVector / Embeddings com LLM) nesta fase inicial, priorizando latência sub-50ms e baixo custo operacional.

## Decisions

### 1. Arquitetura de Drivers de Busca (Driver Strategy Pattern)
- **Decisão**: Criar a interface `JobSearchDriver` e fábrica `SearchDriverFactory` que seleciona a implementação com base no ambiente (`SEARCH_ENGINE=elasticsearch|postgres|adaptive`).
- **Alternativas consideradas**:
  - *Apenas Elasticsearch*: Tornaria a execução de testes locais e de novos desenvolvedores dependente de um container Elasticsearch ativo.
  - *Apenas SQL LIKE*: Não provê pontuação por relevância, ponderação de termos nem suporte a busca fonética/stemming.
- **Vantagem**: Máxima flexibilidade, garantindo que o código de produção use todo o poder do Elasticsearch/Postgres FTS enquanto a suíte de testes do CI roda rápida e 100% confiável.

### 2. Fórmula de Ponderação e Decaimento Temporal (Ranking Score)
- **Decisão**:
  - Título da vaga: Peso A (4.0)
  - Tags e Requisitos Chave (Skills): Peso B (2.0)
  - Descrição e Benefícios: Peso C (1.0)
  - *Time Decay Bonus*: Multiplicador adicional decrescente de até 1.5x para vagas publicadas nos últimos 7 a 14 dias (`bonus = 1.0 + max(0, (14 - dias_criacao) / 28)`).
- **Vantagem**: Evita que vagas antigas ou termos secundários na descrição fiquem no topo das buscas, aumentando a assertividade para o candidato.

### 3. Extração e Agregação de Facetas Dinâmicas
- **Decisão**: A consulta de busca processa agregações sobre os atributos estruturados (`workplace_type`, `job_type`, `seniority_level`, `state`, `skills`), retornando `JobSearchFacets` contendo a lista de opções com suas respectivas contagens.
- **Vantagem**: Permite que o Frontend Cliente monte caixas de seleção inteligentes com números exatos de vagas em cada categoria.

### 4. Sincronização Assíncrona via Fila (`search-index-sync`)
- **Decisão**: O repositório de vagas dispara payloads de sincronização na fila RabbitMQ ao salvar ou atualizar vagas. O `search_indexer_worker.ts` processa e atualiza os índices de forma não-bloqueante.
- **Vantagem**: Operações de CRUD na API mantêm latência mínima (<10ms) sem travar a thread HTTP aguardando a indexação do motor de busca.

## Risks / Trade-offs

- **[Risco]** Divergência entre dados do banco relacional e do índice de busca.
  - *Mitigação*: Mensagens transacionais pós-commit via hooks do Sequelize e endpoint de sincronização em lote (`reindexAllJobs`).
- **[Risco]** Variação de sintaxe de Full-Text Search entre bancos.
  - *Mitigação*: Camada de abstração de driver isolada, com testes unitários cobrindo o contrato de cada driver.
