## Context

Ver `proposal.md` para motivação e justificativa de negócio.
O ecossistema Workix possui suporte a planos corporativos com controle de features via `can(organizationId, featureKey)` e controle de privacidade em conformidade com a LGPD via função `reveal()`. Atualmente, a tabela `candidates_subscribed_selective_processes` e `selective_processes` armazenam as inscrições e status dos candidatos. Esta funcionalidade conecta essas entidades aos recrutadores assinantes do plano Premium de forma segura e auditável.

## Goals / Non-Goals

**Goals:**
- Implementar query GraphQL `candidateActiveProcesses(candidateId: ID!)` retornando listagem estruturada dos processos em andamento.
- Adicionar tipo `CandidateActiveProcessesSummary` com contagem total e flag `hasActiveProcesses`.
- Implementar gating rigoroso no backend validando permissão `VIEW_CANDIDATE_ACTIVE_PROCESSES` da empresa solicitante.
- Integrar com a função server-side `reveal()` para respeitar as preferências de privacidade do candidato (`share_active_processes_with_recruiters`).
- Mascarar no nível do backend a identidade de empresas cujas vagas concorrentes sejam confidenciais (`isConfidential = true`).
- Criar componentes visuais e badges informativos no Frontend Client (`frontend/client`) nas páginas `CandidateDetailView.vue`, `RecruitmentKanbanView.vue` e `PublicProfileView.vue`.
- Exibir modal/drawer de detalhes com etapas, data de inscrição e status do candidato.

**Non-Goals:**
- Não expor notas internas, feedbacks confidenciais ou avaliações feitas por recrutadores de outras empresas.
- Não expor processos seletivos já arquivados ou encerrados.
- Não permitir que candidatos vejam processos concorrentes de outros candidatos.

## Decisions

### Decisão 1: Autorização de Entitlement e Privacidade Centralizadas no Resolver
- **Opção escolhida**: O resolver `candidateActiveProcesses` valida sequencialmente: (1) autenticação do usuário, (2) perfil de empresa, (3) entitlement `can(viewerCompanyId, 'VIEW_CANDIDATE_ACTIVE_PROCESSES')`, e (4) consentimento via `reveal(candidate, viewerCompany, 'ACTIVE_PROCESSES')`.
- **Alternativas consideradas**: Filtragem no frontend (rejeitada por violar segurança e expor dados na rede).

### Decisão 2: Mascaramento de Vagas Confidenciais no DTO / Repository
- **Opção escolhida**: Quando a vaga associada ao processo seletivo tiver a flag `is_confidential = true` ou a empresa optar por sigilo, o `CandidateActiveProcessDTO` substitui o nome da empresa por `"Empresa Confidencial"` e suprime o logotipo antes da serialização GraphQL.
- **Alternativas consideradas**: Exposição de todos os nomes de empresas (rejeitada por violar o contrato de vagas confidenciais já existente).

### Decisão 3: Experiência de UI com Badge Proativo e Modal de Detalhes
- **Opção escolhida**: Adicionar um badge dinâmico no cabeçalho do perfil do candidato e nos cards do Kanban de Recrutamento. Ao clicar no badge, recrutadores Premium abrem um modal com a linha do tempo e etapas das seleções ativas. Para usuários sem plano Premium, o badge exibe indicação de recurso Premium com botão de upgrade/planos.
- **Alternativas consideradas**: Página separada exclusiva (rejeitada por fragmentar a experiência do recrutador durante a triagem).

## Risks / Trade-offs

- **[Risco] Empresa gratuita tentando acessar query diretamente via GraphQL playground ou script** → Mitigação: O resolver lança erro GraphQL explícito com código `FORBIDDEN` e mensagem amigável de restrição de plano.
- **[Risco] Candidato com processo ativo em vaga confidencial ter a empresa exposta** → Mitigação: Sanitização no backend antes do retorno do payload.
- **[Risco] Desempenho em listagens com múltiplos candidatos (N+1)** → Mitigação: Consulta agregada e otimizada por `candidate_id` com índices no banco de dados.
