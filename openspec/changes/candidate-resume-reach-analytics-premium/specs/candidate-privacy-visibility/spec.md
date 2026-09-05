## MODIFIED Requirements

### Requirement: Registro e Retenção Auditável de Visualizações de Perfil e Impressões de Busca
O sistema SHALL registrar as visualizações de perfil e aparições em buscas na plataforma respeitando o consentimento mútuo e configurações de anonimização (`show_as_viewed` e `searchable_by_recruiters`), e executar rotina periódica de descarte/purga automática de dados analíticos (retenção máxima de 12 meses para usuários Premium e 7 dias para plano gratuito).

#### Scenario: Purga automática de visualizações e aparições antigas
- **WHEN** a rotina programada de purga de logs analíticos é executada
- **THEN** todos os registros de `profile_views` e `candidate_search_appearances` que ultrapassam a janela de retenção configurada são excluídos permanentemente.

#### Scenario: Anonimização de visualizações com base em preferência do visualizador
- **WHEN** um usuário com `show_as_viewed = false` visita um perfil
- **THEN** a visualização é computada para fins estatísticos, mas os atributos identificáveis do visualizador permanecem mascarados em qualquer consulta de alcance.
