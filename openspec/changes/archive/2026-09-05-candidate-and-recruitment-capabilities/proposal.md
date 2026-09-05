## Why

A plataforma Workix precisa evoluir os fluxos de ponta a ponta para candidatos, recrutadores e empresas contratantes, conectando ativamente a busca de talentos com ferramentas operacionais de alta eficiência. 

Atualmente, recrutadores necessitam de ferramentas externas para triagem visual de candidatos (estilo Kanban) e agendamento de entrevistas, enquanto empresas Premium demandam a publicação de vagas confidenciais para posições estratégicas. Do lado dos candidatos, é essencial permitir a estruturação rica de currículos em Markdown normalizado e a explicitação de status cruciais de carreira, tais como "Procurando Emprego" e "Em Transição de Carreira" (com área alvo e abertura para oportunidades de entrada).

Disponibilizar essas capabilities de forma nativa e integrada no Backend GraphQL, Frontend Web e Aplicativo Android fortalece a retenção de usuários, monetização do plano Premium e precisão dos algoritmos de busca e recomendação profissional.

## What Changes

- **Currículo Normalizado com Markdown**:
  - Modelo de dados estruturado para currículos em Markdown contemplando resumo, experiências, empresas, cargos, formação, certificações, idiomas, competências e objetivos.
  - Editor web com preview em tempo real e componente de renderização segura no Frontend Web e Aplicativo Android.
  - Normalização automática a partir dos dados existentes do perfil e indexação profunda para o motor de busca de talentos.
- **Agenda de Entrevistas (Premium Empresas)**:
  - Controle de autorização validando plano corporativo Premium via backend (`can()`).
  - Criação de entrevistas vinculadas a vagas e candidatos (data, horário, duração, modalidade, status e notas).
  - Envio de convites e gestão de confirmação, recusa ou solicitação de remarcação pelo candidato.
  - Calendário e listagem de entrevistas futuras, pendentes e concluídas no Web e Android.
- **Kanban de Triagem de Recrutamento (Premium Empresas)**:
  - Pipeline de triagem configurável por vaga (colunas, ordenação e etapas personalizáveis).
  - Cards visuais de candidatos com dados consolidados e histórico auditável de movimentações.
  - Operação Drag & Drop fluida no Frontend Web e interface touch adaptada para Android.
- **Status "Procurando Emprego" e "Em Transição de Carreira"**:
  - Atributos e flags no perfil do candidato: `looking_for_job`, `in_career_transition`, `career_transition_target` e `accepts_entry_level`.
  - Badges visuais no perfil público e filtros refinados para recrutadores na busca de candidatos.
- **Empresa Confidencial (Vagas Premium)**:
  - Flag `is_confidential` em vagas de empresas Premium, ocultando nome, logotipo e dados de identificação na visão pública do candidato, sem quebrar a amarração relacional interna para triagem e relatórios.
- **Busca de Candidatos Aprimorada**:
  - Filtros combinados por status de transição, área de transição, busca ativa de emprego, tecnologias, competências e termos contidos no currículo normalizado.

## Capabilities

### New Capabilities
- `normalized-markdown-resume`: Modelo, edição, preview, renderização multiplataforma e indexação de currículos estruturados em Markdown.
- `interview-scheduler-premium`: Módulo de agendamento, convites e gestão de entrevistas para empresas Premium com integração no aplicativo Android.
- `recruitment-kanban-board-premium`: Painel Kanban visual de gestão e triagem de candidatos por processo seletivo de vaga para contas Premium.
- `career-transition-and-job-seeking-status`: Flags de disponibilidade profissional e transição de carreira no perfil do candidato com filtros avançados.
- `confidential-job-postings-premium`: Publicação e visualização pública segura de vagas confidenciais com proteção contra vazamento de identidade.

### Modified Capabilities
- `candidate-privacy-visibility`: Extensão da exibição pública e controle de privacidade do candidato contemplando os novos status de carreira e currículo Markdown.
- `jobs-search-engine`: Inclusão dos novos filtros de currículo, status de busca ativa e transição de carreira no motor de busca de candidatos.

## Impact

- **Backend GraphQL**:
  - Novos schemas e types: `Interview`, `InterviewInput`, `KanbanStage`, `KanbanCard`, `ResumeMarkdown`, `CandidateSearchFilterInput`.
  - Novos resolvers de mutations e queries com validação de permissões de plano corporativo (`EntitlementsService`).
  - Migrations Sequelize para novas tabelas (`interviews`, `kanban_stages`, `kanban_cards`, `normalized_resumes`) e extensões de colunas em `candidates` e `jobs`.
- **Frontend Web (`frontend/client` e `frontend/admin`)**:
  - Novos componentes: Editor/Viewer Markdown, Kanban interativo com drag & drop, Agenda de entrevistas, Seletor de status no perfil e formulários de vagas confidenciais.
- **Aplicativo Android (`android/app`)**:
  - Data classes Kotlin, repositórios GraphQL, ViewModels, Bottom Sheets e fragments/telas para visualização de Markdown, Kanban simplificado, agenda de entrevistas e badges de status.
- **Segurança e Compatibilidade**:
  - Validação de regras Premium exclusivamente no servidor.
  - Anonimização estrita de metadados em vagas confidenciais.
  - 100% de retrocompatibilidade com candidatos e vagas preexistentes.
