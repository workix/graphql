## Purpose

Especifica o comportamento, regras de exibição e fluxo de endosso comunitário de competências e recomendações profissionais no ecossistema Workix.

## ADDED Requirements

### Requirement: Endosso de Competências Técnicas
O sistema SHALL permitir que conexões autenticadas endossem as competências profissionais de outros usuários via mutation `endorseSkill(skillId, endorserId)` e desfaçam via `unendorseSkill`.

#### Scenario: Usuário endossa competência de um colega
- **WHEN** o usuário clica no botão "+ Endossar" em uma skill do perfil público
- **THEN** a contagem de endossos da competência é incrementada e o botão reflete o status de endossado.

### Requirement: Criação e Envio de Recomendações Profissionais
O sistema SHALL permitir que um usuário escreva e envie uma carta de recomendação para outro profissional via mutation `createRecommendation(recommenderId, recipientId, content)`.

#### Scenario: Envio de recomendação
- **WHEN** o usuário submete um depoimento com o texto da recomendação
- **THEN** a recomendação é registrada no sistema com status pendente de aprovação pelo destinatário.

### Requirement: Moderação e Aceite de Recomendações
O sistema SHALL permitir que o destinatário aprove ou recuse recomendações recebidas via mutation `respondToRecommendation(recommendationId, recipientId, accept)`.

#### Scenario: Aceite de recomendação recebida
- **WHEN** o destinatário aceita a recomendação
- **THEN** o status é atualizado para `ACCEPTED` e ela passa a ser exibida no seu perfil público.

### Requirement: Integração Mobile Android
O sistema SHALL exibir competências endossáveis e recomendações no aplicativo Android através da `ProfileActivity.kt`.

#### Scenario: Visualização no Android
- **WHEN** o perfil é aberto no app Android
- **THEN** a lista de competências e recomendações aprovadas é renderizada com ações interativas.
