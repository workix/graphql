# Design Document: Assinaturas e Planos Premium (`premium-subscriptions-core`)

## Architectural Strategy

A camada de monetização do Workix conecta candidatos e empresas através de planos com benefícios exclusivos:
1. **Backend GraphQL (`src/modules/premium`)**:
   - `subscriptionPlans`: Retorna a lista de planos cadastrados (`Free`, `Premium Career`, `Recruiter Pro`).
   - `mySubscription(userId)`: Retorna os dados da assinatura ativa do usuário, validade e saldo de créditos InMail.
   - `subscribeToPlan(userId, planId)`: Registra a assinatura e define os créditos de mensagens diretas.
   - `createSubscriptionPlan(...)`: Criação de novos planos pelo administrador.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/premium.service.ts`: Abstração de chamadas GraphQL.
   - `src/stores/premium.ts`: Gerenciamento de planos, assinatura ativa e créditos.
   - `src/views/PremiumPlansView.vue` (`/premium`): Tabela comparativa visualmente rica com cartões de planos, listas de recursos (InMails, quem viu seu perfil, selo dourado) e botão de contratação.
   - Atualização da barra superior (`TheHeader.vue`) com link para o Workix Premium.

3. **Android App (`android/`)**:
   - `PremiumApiService.kt`: Camada de rede nativa em Kotlin com Coroutines.
   - `PremiumPlansActivity.kt`: Interface nativa de planos com cards de planos, seleção de período e botão de contratação.
