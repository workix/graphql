## Why

Promover inclusão e flexibilidade no mercado de trabalho é um dos pilares centrais da plataforma Workix. Para atender plenamente a candidatos com deficiência e profissionais que buscam modalidades de trabalho flexíveis, o sistema deve tratar **Vagas para PCD** e **Vagas Remotas** como características de primeira classe em todo o ciclo de vida de vagas (backend, busca, GraphQL e interfaces).

## What Changes

- **Campos de Primeira Classe no Modelo de Vagas**: Adição dos campos `is_pcd` (booleano), `is_remote` (booleano derivado/explícito), `pcd_details` (texto com detalhes de acessibilidade e laudo) e `accessibility_features` (array de recursos como leitor de tela, acessibilidade física, etc.) na tabela `jobs`.
- **Compatibilidade Retroativa Total**: Vagas antigas mantêm compatibilidade sem necessidade de migração manual forçada (default `is_pcd: false`, `is_remote: false` baseado no `workplace_type`).
- **Filtros e Facetas no Motor de Busca**:
  - Filtros diretos: `isPcd: Boolean`, `isRemote: Boolean`, e combinações ("Somente PCD", "Somente Remotas", "PCD e Remotas").
  - Agregação de contadores em `JobSearchFacets` (`pcdCount`, `remoteCount`, `pcdRemoteCount`).
- **Schema e Resolvers GraphQL**:
  - Exposição de `isPcd`, `isRemote`, `pcdDetails`, `accessibilityFeatures` no tipo `Job` e no input `JobInput`.
  - Atualização do `JobSearchFilterInput` com `isPcd` e `isRemote`.
  - Queries de atalho/destaque (`allPcdJobs`, `allRemoteJobs`).
- **Destaque Visual e Experiência do Usuário**:
  - Badges e indicadores visuais de acessibilidade e trabalho remoto.
  - Exibição destacada na página de detalhes da vaga e formulários de publicação para empresas.

## Capabilities

### Modified Capabilities
- `jobs-search-engine`: Suporte a filtros de busca e facetas agregadas para vagas PCD e remotas (`isPcd`, `isRemote`).
- `graphql-jobs-feature`: Inclusão dos campos, filtros, badges informativos e atalhos para vagas PCD e remotas no fluxo de criação, edição, detalhes e listagens de vagas.
- `android-screens-flows`: Exibição de badges de acessibilidade PCD e trabalho remoto na JobDetailActivity, formulário PostJobActivity e listagens no app Android.

## Impact

- **Banco de Dados & Migrações**: Nova migração adicionando colunas `is_pcd`, `is_remote`, `pcd_details`, `accessibility_features` na tabela `jobs`.
- **Modelos e DTOs**: Atualização de `Job`, `JobDTO`, `CreateJobDTO`, `UpdateJobDTO`.
- **Motor de Busca**: Atualização dos drivers (`PostgresSearchDriver`, `ElasticsearchSearchDriver`, `AdaptiveSearchDriver`) e `JobSearchEngineService`.
- **GraphQL**: Atualização de `schema.gql` e `jobs.resolvers.ts`.
