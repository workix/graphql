## 1. Modelagem & Migrações para PCD e Remoto

- [ ] 1.1 Criar migração para adicionar colunas `is_pcd`, `is_remote`, `pcd_details`, `accessibility_features` na tabela `jobs`
- [ ] 1.2 Atualizar o modelo `Job` e os DTOs (`JobDTO`, `CreateJobDTO`, `UpdateJobDTO`) com os novos campos e sincronização de modalidade remota

## 2. Atualização dos Drivers de Busca & Facetas

- [ ] 2.1 Atualizar tipos de busca (`JobSearchFilter`, `JobSearchFacets`) em `types.ts` com suporte a PCD e Remoto
- [ ] 2.2 Atualizar `AdaptiveSearchDriver` para aplicar filtros combinados de PCD/Remoto e calcular `pcdCount` e `remoteCount`
- [ ] 2.3 Atualizar `PostgresSearchDriver` e `ElasticsearchSearchDriver` com filtros e agregações de PCD/Remoto

## 3. Schema GraphQL & Resolvers

- [ ] 3.1 Atualizar `schema.gql` com campos de PCD/Remoto em `Job`, `JobInput`, `JobSearchFilterInput`, `JobSearchFacets` e queries `allPcdJobs`, `allRemoteJobs`
- [ ] 3.2 Implementar resolvers para `allPcdJobs` e `allRemoteJobs` em `jobs.resolvers.ts`

## 4. Testes Automatizados TDD

- [ ] 4.1 Criar testes unitários para o modelo e DTOs de vagas com suporte e compatibilidade retroativa para PCD e Remoto (`job_pcd_remote_model.spec.ts`)
- [ ] 4.2 Criar testes unitários para filtros de busca e facetas de PCD e Remoto (`job_pcd_remote_search.spec.ts`)
- [ ] 4.3 Criar testes de integração GraphQL para listagem e consulta com badges de PCD e Remoto (`job_pcd_remote_graphql.spec.ts`)
