## 1. Serviços e Camada de Dados GraphQL

- [x] 1.1 Criar `frontend/client/src/services/analytics.service.ts` para queries e mutations de SSI e analytics
- [x] 1.2 Criar `frontend/client/src/stores/analytics.ts` para gerenciamento de scores e métricas

## 2. Frontend Cliente: Componentes e Views

- [x] 2.1 Criar `frontend/client/src/views/SocialSellingView.vue` (`/analytics/ssi`) com visualização dos 4 pilares do SSI
- [x] 2.2 Criar `frontend/client/src/views/ProfileAnalyticsView.vue` (`/analytics/views`) com visualizadores de perfil
- [x] 2.3 Registrar rotas `/analytics/ssi` e `/analytics/views` em `frontend/client/src/router/index.ts` e adicionar atalhos em `TheHeader.vue`

## 3. Android: Camada Mobile

- [x] 3.1 Criar `AnalyticsApiService.kt` no módulo de rede do Android
- [x] 3.2 Criar `ProfileAnalyticsActivity.kt` no pacote `ui/analytics` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [x] 4.1 Adicionar testes unitários para os módulos `social_selling` e `analytics`
- [x] 4.2 Validar conformidade da proposta via `openspec validate analytics-ssi-dashboard-core`
