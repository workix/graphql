# connections-network-core Specification

## Purpose
Especifica o comportamento, regras de negócio e fluxos de interface para gestão de conexões profissionais, convites pendentes, relacionamentos de seguidores e cálculo de distância social no ecossistema Workix.

## Requirements

### Requirement: Listagem de Conexões do Usuário
O sistema SHALL permitir que o usuário autenticado visualize todas as suas conexões ativas na plataforma via query `myConnections(userId)`.

#### Scenario: Visualização de contatos conectados
- **WHEN** o usuário acessa `/mynetwork` no Frontend ou a aba Conexões no Android
- **THEN** o sistema exibe os cartões dos profissionais conectados com foto de perfil, cargo/especialidade e opções rápidas de interação.

### Requirement: Gestão de Solicitações Pendentes de Conexão
O sistema SHALL exibir convites de conexão recebidos que aguardam resposta via query `pendingConnectionRequests(userId)` e permitir que o destinatário aceite via mutation `acceptConnectionRequest` ou recuse via `rejectConnectionRequest`.

#### Scenario: Aceite de convite de conexão
- **WHEN** o usuário clica no botão "Aceitar" em um convite pendente
- **THEN** o sistema dispara a mutation `acceptConnectionRequest`, move o contato para a lista de conexões ativas e atualiza o estado da interface sem recarregar a página.

#### Scenario: Recusa de convite de conexão
- **WHEN** o usuário clica no botão "Recusar" ou "Ignorar" em um convite pendente
- **THEN** o sistema executa a mutation `rejectConnectionRequest` e remove a solicitação da lista.

### Requirement: Envio de Novo Convite de Conexão
O sistema SHALL permitir que um usuário envie uma solicitação de conexão para outro perfil profissional via mutation `sendConnectionRequest(requesterId, recipientId)`.

#### Scenario: Envio de solicitação com sucesso
- **WHEN** o usuário clica no botão "Conectar" no card de uma pessoa sugerida
- **THEN** o sistema envia a mutation `sendConnectionRequest` e altera o estado do botão para "Pendente / Convite Enviado".

### Requirement: Seguir e Deixar de Seguir Usuários
O sistema SHALL permitir que usuários sigam outros profissionais via mutation `followUser(followerId, followingId)` ou deixem de seguir via `unfollowUser(followerId, followingId)`.

#### Scenario: Seguir um profissional
- **WHEN** o usuário clica no botão "Seguir" no card de um profissional
- **THEN** o sistema executa a mutation `followUser` e atualiza o estado para "Seguindo".

### Requirement: Cálculo de Grau de Distância Social
O sistema SHALL calcular e exibir visualmente o grau de separação social (1º, 2º ou 3º+ grau) entre usuários via query `socialDistanceDegree(userId1, userId2)`.

#### Scenario: Exibição de badge de grau social
- **WHEN** o perfil ou card de outro usuário é renderizado
- **THEN** o sistema exibe uma badge indicando se o profissional é conexão de 1º, 2º ou 3º grau.
