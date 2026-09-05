## Why

Recrutadores e empresas com planos Premium necessitam de maior visibilidade sobre a liquidez e o momento profissional de candidatos em processos de contratação na Workix. Saber se o candidato está participando ativamente de outros processos seletivos, a quantidade de vagas concorridas e o status atual nessas seleções permite que a empresa avalie a competitividade e a urgência de sua proposta. Essa funcionalidade agrega alto valor aos planos corporativos pagos, respeitando estritamente o consentimento do candidato e as políticas de privacidade da LGPD.

## What Changes

- Adição de consulta GraphQL protegida `candidateActiveProcesses(candidateId: ID!)` retornando o resumo e a lista detalhada de processos seletivos em andamento do candidato (vaga, empresa confidencial/anônima se configurada, estágio atual, data de inscrição).
- Adição do campo `activeProcessesSummary` no tipo GraphQL `Candidate` e `UserProfile` com contagem total de processos seletivos ativos.
- Gating de segurança no backend baseado em autorização e entitlements de plano (`can(organizationId, 'VIEW_CANDIDATE_ACTIVE_PROCESSES')`), retornando erro de autorização ou dados restritos para empresas em plano gratuito ou usuários não autorizados.
- Verificação de privacidade via `reveal()` e configurações de privacidade do candidato (`share_active_processes_with_recruiters`).
- Componente visual no Frontend Client (`frontend/client`) dentro da página de detalhes do candidato (`/candidates/:id`), no Kanban (`/kanban/:jobId`) e no perfil público (`/in/:id`), exibindo badge de "Participando de N processos" e modal/card expansível com a lista de processos ativos exclusivamente para recrutadores autenticados com plano Premium.

## Capabilities

### New Capabilities
- `candidate-active-processes-premium`: Especifica a consulta, permissões de planos corporativos, dados de processos seletivos ativos e interface visual para recrutadores Premium.

### Modified Capabilities
- `candidate-privacy-visibility`: Adiciona a chave de preferência de visibilidade `share_active_processes_with_recruiters` nas configurações de privacidade do candidato e validação na função server-side `reveal()`.

## Impact

- **Backend (`src/`)**:
  - Novo resolver e campo no módulo `selective_processes` ou `candidates`.
  - Integração com `entitlements` (`can()`) e `privacy` (`reveal()`).
  - DTOs e tipos GraphQL `CandidateActiveProcess`, `CandidateActiveProcessesSummary`.
- **Frontend Client (`frontend/client/`)**:
  - Service de candidatos e vagas com queries de processos ativos.
  - Exibição de cards/badges de processos ativos em `CandidateDetailView.vue`, `RecruitmentKanbanView.vue` e `PublicProfileView.vue`.
  - Integração com plano Premium e exibição de upsell/bloqueio quando a empresa não for assinante.
- **Android App (`android/app/`)**:
  - DTOs e visualização correspondente no perfil do candidato para empresas.
