## Purpose

Garante a privacidade dos candidatos em estrita conformidade com a LGPD, implementando controle em 3 chaves de visibilidade, remoção de CPF obrigatório no cadastro e função de autorização server-side reveal().

## ADDED Requirements

### Requirement: Cadastro de Candidato sem Coleta Obrigatória de CPF
O sistema SHALL permitir o cadastro e candidatura de pessoas físicas utilizando exclusivamente o e-mail verificado como chave de unicidade de cadastro, restringindo a coleta de CPF apenas para a fase posterior de contratação efetiva direta com a empresa.

#### Scenario: Cadastro de novo candidato
- **WHEN** o candidato cria seu perfil ou se cadastra na plataforma
- **THEN** o sistema autentica via e-mail verificado/provedor de autenticação sem exigir o fornecimento de número de CPF.

### Requirement: Controle de Visibilidade em Três Chaves pelo Candidato
O sistema SHALL disponibilizar ao candidato o gerenciamento independente de 3 chaves de visibilidade (`visibility_settings`): (1) aparecer na busca de recrutadores (`searchable_by_recruiters`), (2) indicar status aberto a oportunidades (`open_to_work_visible`, nunca visível para empregador atual se identificado), e (3) constar como visualizado (`show_as_viewed`) ao visitar outros perfis.

#### Scenario: Atualização das preferências de visibilidade
- **WHEN** o candidato altera qualquer uma das 3 chaves de visibilidade em seu painel
- **THEN** o sistema persiste as configurações imediatamente e aplica as novas regras em todas as consultas em tempo real.

### Requirement: Verificação Server-Side de Exposição via Função reveal()
A API GraphQL SHALL interceptar toda tentativa de exposição de dados pessoais ou currículo completo através da função de autorização server-side `reveal(candidate, viewer_organization, data_scope)`, bloqueando imediatamente acessos não consentidos mesmo se a empresa possuir plano pago.

#### Scenario: Tentativa de visualização de perfil com visibilidade desativada
- **WHEN** um recrutador tenta visualizar o perfil ou dados de um candidato com `searchable_by_recruiters = false`
- **THEN** a função `reveal()` retorna negação de acesso (`Deny`) e os dados pessoais do candidato permanecem protegidos.

### Requirement: Registro e Retenção Auditável de Visualizações de Perfil
O sistema SHALL registrar as visualizações de perfil na entidade `profile_views` respeitando o consentimento mútuo e executar rotina periódica de descarte/purga automática de dados de visualização (retenção máxima de 12 meses para usuários Premium e 7 dias para plano gratuito).

#### Scenario: Purga automática de visualizações antigas
- **WHEN** a rotina programada de purga de logs de visualização é executada
- **THEN** todos os registros de `profile_views` que ultrapassam a janela de retenção configurada são excluídos permanentemente.
