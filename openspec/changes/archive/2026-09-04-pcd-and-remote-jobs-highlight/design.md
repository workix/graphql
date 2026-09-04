## Context

A plataforma Workix precisa dar máxima visibilidade a vagas destinadas a Pessoas com Deficiência (PCD) e vagas com modalidade de Trabalho Remoto. Esses critérios devem ser integrados de forma nativa e tratada como características de primeira classe tanto na camada de persistência quanto no motor de busca, schema GraphQL e interfaces.

## Goals / Non-Goals

**Goals:**
- Adicionar colunas `is_pcd`, `is_remote`, `pcd_details` e `accessibility_features` na tabela `jobs` via migração segura com defaults compatíveis.
- Atualizar o modelo `Job`, `JobDTO`, `CreateJobDTO` e `UpdateJobDTO` com getters/setters e sincronização automática entre `is_remote` e `workplace_type === 'REMOTE'`.
- Atualizar os drivers de busca (`PostgresSearchDriver`, `ElasticsearchSearchDriver`, `AdaptiveSearchDriver`) e `JobSearchEngineService` para suportar filtros `isPcd: Boolean`, `isRemote: Boolean` e contadores de facetas `pcdCount` e `remoteCount`.
- Atualizar o `schema.gql` e `jobs.resolvers.ts` com os novos campos e filtros, além das queries de conveniência `allPcdJobs` e `allRemoteJobs`.
- Garantir 100% de compatibilidade retroativa para vagas já existentes no banco de dados.

**Non-Goals:**
- Criar regras restritivas de planos para vagas PCD (publicação segue o modelo de cotas e gratuidade padrão da plataforma).

## Decisions

### 1. Modelagem e Sincronização de Modalidade Remota
- **Decisão**: A coluna `is_remote` (BOOLEAN) será mantida em sincronia com `workplace_type` ('REMOTE', 'HYBRID', 'ON_SITE'). Ao definir `isRemote: true` ou `workplaceType: 'REMOTE'`, ambos os campos refletirão o estado consistente.
- **Vantagem**: Facilita consultas diretas booleanas e filtros facetados detalhados simultaneamente.

### 2. Campos de Acessibilidade e Inclusão PCD
- **Decisão**: `is_pcd` (BOOLEAN, default false), `pcd_details` (TEXT para requisitos específicos de laudo ou adaptações do posto de trabalho) e `accessibility_features` (TEXT em formato JSON para armazenar recursos como acessibilidade física, software leitor de tela, intérprete de Libras, etc.).
- **Vantagem**: Atende tanto a requisitos legais de cotas quanto a detalhes práticos de acessibilidade para o candidato.

### 3. Integração no Motor de Busca e Facetas
- **Decisão**: Atualizar `JobSearchFilterInput` com `isPcd: Boolean` e `isRemote: Boolean`, permitindo combinações como `{ isPcd: true, isRemote: true }`. O objeto `JobSearchFacets` incluirá `pcdCount` e `remoteCount`.
- **Vantagem**: O frontend pode renderizar checkboxes de filtro rápido e badges com contadores dinâmicos.

## Risks / Trade-offs

- **[Risco]** Registros antigos de vagas sem preenchimento dos novos campos.
  - *Mitigação*: Valores padrão seguros (`is_pcd: false`, `is_remote: false`, `pcd_details: null`) e derivação automática de `is_remote` quando `workplace_type === 'REMOTE'`.
