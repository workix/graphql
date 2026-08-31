## Purpose

Especifica o comportamento, regras de exibição e edição de perfis profissionais enriquecidos, destaques/portfólio e selo Open To Work no ecossistema Workix.

## ADDED Requirements

### Requirement: Consulta de Perfil do Usuário
O sistema SHALL permitir consultar os dados do perfil profissional de qualquer usuário via query `getProfileByUserId(userId)`.

#### Scenario: Visualização do perfil público
- **WHEN** o usuário acessa `/in/:id` no Frontend ou a tela de perfil no Android
- **THEN** o sistema renderiza o banner de capa, avatar, nome, headline, localização, setor, resumo sobre e selo Open to Work (quando ativado).

### Requirement: Atualização do Próprio Perfil
O sistema SHALL permitir que o usuário autenticado edite seu perfil profissional via mutation `updateMyProfile(userId, input)`.

#### Scenario: Edição de perfil com sucesso
- **WHEN** o usuário altera sua headline, sobre, localização ou status de Open to Work e clica em "Salvar Alterações"
- **THEN** o sistema envia a mutation `updateMyProfile` e atualiza a interface imediatamente.

### Requirement: Gestão de Destaques e Portfólio
O sistema SHALL permitir que o usuário liste itens em destaque via query `userFeaturedItems(userId)`, adicione novos itens via mutation `addFeaturedItem` e remova itens via `removeFeaturedItem`.

#### Scenario: Adicionar novo item aos destaques
- **WHEN** o usuário informa título, link/mídia e salva um novo destaque
- **THEN** o item é adicionado ao carrossel de destaques do perfil.

### Requirement: Telas Mobile de Perfil no Android
O sistema SHALL disponibilizar telas nativas em Android para visualização de perfil (`ProfileActivity.kt`) e edição rápida (`EditProfileActivity.kt`).

#### Scenario: Visualização de perfil no app Android
- **WHEN** o usuário acessa seu perfil no Android
- **THEN** as informações do perfil são renderizadas nativamente com opções de edição.
