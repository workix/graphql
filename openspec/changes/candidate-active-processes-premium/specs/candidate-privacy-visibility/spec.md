## MODIFIED Requirements

### Requirement: Controle de Visibilidade em Três Chaves pelo Candidato
O sistema SHALL disponibilizar ao candidato o gerenciamento independente de suas preferências de visibilidade (`visibility_settings`): (1) aparecer na busca de recrutadores (`searchable_by_recruiters`), (2) indicar status aberto a oportunidades (`open_to_work_visible`, nunca visível para empregador atual se identificado), (3) constar como visualizado (`show_as_viewed`) ao visitar outros perfis, (4) controlar a exibição pública de status de carreira (`looking_for_job` e `in_career_transition`) e currículo normalizado em Markdown, e (5) controlar o compartilhamento de sua participação em processos seletivos ativos com recrutadores autorizados (`share_active_processes_with_recruiters`).

#### Scenario: Atualização das preferências de visibilidade
- **WHEN** o candidato altera qualquer uma das preferências de visibilidade ou desativa a exibição pública do status de transição de carreira ou de processos ativos
- **THEN** o sistema persiste as configurações imediatamente e aplica as novas regras em todas as consultas e buscas em tempo real.

### Requirement: Verificação Server-Side de Exposição via Função reveal()
A API GraphQL SHALL interceptar toda tentativa de exposição de dados pessoais, currículo completo ou participação em processos seletivos ativos através da função de autorização server-side `reveal(candidate, viewer_organization, data_scope)`, bloqueando imediatamente acessos não consentidos mesmo se a empresa possuir plano pago.

#### Scenario: Tentativa de visualização de perfil com visibilidade desativada
- **WHEN** um recrutador tenta visualizar o perfil ou dados de um candidato com `searchable_by_recruiters = false`
- **THEN** a função `reveal()` retorna negação de acesso (`Deny`) e os dados pessoais do candidato permanecem protegidos.

#### Scenario: Tentativa de visualização de processos ativos com compartilhamento revogado
- **WHEN** um recrutador com plano Premium tenta visualizar os processos ativos de um candidato com `share_active_processes_with_recruiters = false`
- **THEN** a função `reveal()` bloqueia a listagem de processos seletivos concorrentes e preserva a privacidade do candidato.
