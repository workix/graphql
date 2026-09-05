# interview-scheduler-premium Specification

## Purpose

Disponibiliza um sistema integrado de agenda e gestão de entrevistas para recrutadores de empresas assinantes do plano Premium, com convites para candidatos, fluxo de confirmação e suporte no aplicativo Android.

## Requirements

### Requirement: Controle de Acesso Premium para Agenda de Entrevistas
O sistema SHALL validar no backend que somente empresas e recrutadores com plano Premium ativo (`can('SCHEDULE_INTERVIEWS')`) possam criar, agendar, remarcar e gerenciar entrevistas com candidatos.

#### Scenario: Tentativa de Agendamento por Empresa Gratuita
- **WHEN** uma empresa no plano Gratuito tenta criar uma entrevista através da mutation `createInterview`
- **THEN** o sistema rejeita a operação retornando código de erro `FORBIDDEN` e mensagem indicando a necessidade do plano Premium.

### Requirement: Criação e Gestão de Entrevistas pelo Recrutador
O sistema SHALL permitir que o recrutador crie entrevistas vinculando candidato, vaga, data, horário, duração estimada, formato (Online / Presencial), link de videoconferência ou endereço físico, observações internas e status inicial (`PENDING`).

#### Scenario: Criação de Entrevista com Sucesso
- **WHEN** um recrutador Premium submete os dados de uma nova entrevista via `createInterview`
- **THEN** a entrevista é persistida com status `PENDING` e um convite é gerado para o candidato.

### Requirement: Convite, Confirmação, Recusa e Remarcação pelo Candidato
O candidato convidado SHALL poder visualizar os detalhes da entrevista na sua área logada ou app Android e executar ações de confirmação (`CONFIRMED`), recusa (`DECLINED`) ou solicitação de reagendamento (`RESCHEDULE_REQUESTED`).

#### Scenario: Confirmação de Entrevista pelo Candidato
- **WHEN** o candidato visualiza o convite de entrevista e clica em "Confirmar Presença"
- **THEN** a mutation `respondInterview` atualiza o status para `CONFIRMED` e notifica o recrutador responsável.

### Requirement: Visualização da Agenda no Frontend Web e Aplicativo Android
O Frontend Web e o aplicativo Android SHALL fornecer visualizações de calendário e lista estruturada de entrevistas segmentadas por status (Próximas, Concluídas, Pendentes de Confirmação e Canceladas).

#### Scenario: Consulta de Entrevistas no Aplicativo Android
- **WHEN** o usuário abre a aba de entrevistas no aplicativo Android
- **THEN** a lista exibe as entrevistas agendadas com badges de status, horários formatados e opções rápidas de ação.
