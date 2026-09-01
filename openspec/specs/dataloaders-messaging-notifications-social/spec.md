# Especificação: Resolução em Lote de Mensagens, Notificações e Recomendações

## Purpose

Define os requisitos e cenários de resolução de entidades em lote (DataLoaders) nos módulos de mensagens diretas em tempo real, notificações de usuários e endossos/recomendações de perfil profissional.

## Requirements

### Requirement: Resolução em Lote de Participantes de Mensagens Diretas
O sistema SHALL resolver os remetentes e destinatários de mensagens diretas em lote via DataLoader.

#### Scenario: Listagem de histórico de conversa
- **WHEN** a consulta `directMessages` solicitar os campos `sender` e `recipient` de cada mensagem
- **THEN** o sistema SHALL agrupar os IDs e delegar a busca ao `usersLoader` sem queries duplicadas.

### Requirement: Resolução em Lote de Usuários de Notificações
O sistema SHALL resolver o usuário associado a cada notificação via DataLoader request-scoped.

#### Scenario: Listagem de notificações ativas
- **WHEN** a consulta `myNotifications` solicitar o perfil do usuário
- **THEN** o sistema SHALL resolver a entidade em lote.

### Requirement: Resolução em Lote de Endossos e Recomendações
O sistema SHALL resolver os usuários recomendadores e endossantes via DataLoader.

#### Scenario: Consulta de recomendações recebidas
- **WHEN** a consulta `userRecommendations` solicitar dados do recomendador (`recommender`)
- **THEN** o sistema SHALL carregar os perfis de usuários com resolução em lote.
