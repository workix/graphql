## Context

O ecossistema Workix é composto por Backend GraphQL (Node.js, TypeScript, Apollo Server, Sequelize), Frontends Web (Vue 3, Pinia, Vite) e Aplicativo Mobile nativo Android (Kotlin, Coroutines, StateFlow, GraphQL Client).

A arquitetura já possui serviços canônicos de autorização por planos (`EntitlementsService`), privacidade do candidato (`VisibilityService` / `reveal()`), motor de busca multi-engine (`AdaptiveSearchDriver`, `PostgresSearchDriver`, `ElasticsearchSearchDriver`) e sistema de notificações. As novas capabilities serão integradas de forma ortogonal, reutilizando esses blocos fundamentais com garantia de isolamento e alta coesão.

## Goals / Non-Goals

**Goals:**
- Prover suporte completo de dados, regras de negócio e APIs GraphQL para Currículo Markdown, Agenda de Entrevistas, Kanban de Triagem, Status de Carreira e Vagas Confidenciais.
- Validar todas as travas e permissões Premium estritamente no backend através do `EntitlementsService` (`can()`).
- Proteger 100% a identidade de empresas em vagas confidenciais consumidas por candidatos.
- Garantir renderização segura contra XSS de Markdown no Web e visualização nativa fluida no Android.
- Desenvolver interfaces reativas, componentizadas e responsivas no Frontend Web e Aplicativo Android.
- Manter 100% de compatibilidade retroativa com registros legados de candidatos e vagas existentes.

**Non-Goals:**
- Implementação de sala de videoconferência WebRTC proprietária própria (o sistema suportará links de reuniões externas como Google Meet, Zoom, Teams).
- Integração bidirecional com Google Calendar/Outlook via OAuth neste ciclo inicial (foco na agenda interna integrada da plataforma).
- Mudanças destrutivas no schema de banco de dados.

## Decisions

### 1. Modelo de Currículo Normalizado e Sanitização Markdown
- **Decisão**: Criar a tabela `normalized_resumes` vinculada 1:1 ao candidato (`candidate_id`), contendo `raw_markdown` (TEXT), `parsed_json` (JSONB/TEXT estruturado) e `completeness_score` (INTEGER).
- **Sanitização**: Sanitização rigorosa no backend (removendo tags `<script>`, `<iframe>` e eventos inline) antes da persistência.
- **Frontend & Android**: No Frontend Web, usar parser seguro (ex.: `marked` ou `markdown-it` com DOMPurify); no Android, utilizar parser Markdown nativo para `Spanned` strings em `TextView` garantindo alta performance sem WebView pesado.
- **Alternativas consideradas**:
  - *Armazenar apenas JSON puro*: Rejeitado por limitar a liberdade de formatação e diagramação profissional do candidato.
  - *Armazenar apenas HTML*: Rejeitado por risco de segurança e dificuldade de conversão para Android nativo.

### 2. Módulo de Agenda de Entrevistas (Premium)
- **Decisão**: Tabela `interviews` contendo `id`, `uuid`, `job_id`, `candidate_id`, `company_id`, `scheduled_at`, `duration_minutes`, `format` (`ONLINE`, `IN_PERSON`), `location_or_link`, `notes`, `status` (`PENDING`, `CONFIRMED`, `DECLINED`, `RESCHEDULE_REQUESTED`, `CANCELLED`, `COMPLETED`), `created_at`, `updated_at`.
- **Autorização**: Acesso condicionado a `EntitlementsService.can(companyId, 'SCHEDULE_INTERVIEWS')`.
- **Alternativas consideradas**:
  - *Utilizar eventos gerais da plataforma*: Rejeitado para preservar o isolamento do processo seletivo e manter regras de negócio específicas de recrutamento.

### 3. Pipeline Kanban de Recrutamento (Premium)
- **Decisão**: Tabelas `kanban_stages` (`id`, `job_id`, `title`, `stage_order`, `color_hex`, `is_final`, `created_at`) e `kanban_cards` (`id`, `stage_id`, `job_id`, `candidate_id`, `position_order`, `notes`, `updated_at`). Tabela `kanban_card_histories` para auditoria temporal.
- **Autorização**: Acesso protegido por `can(companyId, 'USE_RECRUITMENT_KANBAN')`.
- **Frontend Web**: Drag and drop reativo com atualização otimista e sincronização via mutations GraphQL.
- **Android**: Abas segmentadas com lista de cards e botões de ação rápida para avanço/retrocesso de etapa.

### 4. Status "Procurando Emprego" e "Em Transição de Carreira"
- **Decisão**: Adicionar colunas na tabela `candidates`:
  - `looking_for_job` (BOOLEAN, default `false`)
  - `in_career_transition` (BOOLEAN, default `false`)
  - `career_transition_target` (VARCHAR(150), nullable)
  - `accepts_entry_level` (BOOLEAN, default `false`)
- **Controle de Privacidade**: Os status respeitam as chaves de visibilidade gerenciadas pelo `VisibilityService`.

### 5. Mascaramento de Vagas Confidenciais (Premium)
- **Decisão**: Adicionar a coluna `is_confidential` (BOOLEAN, default `false`) na tabela `jobs`.
- **Lógica de Mascaramento em DTO/Resolvers**: Se `job.is_confidential === true` e o solicitante da requisição não for membro autenticado da empresa dona da vaga, o resolver GraphQL mascara:
  - `company.name` → `"Empresa Confidencial"`
  - `company.logo` → `null`
  - `company.description` → `"Informações da empresa preservadas sob confidencialidade."`
  - Campos de contato corporativo e URLs identificadoras são suprimidos.

### 6. Busca Avançada de Candidatos
- **Decisão**: Estender `CandidateSearchFilterInput` com `lookingForJob`, `inCareerTransition`, `careerTransitionTarget`, `skills`, `resumeKeywords`. O driver de busca pondera ocorrências no perfil e no currículo normalizado.

## Risks / Trade-offs

- **[Risco] Injeção de código Malicioso via Markdown**:
  - *Mitigação*: Sanitização obrigatória no backend na mutation `saveNormalizedResume` e sanitização no frontend antes da renderização.
- **[Risco] Vazamento acidental da identidade da empresa confidencial em queries aninhadas**:
  - *Mitigação*: Centralização do mascaramento no `JobDTO` e no resolver raiz `Job.company`, aplicando a regra em todas as consultas (`searchJobs`, `allJobsPaginated`, `getJobById`, etc.).
- **[Risco] Gargalo de performance em consultas Kanban com centenas de candidatos**:
  - *Mitigação*: Paginação e carregamento sob demanda dos cards por etapa do Kanban com índices compostos em `(job_id, stage_id, position_order)`.

## Migration Plan

1. Executar migrations Sequelize para criar novas tabelas (`normalized_resumes`, `interviews`, `kanban_stages`, `kanban_cards`, `kanban_card_histories`) e adicionar colunas sem restrição `NOT NULL` nas tabelas preexistentes (`candidates`, `jobs`).
2. Atualizar schemas SDL e resolvers GraphQL com validações de planos.
3. Atualizar DTOs e drivers de busca.
4. Implementar componentes web e telas Android de forma modular.
5. Rollback seguro: As novas tabelas e colunas possuem valores default nulos/false, permitindo reversão de código sem quebra de integridade no banco de dados.
