# Especificação: Resolução em Lote de Feed Social, Posts e Conexões

## Purpose

Define os requisitos e cenários de resolução de entidades em lote (DataLoaders) nos módulos de feed social, publicações, reações, comentários e rede de conexões.

## Requirements

### Requirement: Resolução em Lote de Autores de Posts e Comentários
O sistema SHALL resolver em lote os dados do autor de posts e comentários através de instâncias request-scoped de DataLoaders.

#### Scenario: Listagem de feed social com múltiplos posts
- **WHEN** a consulta `socialFeed` for executada requisitando o campo `author`
- **THEN** o sistema SHALL agrupar os `authorId` e executar uma única busca na tabela `users` via `usersLoader`.

#### Scenario: Listagem de comentários de um post
- **WHEN** a consulta `postComments` for executada requisitando o campo `author`
- **THEN** o sistema SHALL carregar todos os autores dos comentários em lote único.

### Requirement: Resolução em Lote de Usuários em Reações
O sistema SHALL carregar o usuário de reações de posts através de DataLoaders.

#### Scenario: Consulta de reações de post
- **WHEN** a consulta `postReactions` solicitar o campo `user`
- **THEN** o sistema SHALL carregar os perfis de usuários em lote sem consultas repetidas.

### Requirement: Resolução em Lote de Participantes de Conexões
O sistema SHALL resolver os usuários de conexões e solicitações de conexão em lote.

#### Scenario: Listagem de conexões do usuário
- **WHEN** a consulta `myConnections` solicitar os campos `user1` e `user2`
- **THEN** o sistema SHALL resolver os nós de usuário utilizando `usersLoader`.

#### Scenario: Listagem de solicitações pendentes
- **WHEN** a consulta `pendingConnectionRequests` solicitar `requester` e `recipient`
- **THEN** o sistema SHALL resolver os respectivos usuários em lote.
