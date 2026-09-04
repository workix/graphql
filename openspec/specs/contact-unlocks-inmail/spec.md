# contact-unlocks-inmail Specification

## Purpose
Permite o desbloqueio de contato direto e mensageria entre recrutadores e candidatos com desconto de créditos e exigência de notificação transparente ao titular do perfil.

## Requirements

### Requirement: Desbloqueio de Contato de Candidato com Débito de Créditos
O sistema SHALL permitir que recrutadores com plano ativo utilizem créditos de contato direto para desbloquear dados de contato (telefone/e-mail/CV completo) de candidatos elegíveis (`searchable_by_recruiters = true`), gravando a transação na tabela `contact_unlocks`.

#### Scenario: Desbloqueio de contato com crédito disponível
- **WHEN** um recrutador com créditos suficientes confirma a ação de desbloqueio de contato de um candidato
- **THEN** o sistema debita 1 crédito de contato da organização, registra o acesso em `contact_unlocks` e disponibiliza os canais de contato.

### Requirement: Notificação Obrigatória ao Candidato Desbloqueado
O sistema SHALL disparar uma notificação imediata (via e-mail e push/inbox) ao candidato sempre que seu contato for desbloqueado por uma empresa (`notified_candidate_at` obrigatório), impedindo qualquer acesso silencioso aos seus dados.

#### Scenario: Envio de alerta de desbloqueio ao titular
- **WHEN** o registro de `contact_unlocks` é concluído com sucesso
- **THEN** o sistema envia mensagem ao candidato informando o nome da empresa e o recrutador que acessou suas informações profissionais.
