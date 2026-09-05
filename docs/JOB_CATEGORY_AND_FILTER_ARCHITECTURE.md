# Arquitetura de Categorias e Filtros de Vagas

## 1. Visão Geral
Este documento estabelece o mapeamento detalhado da arquitetura atual e define os pontos exatos de extensão no Backend GraphQL, Banco de Dados, Motor de Busca, Frontend Web (Cliente e Admin) e Aplicativo Android para suportar as novas categorias de vagas (`MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE`, `PERICULOSIDADE`) e os tipos de contratação (`CLT`, `PJ`, `CONTRATO_TEMPORARIO`).

---

## 2. Componentes Identificados e Mapeamento de Arquivos

### 2.1 Backend — Modelagem e Persistência
- **Modelo Sequelize**: `src/models/job.ts`
  - *Situação atual*: `job_category` (VARCHAR) e `job_type` (VARCHAR) armazenam valores singulares legados. `skills` e `accessibility_features` usam padrão TEXT/JSON serializado.
  - *Modificação*: Adicionar coluna `categories` (TEXT/JSON, default `'[]'`) e coluna `employment_type` (VARCHAR(50), default `'CLT'`).
- **Migrations**: `src/migrations/`
  - *Nova migration*: Migration não-destrutiva adicionando `categories` e `employment_type` com defaults seguros sem quebrar registros existentes.

### 2.2 Backend — DTOs e Camada GraphQL
- **DTOs**: `src/dtos/JobDTO.ts`, `src/dtos/JobMutationDTO.ts`
  - *Modificação*: Deserialização e parsing seguro de `categories` (array de strings) e `employmentType` (string enum).
- **GraphQL Schema**: `src/modules/jobs/graphql/schema.gql`
  - *Modificação*:
    - Adicionar enums: `JobCategory` e `JobEmploymentType`.
    - Atualizar types: `Job`, `JobInput`, `JobSearchFilterInput` e `JobSearchFacets`.
- **GraphQL Resolvers & Repo**:
  - `src/modules/jobs/graphql/jobs.resolvers.ts`
  - `src/modules/jobs/repository/jobs.repo.ts`

### 2.3 Backend — Motor de Busca e Drivers
- **Tipos de Busca**: `src/modules/jobs/search/types.ts`
  - *Modificação*: Estender `JobSearchFilter` com `categories?: string[]` e `employmentType?: string`, e `JobSearchFacets` com contagens agregadas de `categories` e `employmentTypes`.
- **Drivers de Busca**:
  - `src/modules/jobs/search/adaptive_search.driver.ts`
  - `src/modules/jobs/search/postgres_search.driver.ts`
  - `src/modules/jobs/search/elasticsearch_search.driver.ts`
  - *Modificação*: Filtragem multi-categoria (combinações com AND), filtro de tipo de contratação e agregação nas facetas.

### 2.4 Frontend Web
- **Frontend Cliente**: `frontend/client/src/`
  - `views/JobsListView.vue`: Filtros com checkboxes de categorias, seleção de tipo de contratação, chips de filtros ativos e limpar filtros.
  - `views/HomeView.vue`: Seção de atalhos e navegação dedicada por categorias.
  - `views/JobDetailView.vue`: Exibição de badges com categorias e tipo de contratação.
  - `views/PostJobView.vue`: Formulário de publicação com seleção de categorias e tipo de contrato.
  - `services/graphql.ts`: Queries `searchJobs` e mutations atualizadas.
- **Frontend Admin**: `frontend/admin/src/`
  - `views/AdminJobsView.vue`: Módulo CRUD com campos de multi-seleção de categorias e tipo de contratação.

### 2.5 Aplicativo Android
- **Modelos e DTOs**: `android/app/src/main/java/br/com/codecode/workix/android/data/model/JobGraphQL.kt`
  - *Modificação*: Adicionar campos `categories: List<String>?` e `employmentType: String?`.
- **Interface e Navegação**:
  - Telas de listagem, busca e detalhes de vagas com suporte a filtros e navegação por categorias.

---

## 3. Estratégia de Enums e Constantes
- **Categorias Suportadas**:
  1. `MEIO_PERIODO` (Meio Período)
  2. `PRIMEIRA_OPORTUNIDADE` (Primeira Oportunidade)
  3. `ESTAGIO` (Estágio)
  4. `NOTURNO` (Noturno)
  5. `TEMPORARIO` (Emprego Temporário)
  6. `FREELANCE` (Freelance)
  7. `PERICULOSIDADE` (Periculosidade)
- **Tipos de Contratação Suportados**:
  1. `CLT` (CLT)
  2. `PJ` (PJ)
  3. `CONTRATO_TEMPORARIO` (Contrato Temporário)

---

## 4. Garantia de Retrocompatibilidade
- Vagas legadas sem categorias cadastradas retornarão `categories: []` e `employmentType: "CLT"` como fallback seguro.
- Queries GraphQL e clientes antigos que consultarem `jobCategory` e `jobType` continuarão funcionando sem quebra de contrato.
