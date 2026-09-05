## MODIFIED Requirements

### Requirement: Controle de Visibilidade em Três Chaves pelo Candidato
O sistema SHALL disponibilizar ao candidato o gerenciamento independente de suas preferências de visibilidade (`visibility_settings`): (1) aparecer na busca de recrutadores (`searchable_by_recruiters`), (2) indicar status aberto a oportunidades (`open_to_work_visible`, nunca visível para empregador atual se identificado), (3) constar como visualizado (`show_as_viewed`) ao visitar outros perfis, e (4) controlar a exibição pública de status de carreira (`looking_for_job` e `in_career_transition`) e currículo normalizado em Markdown.

#### Scenario: Atualização das preferências de visibilidade
- **WHEN** o candidato altera qualquer uma das preferências de visibilidade ou desativa a exibição pública do status de transição de carreira
- **THEN** o sistema persiste as configurações imediatamente e aplica as novas regras em todas as consultas e buscas em tempo real.
