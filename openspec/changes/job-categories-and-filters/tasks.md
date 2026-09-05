## 1. Análise da Arquitetura Atual

- [x] 1.1 Mapear modelo de dados da entidade `Job`, schema GraphQL, search drivers e componentes de frontend/Android
- [x] 1.2 Identificar pontos de alteração no backend, frontend web e app Android
- [x] 1.3 Documentar arquitetura de categorias e filtros de vagas no repositório

## 2. Modelagem das Categorias no Backend

- [x] 2.1 Criar enum e constantes para categorias de vagas (`MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE`, `PERICULOSIDADE`)
- [x] 2.2 Adicionar testes unitários para validação das novas categorias
- [x] 2.3 Atualizar interfaces e tipos TypeScript de vagas com suporte a múltiplas categorias

## 3. Tipo de Contratação no Backend

- [x] 3.1 Criar enum e constantes para tipos de contratação (`CLT`, `PJ`, `CONTRATO_TEMPORARIO`)
- [x] 3.2 Adicionar testes unitários para validação dos tipos de contratação
- [x] 3.3 Integrar o tipo de contratação nas definições de tipos TypeScript de vagas

## 4. Persistência de Dados

- [x] 4.1 Criar migration Sequelize para adicionar colunas `categories` e `employment_type` na tabela `jobs`
- [x] 4.2 Atualizar modelo `Job` (`src/models/job.ts`) com getters, setters e defaults seguros (`categories = []`, `employment_type = 'CLT'`)
- [x] 4.3 Implementar testes de persistência garantindo compatibilidade com registros existentes

## 5. API GraphQL: Cadastro e Edição

- [x] 5.1 Atualizar `schema.gql` com os enums `JobCategory` e `JobEmploymentType`, e novos campos em `JobInput`
- [x] 5.2 Atualizar resolvers de `createJob` e `updateJob` para processar e persistir `categories` e `employmentType`
- [x] 5.3 Implementar testes automatizados das mutations `createJob` e `updateJob`

## 6. API GraphQL: Consulta

- [x] 6.1 Atualizar type `Job` no `schema.gql` expondo `categories: [JobCategory!]!` e `employmentType: JobEmploymentType`
- [x] 6.2 Atualizar resolvers de consulta (`getJobById`, `allJobsPaginated`, `allJobsFeatured`, `myJobs`)
- [x] 6.3 Implementar testes automatizados para retorno e deserialização dos novos campos nas queries

## 7. API GraphQL: Busca e Filtros

- [x] 7.1 Atualizar `JobSearchFilterInput` no `schema.gql` com `categories: [JobCategory!]` e `employmentType: JobEmploymentType`
- [x] 7.2 Atualizar `types.ts` e drivers de busca (`AdaptiveSearchDriver`, `PostgresSearchDriver`, `ElasticsearchSearchDriver`)
- [x] 7.3 Implementar contagem de facetas para categorias e tipos de contratação em `JobSearchFacets`
- [x] 7.4 Implementar testes de busca cobrindo filtros individuais, combinados e facetas

## 8. Frontend Web: Cadastro e Edição de Vagas

- [x] 8.1 Adicionar seleção de múltiplas categorias no formulário de vagas no Frontend Admin
- [x] 8.2 Adicionar campo de seleção de tipo de contratação (CLT, PJ, Contrato Temporário)
- [x] 8.3 Conectar mutações GraphQL e validar salvamento e edição

## 9. Frontend Web: Filtros do Motor de Busca

- [x] 9.1 Adicionar checkboxes de categorias de vagas no painel de filtros do Frontend Cliente
- [x] 9.2 Adicionar seleção de tipo de contratação (CLT, PJ, Contrato Temporário)
- [x] 9.3 Implementar chips de filtros ativos e botão de limpar filtros
- [x] 9.4 Integrar filtros reativos com a query `searchJobs` e facetas

## 10. Frontend Web: Navegação por Categorias

- [x] 10.1 Criar seção visual e atalhos de navegação para cada categoria de vaga
- [x] 10.2 Configurar rotas e redirecionamento com filtros pré-selecionados
- [x] 10.3 Validar responsividade e UX da navegação por categorias

## 11. Aplicativo Android: Modelos e Consumo de API

- [ ] 11.1 Atualizar queries/mutations GraphQL e modelos de dados de vagas no app Android
- [ ] 11.2 Implementar mapeamento de `categories` e `employmentType` nos DTOs e repositórios Kotlin
- [ ] 11.3 Criar testes unitários para os novos modelos no Android

## 12. Aplicativo Android: Filtros de Busca

- [ ] 12.1 Implementar tela/bottom sheet de filtros com seleção de categorias e tipo de contratação
- [ ] 12.2 Conectar os filtros à busca consumindo a query GraphQL `searchJobs`
- [ ] 12.3 Exibir badges e filtros ativos na listagem de resultados

## 13. Aplicativo Android: Navegação por Categorias

- [ ] 13.1 Criar carrossel/grid de categorias na tela inicial de vagas do Android
- [ ] 13.2 Configurar navegação para listagem de vagas pré-filtrada por categoria
- [ ] 13.3 Testar fluxos de navegação e transições de tela no Android

## 14. Testes e Regressão

- [ ] 14.1 Executar suíte de testes de regressão no Backend (Cadastro, Edição, Consulta, Busca, Vagas Antigas)
- [ ] 14.2 Executar testes de integração com filtros individuais e combinados (ex.: Estágio + Noturno + CLT)
- [ ] 14.3 Validar build e testes do Frontend Web e Aplicativo Android

## 15. Revisão Final e Fechamento

- [ ] 15.1 Realizar auditoria cruzada entre Backend, Frontend Web, Android e Banco de Dados
- [ ] 15.2 Atualizar documentações (`ARCHITECTURE.md`, `SPECIFICATION.md`, changelog)
- [ ] 15.3 Validar critérios de aceite completos do projeto
