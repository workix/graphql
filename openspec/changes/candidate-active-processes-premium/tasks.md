## 1. Backend e Schema GraphQL

- [ ] 1.1 Definir tipos `CandidateActiveProcess`, `CandidateActiveProcessesSummary` e query `candidateActiveProcesses(candidateId: ID!)` no schema GraphQL
- [ ] 1.2 Criar DTOs `CandidateActiveProcessDTO.ts` e `CandidateActiveProcessesSummaryDTO.ts`
- [ ] 1.3 Implementar método de consulta no repositório com agregação de processos seletivos e mascaramento de vagas confidenciais
- [ ] 1.4 Implementar resolvers no backend com validação de perfil de empresa, entitlement `can(companyId, 'VIEW_CANDIDATE_ACTIVE_PROCESSES')` e verificação de privacidade `reveal()`

## 2. Testes Unitários TDD Backend

- [ ] 2.1 Criar suíte de testes unitários TDD no backend cobrindo permissões, mascaramento confidencial, bloqueio para não-premium e fluxo de privacidade

## 3. Frontend Client e Componentes

- [ ] 3.1 Adicionar métodos no service de candidatos/processos seletivos do frontend (`frontend/client/src/services/`)
- [ ] 3.2 Criar componente `CandidateActiveProcessesBadge.vue` e modal de detalhes `CandidateActiveProcessesModal.vue`
- [ ] 3.3 Integrar o badge e modal na página `CandidateDetailView.vue`, `RecruitmentKanbanView.vue` e `PublicProfileView.vue`
- [ ] 3.4 Criar testes unitários Vitest no frontend para os novos componentes e serviços

## 4. Validação e Integração

- [ ] 4.1 Executar `npm test` no backend garantindo 100% de integridade
- [ ] 4.2 Executar `npm --prefix frontend/client test` no frontend
- [ ] 4.3 Validar fluxo no navegador e confirmar bloqueio amigável para plano gratuito e exibição para plano Premium
