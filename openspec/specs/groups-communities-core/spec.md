# groups-communities-core Specification

## Purpose
Especifica o comportamento, regras de exibição e interações comunitárias para grupos de discussão e comunidades profissionais no ecossistema Workix.

## Requirements

### Requirement: Consulta e Detalhes de Grupos Profissionais
O sistema SHALL permitir que o usuário consulte os detalhes de um grupo profissional via query `group(id)` exibindo nome, descrição, privacidade (público ou privado) e dono.

#### Scenario: Visualização de detalhes da comunidade
- **WHEN** o usuário acessa `/groups/:id`
- **THEN** o sistema exibe os detalhes do grupo e o feed de postagens exclusivo.

### Requirement: Criação de Novo Grupo de Discussão
O sistema SHALL permitir que usuários autenticados criem novas comunidades profissionais via mutation `createGroup(ownerId, name, description, privacy)`.

#### Scenario: Criação com sucesso de um grupo
- **WHEN** o usuário preenche o formulário com nome, descrição e tipo de privacidade
- **THEN** o grupo é criado com o usuário como proprietário e administrador.

### Requirement: Adesão a Grupos (Membership)
O sistema SHALL permitir que usuários ingressem ou solicitem participação em grupos via mutation `joinGroup(groupId, userId)`.

#### Scenario: Solicitação de entrada
- **WHEN** o usuário clica em "Participar do Grupo"
- **THEN** uma adesão `GroupMembership` é gerada com status ativo ou pendente de aprovação.

### Requirement: Feed Exclusivo e Postagens no Grupo
O sistema SHALL permitir a consulta de postagens de um grupo via query `groupPosts(groupId, limit, offset)` e a publicação de novos posts via mutation `createGroupPost(groupId, authorId, content)`.

#### Scenario: Publicação em grupo
- **WHEN** um membro autenticado publica uma mensagem no grupo
- **THEN** a postagem passa a ser exibida no feed interno da comunidade.

### Requirement: Interface Mobile de Grupos no Android
O sistema SHALL disponibilizar suporte a grupos no app Android através do `GroupsFragment.kt` e `GroupDetailActivity.kt`.

#### Scenario: Visualização no Android
- **WHEN** o usuário navega na aba de Grupos no app Android
- **THEN** ele pode ver os grupos disponíveis e interagir no feed.
