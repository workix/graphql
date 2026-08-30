# Proposta: Etapa 3 — Primeira Funcionalidade End-to-End (Módulo de Vagas / Jobs)

## Why
Para validar todo o pipeline de ponta a ponta (transporte GraphQL, stores de estado, roteamento, templates visuais, tratamento de estados de erro/loading e aplicativo mobile), é fundamental implementar uma primeira funcionalidade representativa e central de negócio. O módulo de Vagas (`Jobs`) é a espinha dorsal do sistema de empregos (Jobseek), envolvendo listagens paginadas, filtros de pesquisa, detalhes de entidade, candidatura a vaga (`subscribeInJob`) e gerenciamento administrativo de vagas (`createJob`, `updateJob`, `deleteJob`).

## What Changes
- **Frontend Cliente (`frontend/client`)**:
  - Implementação da listagem pública de vagas com paginação (`allJobsPaginated`), busca e filtros (`allJobsFeatured`).
  - Implementação da tela de detalhes da vaga (`getJobById`).
  - Implementação da ação real de candidatura na vaga (`subscribeInJob`).
  - Tratamento visual de loading, feedback de sucesso e estados vazios.
- **Frontend Admin (`frontend/admin`)**:
  - Implementação do CRUD completo de Vagas no painel administrativo (`allJobsPaginated`, `createJob`, `updateJob`, `deleteJob`).
  - Tabela com paginação, ações de edição, exclusão com confirmação e modal de cadastro de vaga.
- **Android (`android/`)**:
  - Implementação da tela de listagem de vagas com LazyColumn / RecyclerView consumindo `allJobsPaginated`.
  - Tela de detalhes da vaga e botão de candidatura (`subscribeInJob`).
- Remoção completa de mocks de vagas em todos os 3 projetos.

## Capabilities

### New Capabilities
- `graphql-jobs-feature`: Implementação completa e integrada do módulo de Vagas (Jobs) no Frontend Cliente, Frontend Admin e Android consumindo as queries e mutations reais do backend GraphQL sem mocks.

### Modified Capabilities
<!-- Nenhuma especificação existente teve seus requisitos alterados nesta etapa -->

## Impact
- **Frontend Cliente**: Telas de vagas (`/jobs`, `/jobs/:id`) integradas ao GraphQL real com design Jobseek preservado.
- **Frontend Admin**: Gestão de vagas no painel (`/admin/jobs`) com formulários e tabela reativa.
- **Android**: Telas de busca, listagem e detalhe de vaga integradas à API.
- **Backend**: Nenhum endpoint alterado; uso das operações existentes.
