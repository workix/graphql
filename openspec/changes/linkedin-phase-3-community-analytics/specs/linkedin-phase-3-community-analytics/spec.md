## ADDED Requirements

### Requirement: Grupos Profissionais e Comunidades
O sistema SHALL permitir a criação de grupos profissionais públicos ou privados, gestão de membros por moderadores e publicação de posts exclusivos dentro dos grupos.

#### Scenario: Criar e gerenciar grupo
- **WHEN** o usuário executar a mutation `createGroup(input: GroupInput!)`
- **THEN** o sistema deve criar o registro na tabela `groups` e definir o criador como admin em `group_memberships`.

### Requirement: Gestão de Eventos Corp / Webinars
O sistema SHALL permitir a criação de eventos online ou presenciais, envio de convites e marcação de presença pelos participantes.

#### Scenario: Confirmar presença em evento
- **WHEN** o usuário executar a mutation `attendEvent(eventId: ID!)`
- **THEN** o sistema deve registrar a participação em `event_attendees`.

### Requirement: Analytics de Perfil e Desempenho de Publicações
O sistema SHALL registrar as visualizações de perfil de forma transparente ("Quem viu seu perfil") e consolidar estatísticas de engajamento de postagens.

#### Scenario: Rastrear visualização de perfil
- **WHEN** um usuário acessar o perfil de outro usuário
- **THEN** o sistema deve gravar uma entrada na tabela `profile_views`.
