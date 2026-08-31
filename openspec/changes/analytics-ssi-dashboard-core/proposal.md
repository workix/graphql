# Proposal: Implementação de Painel de Analytics e Social Selling Index (`analytics-ssi-dashboard-core`)

## Summary
Implementar o painel analítico de métricas profissionais e o dashboard de **Social Selling Index (SSI)** no **Frontend Cliente** e no **Android**, consumindo as queries e mutations dos módulos GraphQL `social_selling` (`mySocialSellingIndex`, `recalculateSocialSellingIndex`) e `analytics` (`whoViewedMyProfile`, `postAnalytics`, `recordProfileView`, `recordPostView`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação da rede social profissional [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md), esta entrega encerra a **Fase 3 (Perfil Avançado, Endorsements & Analytics)**:
- Os usuários precisam mensurar sua eficácia e autoridade na rede através do SSI composto por 4 pilares:
  1. *Estabelecer sua marca profissional* (`postsScore`)
  2. *Localizar as pessoas certas* (`networkScore`)
  3. *Interagir oferecendo insights* (`engagementScore`)
  4. *Criar relacionamentos fortes* (`relationshipsScore`)
- Os profissionais devem acompanhar quem visualizou seu perfil (`whoViewedMyProfile`) e o alcance e compartilhamento de suas publicações (`postAnalytics`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/analytics.service.ts`: Abstração de queries e mutations de SSI e analytics de perfil/posts.
  - `src/stores/analytics.ts`: Store Pinia com cálculo reativo de SSI e histórico de visualizações de perfil.
  - `src/views/SocialSellingView.vue` (`/analytics/ssi`): Dashboard completo de Social Selling com gráficos e scores dos 4 pilares.
  - `src/views/ProfileAnalyticsView.vue` (`/analytics/views`): Painel de visualizações de perfil e métricas de alcance.
  - Rotas registradas no `router/index.ts` e atalho de Analytics no `TheHeader.vue`.
- **Android App (`android/`)**:
  - `AnalyticsApiService.kt`: Camada de rede nativa em Kotlin para SSI e analytics.
  - `ProfileAnalyticsActivity.kt`: Tela nativa com indicadores de SSI e visitantes do perfil, registrada no `AndroidManifest.xml`.
