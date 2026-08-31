## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/analytics.service.ts` para queries e mutations de SSI e analytics
- [ ] 1.2 Criar `frontend/client/src/stores/analytics.ts` para gerenciamento de scores e métricas

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/SocialSellingView.vue` (`/analytics/ssi`) com visualização dos 4 pilares do SSI
- [ ] 2.2 Criar `frontend/client/src/views/ProfileAnalyticsView.vue` (`/analytics/views`) com visualizadores de perfil
- [ ] 2.3 Registrar rotas `/analytics/ssi` e `/analytics/views` em `frontend/client/src/router/index.ts` e adicionar atalhos em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `AnalyticsApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `ProfileAnalyticsActivity.kt` no pacote `ui/analytics` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para os módulos `social_selling` e `analytics`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate analytics-ssi-dashboard-core`
