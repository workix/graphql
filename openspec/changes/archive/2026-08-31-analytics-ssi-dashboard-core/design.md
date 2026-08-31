# Design Document: Analytics e Social Selling Index (`analytics-ssi-dashboard-core`)

## Context & Architectural Strategy

A camada analítica fornece inteligência de desempenho para o profissional e fecha a Fase 3:
1. **Backend GraphQL (`src/modules/social_selling` & `src/modules/analytics`)**:
   - `mySocialSellingIndex(userId)` / `recalculateSocialSellingIndex(userId)`: Pontuações dos pilares do SSI (total, marca, pessoas, engajamento e relacionamentos).
   - `whoViewedMyProfile(userId, limit, offset)`: Lista de visualizadores do perfil.
   - `postAnalytics(postId)`: Estatísticas de impressões e compartilhamentos.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/analytics.service.ts`: Abstração do cliente GraphQL.
   - `src/stores/analytics.ts`: Store Pinia com cálculo de SSI, comparativo com a indústria e lista de visitantes.
   - `src/views/SocialSellingView.vue` (`/analytics/ssi`): Dashboard visual com gauge/barras de progresso do score SSI (0 a 100).
   - `src/views/ProfileAnalyticsView.vue` (`/analytics/views`): Painel de visualizações de perfil e visitantes recentes.

3. **Android App (`android/`)**:
   - `AnalyticsApiService.kt`: Camada de rede nativa em Kotlin com Coroutines.
   - `ProfileAnalyticsActivity.kt`: Tela nativa de métricas com barras de progresso para os 4 pilares do SSI e lista de visitantes recentes.
