## Context

A plataforma Workix já conta com modelos para `ProfileView` e `VisibilitySetting`, além de um motor de busca avançado em `candidate_search_engine.service.ts`. Candidatos no plano Premium demandam visibilidade aprofundada sobre como seu currículo está performando no mercado, quantas vezes é listado em buscas de recrutadores, quais empresas visitaram seu perfil e quais termos de pesquisa geraram maior atratividade.

Veja `proposal.md` para a motivação do negócio e `specs/candidate-resume-reach-analytics-premium/spec.md` para os requisitos de comportamento.

## Goals / Non-Goals

**Goals:**
- Implementar o registro assíncrono e de alta performance de impressões de busca (`candidate_search_appearances`) no motor de busca de candidatos.
- Desenvolver o serviço `candidate_resume_reach_analytics.service.ts` para computar métricas agregadas, séries temporais diárias e ranking de termos de busca.
- Disponibilizar queries GraphQL seguras (`candidateResumeReachAnalytics` e `candidateProfileViewersDetailed`) com controle de autorização e anonimização LGPD (`show_as_viewed`).
- Aplicar gating por plano de assinatura (Free vs Premium): usuários Free visualizam métricas consolidadas e listas mascaradas com call-to-action de upgrade; usuários Premium acessam identidade detalhada dos visitantes e série histórica completa.
- Implementar painel analítico rico e responsivo no frontend client em `ProfileAnalyticsView.vue` com gráficos de evolução, cards de KPIs e lista de recrutadores.

**Non-Goals:**
- Envio de alertas em tempo real via push/e-mail para cada busca individual (as aparições em busca são agregadas estatisticamente; notificações continuam restritas a eventos explícitos).
- Exportação de relatórios em formato PDF/Excel nesta fase.

## Decisions

### 1. Registro em Lote e Assíncrono de Aparições em Busca
- **Decisão**: Ao retornar os resultados em `candidate_search_engine.service.ts`, disparar o registro em lote de `candidate_search_appearances` sem aguardar o retorno síncrono no fluxo principal da requisição HTTP (ou via `setImmediate` / Promise não bloqueante).
- **Alternativas consideradas**:
  - *Armazenar apenas contadores incrementais simples*: Perderia a granularidade temporal de dias/semanas e o tracking dos termos de busca digitados pelos recrutadores.
  - *Processar via fila RabbitMQ*: Possível evolução em escala massiva, porém inserção em lote no banco com Sequelize atende perfeitamente ao volume atual com simplicidade operacional.

### 2. Gating no Backend e Camada de Segurança GraphQL
- **Decisão**: A verificação de plano Premium (`subscription.plan.code != 'free_v1'` ou entitlement de perfil) ocorre tanto no resolver GraphQL quanto no serviço. Usuários Free recebem dados estruturados com flags `isPremium: false` e campos mascarados no próprio backend, impedindo vazamento de dados nominais por inspeção de rede.
- **Alternativas consideradas**:
  - *Mascarar apenas no frontend via CSS (blur)*: Inseguro, pois dados pessoais trafegariam na resposta JSON da API.

### 3. Anonimização Recíproca de Visualizadores
- **Decisão**: Se o usuário/recrutador visualizador marcou `show_as_viewed = false` nas configurações de visibilidade, o nome e empresa retornam com labels genéricos ("Recrutador Anônimo" ou "Usuário Workix"), mantendo a contabilização numérica.
- **Alternativas consideradas**:
  - *Não registrar o evento de visualização*: Prejudicaria a contagem total de visitas do candidato.

### 4. Série Temporal e Agrupamento Diário Dinâmico
- **Decisão**: A agregação temporal agrupa visualizações e aparições por data (`YYYY-MM-DD`) no intervalo solicitado (7, 30, 90 dias ou 365 dias), preenchendo dias sem atividade com zero para permitir renderização fluida de gráficos no frontend.

## Risks / Trade-offs

- **[Risco] Crescimento rápido da tabela `candidate_search_appearances`** → *Mitigação*: Criação de índices compostos em `(candidate_id, created_at)` e integração com a rotina de purga periódica em `visibilityService.purgeOldProfileViews()` (retenção máxima de 12 meses para Premium e 7 dias para Free).
- **[Risco] Sobrecarga de performance durante buscas volumosas** → *Mitigação*: Registro em lote (`bulkCreate`) assíncrono pós-paginação, gravando impressões apenas dos candidatos efetivamente retornados na página corrente do recrutador.

## Migration Plan

1. Criar migration Sequelize `20260905193000-create_tables_candidate_search_appearances.ts`.
2. Registrar o modelo `CandidateSearchAppearance` no ORM e configurar associações.
3. Executar migrations e atualizar seeders de dados demonstrativos.
4. Implementar testes unitários e de integração para garantir zero regressão.
