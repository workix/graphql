## Purpose

Fornece um painel Kanban visual interativo para recrutadores de empresas assinantes do plano Premium gerenciarem pipelines de triagem de candidatos por vaga, com colunas customizáveis, drag-and-drop e suporte adaptado para Android.

## ADDED Requirements

### Requirement: Controle de Acesso Premium para o Kanban de Recrutamento
O sistema SHALL restringir o acesso e a manipulação do painel Kanban de recrutamento exclusivamente a empresas com plano Premium ativo (`can('USE_RECRUITMENT_KANBAN')`).

#### Scenario: Acesso Autorizado ao Kanban
- **WHEN** um recrutador de empresa Premium acessa a rota do pipeline da vaga `/jobs/:id/kanban`
- **THEN** o sistema carrega o quadro Kanban com as colunas e cards de candidatos do processo seletivo.

### Requirement: Pipeline Customizável por Vaga e Colunas Configuráveis
O sistema SHALL permitir que cada vaga possua um pipeline próprio com colunas ordenadas e customizáveis (ex.: Triagem, Pré-selecionados, Entrevista, Aprovados, Contratados, Reprovados), permitindo adicionar, editar, renomear e reordenar etapas.

#### Scenario: Criação de Nova Etapa no Pipeline
- **WHEN** o recrutador adiciona uma nova coluna "Teste Técnico" no Kanban da vaga
- **THEN** a etapa é criada e disponibilizada para receber cards de candidatos.

### Requirement: Cards de Candidatos e Movimentação Drag & Drop com Histórico
O painel Kanban SHALL exibir os candidatos inscritos na vaga em formato de cards visuais com foto, nome, cargo, localização, tags e tempo na etapa, permitindo a movimentação entre colunas com registro auditável de histórico (data, responsável e mudança de status).

#### Scenario: Movimentação de Candidato no Kanban
- **WHEN** o recrutador arrasta o card de um candidato da coluna "Triagem" para "Entrevista"
- **THEN** a mutation `moveKanbanCard` persiste a nova posição, registra o histórico de movimentação e dispara as ações automatizadas configuradas para a etapa.

### Requirement: Experiência Adaptada do Kanban no Aplicativo Android
O aplicativo Android SHALL disponibilizar uma interface touch adaptada para telas móveis que permita visualizar os candidatos por etapa, filtrar por status e avançar ou retroceder candidatos no processo seletivo.

#### Scenario: Visualização do Pipeline no Android
- **WHEN** o recrutador visualiza o processo seletivo no app Android
- **THEN** a tela exibe as colunas em abas deslizáveis com cards resumidos e botões para transição de etapa.
