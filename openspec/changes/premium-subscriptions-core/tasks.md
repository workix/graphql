## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/premium.service.ts` para queries e mutations de planos e assinaturas
- [ ] 1.2 Criar `frontend/client/src/stores/premium.ts` para gerenciamento de planos, assinatura ativa e créditos de InMail

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/PremiumPlansView.vue` (`/premium`) com tabela comparativa de planos e modal de contratação
- [ ] 2.2 Registrar rota `/premium` em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `PremiumApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `PremiumPlansActivity.kt` no pacote `ui/premium` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para o módulo `premium`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate premium-subscriptions-core`
