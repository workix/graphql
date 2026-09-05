## Why

Atualmente, o sistema de vagas possui categorias e tipos de contratação limitados ou legados, dificultando a segmentação precisa de oportunidades para os usuários. Candidatos necessitam de filtros rápidos e navegação estruturada para encontrar vagas específicas (ex.: Meio Período, Estágio, Noturno, Primeira Oportunidade, Temporário, Freelance e Periculosidade) e tipos de contratação específicos (CLT, PJ, Contrato Temporário), com suporte a múltiplas características combinadas (ex.: Estágio + Meio Período + Noturno, ou Freelance + Remoto). 

Esta evolução padroniza essas definições de ponta a ponta (Backend, Motor de Busca, Frontend Web e Aplicativo Android), tornando a busca mais ágil e a experiência do usuário consistente em todas as plataformas, respeitando rigorosamente compatibilidade com registros legados e execução incremental em baby steps.

## What Changes

- **Backend / Modelagem & Persistência**:
  - Implementação das novas categorias de vagas: `MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE`, `PERICULOSIDADE`.
  - Implementação dos tipos de contratação (employment types): `CLT`, `PJ`, `CONTRATO_TEMPORARIO`.
  - Suporte a múltiplas características/categorias por vaga (combinação flexível) e tipo de contratação estruturado.
  - Migrations seguras sem operações destrutivas, garantindo retrocompatibilidade total com vagas existentes.
- **APIs & GraphQL**:
  - Atualização dos tipos, inputs e enums GraphQL (`JobCategory`, `JobEmploymentType`, `JobInput`, `JobSearchFilterInput`).
  - Atualização das mutations de criação (`createJob`) e edição (`updateJob`) para suportar as novas categorias e tipo de contratação.
  - Atualização das queries de consulta (`getJobById`, `allJobsPaginated`, `myJobs`, etc.) retornando as categorias e tipo de contratação.
- **Motor de Busca**:
  - Suporte a filtros por categoria individual, múltiplas categorias simultâneas e tipo de contratação em `searchJobs` e `jobSearchFacets`.
  - Atualização dos drivers de busca (Postgres / Elastic / Adaptive) e facetas agregadas para contagem das novas categorias e tipos de contratação.
- **Frontend Web**:
  - Nova seção de navegação dedicada por categorias de vagas.
  - Mecanismo visual de seleção de tipo de contratação (CLT, PJ, Contrato Temporário).
  - Atualização do formulário de cadastro e edição de vagas para seleção de categorias e tipo de contratação.
  - Motor de busca visual com seleção múltipla, exibição de filtros ativos e botão de limpar filtros.
- **Aplicativo Android**:
  - Seção dedicada de navegação por categorias de vagas no app Android.
  - Atualização dos modelos de dados e clientes GraphQL/API no Android.
  - Interface de busca com filtros de categorias e tipos de contratação consumindo as APIs do backend.
- **Estratégia Incremental (Baby Steps)**:
  - Divisão detalhada da execução em 15 etapas incrementais, isoladas, testadas com TDD e versionadas em commits individuais.

## Capabilities

### New Capabilities
- `job-categories-and-employment-types`: Modelagem, persistência, regras de negócio e APIs GraphQL para novas categorias de vagas (`MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE`, `PERICULOSIDADE`) e tipos de contratação (`CLT`, `PJ`, `CONTRATO_TEMPORARIO`).

### Modified Capabilities
- `jobs-search-engine`: Expansão do motor de busca para suportar filtros combináveis por múltiplas categorias, tipo de contratação e facetas estatísticas correspondentes.
- `graphql-jobs-feature`: Evolução das interfaces Web e Android para incorporar formulários de cadastro/edição com as novas opções, navegação por categorias e filtros no motor de busca.

## Impact

- **Modelos e Banco de Dados**: Tabela `jobs` e migrations correspondentes (`src/models/job.ts`, migrations do Sequelize).
- **GraphQL Schema & Resolvers**: `src/modules/jobs/graphql/schema.gql`, `src/modules/jobs/graphql/jobs.resolvers.ts`.
- **Search Drivers & Services**: `src/modules/jobs/search/types.ts`, `src/modules/jobs/search/adaptive_search.driver.ts`, `src/modules/jobs/search/postgres_search.driver.ts`, `src/modules/jobs/search/elasticsearch_search.driver.ts`.
- **Frontend Web**: Componentes de busca, filtros, formulário de vaga e navegação em `frontend/client` e `frontend/admin`.
- **Aplicativo Android**: Modelos, telas de busca, filtros e navegação em `android/app`.
- **Compatibilidade**: Totalmente retrocompatível. Vagas existentes sem categorias preenchidas continuam operacionais sem erros.
