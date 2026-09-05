## Context

O sistema gerencia vagas através da entidade `Job` (`src/models/job.ts`) e expõe operações de busca, detalhamento e CRUD via GraphQL (`src/modules/jobs/graphql/`). O motor de busca (`src/modules/jobs/search/`) provê busca ponderada e facetas facetadas com drivers adaptativos (PostgreSQL e SQLite/Elasticsearch). Os clientes consumidores compreendem o Frontend Web (`frontend/client` e `frontend/admin`) e o aplicativo móvel Android (`android/app`).

Atualmente, `job_category` é armazenado como string única e `job_type` representa valores legados. Para atender aos novos requisitos de múltiplas categorias simultâneas (`MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE`, `PERICULOSIDADE`) e tipos de contratação explícitos (`CLT`, `PJ`, `CONTRATO_TEMPORARIO`), a arquitetura técnica deve estender os modelos e persistência mantendo total retrocompatibilidade e sem migrações destrutivas.

## Goals / Non-Goals

**Goals:**
- Prover modelagem estruturada e tipada para `categories` (array/JSON) e `employment_type` (string/enum) na entidade `Job`.
- Atualizar o schema GraphQL com novos enums (`JobCategory`, `JobEmploymentType`) e campos nos types, inputs e filtros.
- Habilitar suporte nos drivers de busca para multi-filtros em queries e cálculo de contadores nas facetas de busca.
- Implementar UI/UX no Frontend Web (Cliente e Admin) e Aplicativo Android com navegação por categorias, chips de filtros ativos e seleção múltipla.
- Organizar toda a entrega na sequência de 15 baby steps definida na especificação, garantindo TDD, isolamento de commits e compilabilidade a cada passo.

**Non-Goals:**
- Não alterar regras de negócio não relacionadas (como precificação de planos, algoritmos de recomendação social ou billing).
- Não remover ou alterar destrutivamente colunas legadas no banco de dados para evitar quebra de integrações legadas existentes.

## Decisions

### 1. Modelagem de Dados e Persistência
- **Decisão**: Adicionar a coluna `categories` (armazenada como JSON/TEXT serializado com default `[]`, espelhando o padrão já utilizado com sucesso em `skills` e `accessibility_features` no modelo `Job`) e a coluna `employment_type` (VARCHAR(50), nullable, default `CLT`).
- **Racional**: Permite que uma vaga possua simultaneamente 0, 1 ou N categorias (ex: `["ESTAGIO", "MEIO_PERIODO", "NOTURNO"]`) sem necessitar de tabelas adicionais complexas, mantendo alta performance de leitura e serialização direta no GraphQL e drivers de busca.
- **Alternativas consideradas**:
  - *Tabela associativa de categorias (`jobs_categories`)*: Descartada para esta fase pois adicionaria overhead desnecessário de joins na busca e viola o padrão de arrays embutidos já estabelecido no projeto (`skills`, `accessibility_features`).

### 2. Contrato GraphQL e Retrocompatibilidade
- **Decisão**: 
  - Manter `jobCategory` e `jobType` legados nos schemas para compatibilidade com clientes antigos, preenchendo automaticamente o primeiro valor ou fallback.
  - Adicionar o campo `categories: [JobCategory!]!` e `employmentType: JobEmploymentType` no type `Job`, `JobInput` e `JobSearchFilterInput`.
  - Novos enums:
    ```graphql
    enum JobCategory {
      MEIO_PERIODO
      PRIMEIRA_OPORTUNIDADE
      ESTAGIO
      NOTURNO
      TEMPORARIO
      FREELANCE
      PERICULOSIDADE
    }

    enum JobEmploymentType {
      CLT
      PJ
      CONTRATO_TEMPORARIO
    }
    ```
- **Racional**: Garante que versões anteriores dos frontends e serviços não sofram breaking changes enquanto as novas versões passam a consumir os novos campos estruturados.

### 3. Motor de Busca e Facetas Agregadas
- **Decisão**:
  - Atualizar `JobSearchFilter` para suportar `categories?: JobCategory[]` e `employmentType?: JobEmploymentType`.
  - Atualizar o driver adaptativo (`AdaptiveSearchDriver` / `PostgresSearchDriver`) para filtrar via cláusulas compatíveis (ex.: JSON/TEXT match no SQLite/Postgres) quando `categories` for informado, aplicando operador AND para cruzamento com modalidade remota e tipo de contratação.
  - Adicionar contadores `categories` e `employmentTypes` em `JobSearchFacets`.
- **Racional**: Facilita a montagem dinâmica dos checkboxes de filtros nas interfaces web e mobile com contagens em tempo real.

### 4. Consistência Frontend e Android
- **Decisão**:
  - Centralizar as constantes de categorias e tipos de contratação com labels amigáveis e ícones no Frontend Web e Android, mapeadas 1:1 com os enums GraphQL do Backend.
  - Implementar navegação dedicada com rotas `/jobs/category/:category` e filtros dinâmicos na busca com sincronização de query params na URL (Web) e navegação com ViewModel (Android).

## Risks / Trade-offs

- **[Vagas legadas sem categorias ou employmentType definidos]** → *Mitigação*: Tratar defaults defensivos no resolver e model (`categories = categories || []`, `employmentType = employmentType || 'CLT'`).
- **[Concorrência ou lentidão na busca com múltiplos filtros]** → *Mitigação*: Criar índices no banco de dados e garantir queries otimizadas no driver adaptativo de busca.
- **[Divergência de enums entre plataformas]** → *Mitigação*: GraphQL Schema como Single Source of Truth, validado por testes unitários e de integração em cada repositório.

## Migration Plan

1. Executar migration para adicionar `categories` e `employment_type` na tabela `jobs` com valores default seguros.
2. Atualizar models, GraphQL schemas, resolvers e search drivers no backend com testes unitários cobrindo todos os cenários.
3. Atualizar Frontend Web (Admin e Client) e validar fluxo de criação, edição, filtros e navegação.
4. Atualizar Android App e validar filtros e navegação por categorias.
