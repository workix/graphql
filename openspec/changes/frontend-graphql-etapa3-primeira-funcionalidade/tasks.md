## 1. Módulo de Vagas no Frontend Cliente

- [ ] 1.1 Criar `frontend/client/src/services/jobs.service.ts` com queries (`allJobsPaginated`, `getJobById`, `allJobsFeatured`) e mutation `subscribeInJob`
- [ ] 1.2 Implementar/atualizar a view `JobsView.vue` com listagem de vagas, paginação, loading spinner e empty state
- [ ] 1.3 Implementar/atualizar a view `JobDetailView.vue` com detalhes da vaga e modal/ação de candidatura
- [ ] 1.4 Integrar rotas `/jobs` e `/jobs/:id` no roteador do Cliente

## 2. Módulo de Vagas no Frontend Admin

- [ ] 2.1 Criar `frontend/admin/src/services/jobs.service.ts` com CRUD completo (`allJobsPaginated`, `createJob`, `updateJob`, `deleteJob`)
- [ ] 2.2 Implementar a view `AdminJobsView.vue` com tabela de vagas (`v-data-table`), paginação, busca e filtros
- [ ] 2.3 Implementar modal de criação e edição de vaga com validação de campos
- [ ] 2.4 Implementar diálogo de confirmação de exclusão com atualização automática da listagem

## 3. Módulo de Vagas no Aplicativo Android

- [ ] 3.1 Criar repositório e modelos Kotlin para Jobs (`JobRepository.kt`, `Job.kt`)
- [ ] 3.2 Implementar tela de listagem de vagas com suporte a paginação e pull-to-refresh
- [ ] 3.3 Implementar tela de detalhes da vaga e botão de candidatura conectada ao GraphQL
