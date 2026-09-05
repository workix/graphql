## 1. Modelagem e Migrations de Banco de Dados

- [x] 1.1 Criar migration Sequelize para adicionar colunas de status de carreira em `candidates` (`looking_for_job`, `in_career_transition`, `career_transition_target`, `accepts_entry_level`)
- [x] 1.2 Criar migration Sequelize para adicionar a coluna `is_confidential` em `jobs`
- [x] 1.3 Criar migration Sequelize para as tabelas `normalized_resumes`, `interviews`, `kanban_stages`, `kanban_cards` e `kanban_card_histories`
- [x] 1.4 Atualizar os modelos Sequelize e interfaces TypeScript com tipagens, associações e defaults seguros

## 2. Regras de Negócio e APIs: Status do Candidato e Privacidade

- [x] 2.1 Adicionar novos campos de status de carreira no schema GraphQL (`Candidate`, `CandidateInput`, `UpdateCandidateProfileInput`)
- [x] 2.2 Atualizar resolvers de mutação do candidato (`updateCandidateProfile`) e DTOs correspondentes
- [x] 2.3 Atualizar `VisibilityService` / `reveal()` para respeitar as preferências de visibilidade dos status de carreira
- [x] 2.4 Criar testes unitários para as mutations e validações dos status de carreira

## 3. Regras de Negócio e APIs: Currículo Normalizado em Markdown

- [x] 3.1 Criar schema GraphQL para `NormalizedResume`, `NormalizedResumeInput` e mutation `saveNormalizedResume`
- [x] 3.2 Implementar serviço de normalização automática (`ResumeNormalizationService`) para compilar Markdown a partir de dados do perfil
- [x] 3.3 Implementar sanitização server-side anti-XSS no salvamento do Markdown
- [x] 3.4 Criar testes unitários para sanitização, parsing e persistência do currículo normalizado

## 4. Regras de Negócio e APIs: Vagas Confidenciais (Premium)

- [x] 4.1 Adicionar campo `isConfidential: Boolean` em `Job` e `JobInput` no schema GraphQL
- [x] 4.2 Adicionar validação de plano Premium (`can('POST_CONFIDENTIAL_JOBS')`) na criação e edição de vagas confidenciais
- [x] 4.3 Implementar mascaramento dinâmico em `JobDTO` e resolvers GraphQL para omitir dados da empresa para candidatos
- [x] 4.4 Criar testes unitários de permissão e mascaramento de vagas confidenciais

## 5. Regras de Negócio e APIs: Agenda de Entrevistas (Premium)

- [x] 5.1 Criar schema GraphQL com types `Interview`, enums (`InterviewStatus`, `InterviewFormat`), inputs e mutations (`createInterview`, `updateInterview`, `respondInterview`, `cancelInterview`)
- [x] 5.2 Implementar validação de plano Premium (`can('SCHEDULE_INTERVIEWS')`) no serviço `InterviewService`
- [x] 5.3 Implementar queries de listagem e detalhes de entrevistas para empresas e candidatos
- [x] 5.4 Criar testes unitários para o ciclo de vida completo de agendamento e respostas de entrevistas

## 6. Regras de Negócio e APIs: Kanban de Triagem de Recrutamento (Premium)

- [x] 6.1 Criar schema GraphQL para `KanbanStage`, `KanbanCard`, `KanbanBoard` e mutations (`createKanbanStage`, `updateKanbanStage`, `moveKanbanCard`, `reorderKanbanStages`)
- [x] 6.2 Implementar validação de plano Premium (`can('USE_RECRUITMENT_KANBAN')`) no serviço `KanbanService`
- [x] 6.3 Implementar registro de auditoria em `kanban_card_histories` a cada transição de etapa
- [x] 6.4 Criar testes unitários para movimentação, ordenação e permissões do Kanban

## 7. Motor de Busca de Candidatos e Facetas

- [x] 7.1 Estender `CandidateSearchFilterInput` no schema GraphQL com filtros por `lookingForJob`, `inCareerTransition`, `careerTransitionTarget` e palavras-chave de currículo
- [x] 7.2 Atualizar search drivers (`AdaptiveSearchDriver`, `PostgresSearchDriver`, `ElasticsearchSearchDriver`) para indexar e ponderar os termos do currículo Markdown
- [x] 7.3 Implementar contagem de facetas para status de busca e transição de carreira
- [x] 7.4 Criar testes unitários para a busca avançada de candidatos com filtros combinados

## 8. Frontend Web: Status do Candidato e Currículo Markdown

- [x] 8.1 Criar componente de configuração de status de carreira no painel de perfil do candidato (Web Cliente)
- [x] 8.2 Desenvolver o editor de Markdown com preview em tempo real e botão de normalização automática do currículo
- [x] 8.3 Implementar componente de visualização segura e badges visuais no perfil público do candidato
- [x] 8.4 Integrar novos filtros de candidatos na página de busca de talentos

## 9. Frontend Web: Vagas Confidenciais e Gestão de Vagas

- [ ] 9.1 Adicionar switch de "Vaga Confidencial" com checagem visual de plano Premium no formulário de vagas do Admin e Cliente
- [ ] 9.2 Atualizar cards e página de detalhes de vagas para renderizar a identidade mascarada para candidatos
- [ ] 9.3 Garantir que o recrutador dono da vaga visualize a identificação real no painel de gestão

## 10. Frontend Web: Agenda de Entrevistas

- [ ] 10.1 Criar página/modal de agendamento de entrevistas vinculando candidatos e vagas para empresas Premium
- [ ] 10.2 Desenvolver a visualização da agenda com abas de status (Próximas, Pendentes, Concluídas e Canceladas)
- [ ] 10.3 Criar interface de resposta para o candidato (Confirmar, Recusar, Solicitar Remarcação)

## 11. Frontend Web: Painel Kanban de Triagem

- [ ] 11.1 Desenvolver o componente de quadro Kanban com colunas customizáveis e ordenação visual
- [ ] 11.2 Implementar drag-and-drop de cards de candidatos com atualização otimista e sincronização GraphQL
- [ ] 11.3 Criar modal de detalhes do card com histórico de movimentações e notas do recrutador

## 12. Aplicativo Android: Modelos, Repositórios e ViewModels

- [ ] 12.1 Criar data classes Kotlin para `Interview`, `KanbanBoard`, `KanbanStage`, `KanbanCard`, `ResumeMarkdown` e filtros de busca
- [ ] 12.2 Estender `CandidateRepository` e `JobRepository` com as novas operações GraphQL
- [ ] 12.3 Implementar `InterviewViewModel`, `KanbanViewModel` e estender `CandidateViewModel`
- [ ] 12.4 Criar testes unitários em Kotlin para os novos modelos e repositórios

## 13. Aplicativo Android: Visualização de Markdown e Status de Carreira

- [ ] 13.1 Implementar tela e bottom sheet de edição de status de carreira e visualização do currículo em Markdown no Android
- [ ] 13.2 Exibir badges de "Procurando Emprego" e "Em Transição de Carreira" nos perfis de candidatos
- [ ] 13.3 Conectar filtros de candidatos no app Android com as novas opções de busca

## 14. Aplicativo Android: Vagas Confidenciais e Agenda de Entrevistas

- [ ] 14.1 Implementar suporte a vagas confidenciais no Android garantindo mascaramento seguro
- [ ] 14.2 Criar tela de agenda de entrevistas no app Android com ações de confirmação e recusa para candidatos
- [ ] 14.3 Adicionar notificações e alertas para entrevistas agendadas

## 15. Aplicativo Android: Painel Kanban Adaptado

- [ ] 15.1 Implementar visualização do pipeline da vaga com abas deslizáveis por etapa no Android
- [ ] 15.2 Adicionar ações rápidas de transição de etapa para recrutadores em dispositivos móveis
- [ ] 15.3 Criar testes unitários para a lógica de transição e filtros do Kanban no Android

## 16. Testes Integrados e Suíte de Regressão

- [ ] 16.1 Executar suíte completa de testes no Backend cobrindo todas as novas mutations, queries e regras Premium
- [ ] 16.2 Validar build e testes do Frontend Web Cliente (`npm run build`) e Admin (`npm run build`)
- [ ] 16.3 Executar testes unitários do Android e verificar compilação geral

## 17. Documentação e Fechamento

- [ ] 17.1 Atualizar `ARCHITECTURE.md`, `SPECIFICATION.md` e `CHANGELOG.md` com as novas capabilities
- [ ] 17.2 Realizar auditoria cruzada de segurança e integridade de dados entre Backend, Web e Android
