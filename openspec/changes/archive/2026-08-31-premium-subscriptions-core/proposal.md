# Proposal: Implementação de Assinaturas e Planos Premium (`premium-subscriptions-core`)

## Summary
Implementar o módulo de monetização **Workix Premium** no **Frontend Cliente**, **Frontend Admin** e no **Android**, consumindo as queries e mutations do módulo GraphQL `premium` (`subscriptionPlans`, `mySubscription`, `createSubscriptionPlan`, `subscribeToPlan`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação da rede social profissional [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md), esta entrega inicia a **Fase 5 (Monetização, Assinaturas Premium & Moderação Final)**:
- Os profissionais e recrutadores podem assinar planos para desbloquear envio de mensagens InMail, insights competitivos de vagas, navegação anônima e selo dourado Premium no perfil.
- O sistema deve disponibilizar uma tabela comparativa de planos (`subscriptionPlans`), fluxo de assinatura (`subscribeToPlan`), exibição do status da assinatura ativa com contagem de créditos InMail (`mySubscription`) e gestão de planos no painel administrativo.

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/premium.service.ts`: Abstração de queries e mutations de planos e assinaturas.
  - `src/stores/premium.ts`: Store Pinia com planos disponíveis, assinatura ativa e créditos de InMail.
  - `src/views/PremiumPlansView.vue` (`/premium`): Tabela comparativa de planos (Free vs Premium Career vs Premium Recruiter) e modal de confirmação de contratação.
  - Rotas registradas no `router/index.ts` e atalho Premium no `TheHeader.vue`.
- **Android App (`android/`)**:
  - `PremiumApiService.kt`: Camada de rede nativa em Kotlin para planos e assinaturas.
  - `PremiumPlansActivity.kt`: Interface nativa para comparação de planos e contratação de assinatura.
