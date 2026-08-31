# analytics-ssi-dashboard-core Specification

## Purpose
Especifica o comportamento, regras de exibição e cálculo do índice de Social Selling (SSI) e métricas analíticas de perfis e publicações no ecossistema Workix.

## Requirements

### Requirement: Consulta e Exibição do Social Selling Index (SSI)
O sistema SHALL consultar o índice de Social Selling do usuário logado via query `mySocialSellingIndex(userId)` exibindo a pontuação total (0-100) e os 4 pilares: Marca Pessoal, Rede de Pessoas, Engajamento e Relacionamentos.

#### Scenario: Visualização do painel de SSI
- **WHEN** o usuário acessa `/analytics/ssi` no Frontend ou a tela de métricas no Android
- **THEN** o sistema renderiza as barras de progresso e detalhamento de cada um dos quatro pilares com dicas de aprimoramento.

### Requirement: Recálculo do Índice de Social Selling
O sistema SHALL permitir que o usuário solicite o recálculo em tempo real do seu SSI via mutation `recalculateSocialSellingIndex(userId)`.

#### Scenario: Atualização sob demanda do SSI
- **WHEN** o usuário clica em "Recalcular SSI"
- **THEN** o sistema atualiza as métricas e exibe a pontuação mais recente.

### Requirement: Métricas de Visualização de Perfil (Who Viewed My Profile)
O sistema SHALL exibir a lista de profissionais que visualizaram o perfil do usuário logado via query `whoViewedMyProfile(userId, limit, offset)`.

#### Scenario: Acompanhamento de visitantes
- **WHEN** o usuário acessa `/analytics/views`
- **THEN** o sistema exibe os visitantes recentes com timestamp e link para perfil.

### Requirement: Painel Mobile de Analytics no Android
O sistema SHALL disponibilizar tela nativa no Android (`ProfileAnalyticsActivity.kt`) para visualização de métricas e índice SSI.

#### Scenario: Visualização de analytics no Android
- **WHEN** o usuário toca em "Analytics" no app Android
- **THEN** a tela `ProfileAnalyticsActivity` exibe o score SSI e o histórico de visitantes.
