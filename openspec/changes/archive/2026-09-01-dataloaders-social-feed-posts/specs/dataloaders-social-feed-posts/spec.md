## Purpose

Garante a resolução em lote de relacionamentos aninhados nos módulos de feed social, comentários, reações e conexões, eliminando consultas N+1 via DataLoader request-scoped.

## ADDED Requirements

### Requirement: Resolução em Lote de Autores e Reações de Posts
O sistema SHALL resolver os campos relacionais de `Post`, `PostReaction` e `PostComment` em lote utilizando instâncias de DataLoader com escopo por requisição.

#### Scenario: Consulta de lista de posts com autor aninhado
- **WHEN** a consulta `socialFeed` retornar múltiplos posts e solicitar o campo `author`
- **THEN** o sistema SHALL agrupar os `authorId` e executar uma única consulta em lote no banco de dados.

#### Scenario: Consulta de reações e comentários de posts
- **WHEN** a consulta `postReactions` ou `postComments` solicitar dados do usuário correspondente
- **THEN** o sistema SHALL delegar a busca ao `usersLoader` sem disparar consultas individuais repetidas.

### Requirement: Resolução em Lote de Participantes de Conexão
O sistema SHALL prover resolução otimizada em lote para os usuários associados a conexões e solicitações de conexão.

#### Scenario: Listagem de conexões com dados dos usuários
- **WHEN** a query `myConnections` solicitar os objetos `user1` e `user2`
- **THEN** o sistema SHALL carregar os perfis de usuários utilizando o DataLoader request-scoped.
