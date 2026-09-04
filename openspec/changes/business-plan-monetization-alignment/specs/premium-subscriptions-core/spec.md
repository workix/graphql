## MODIFIED Requirements

### Requirement: Tabela de Planos de Assinatura
O sistema SHALL listar os planos B2B de assinatura disponíveis (Free, Starter, Pro, Business) e o plano B2C (Workix Premium) via query `subscriptionPlans` exibindo código, nome, preço mensal/anual, limites de vagas simultâneas, usuários, créditos de contato/InMail e créditos de destaque inclusos.

#### Scenario: Visualização de planos premium
- **WHEN** o usuário ou empresa acessa a página de planos ou `/pricing`
- **THEN** a tabela comparativa de planos e benefícios orientada a `plan_features` é exibida de forma clara com a lista do que nunca é cobrado ou vendido.

### Requirement: Consulta de Assinatura Ativa
O sistema SHALL permitir que a organização ou usuário consulte o status de sua assinatura ativa (`trialing`, `active`, `past_due`, `paused`, `canceled`), créditos restantes e histórico de faturas via query `mySubscription(organizationId)`.

#### Scenario: Visualização do plano ativo
- **WHEN** o usuário consulta o painel de assinatura da empresa
- **THEN** o sistema exibe o status atual, vigência do ciclo de faturamento, contadores de uso de créditos e notas fiscais emitidas.

### Requirement: Contratação / Assinatura de Plano
O sistema SHALL permitir que organizações assinem planos e gerenciem upgrades/downgrades ou pausas através da mutation `subscribeToPlan(organizationId, planId, paymentMethodInput)` com suporte a período de teste de 14 dias sem cartão e desconto vitalício de fundador quando aplicável.

#### Scenario: Assinatura com sucesso
- **WHEN** a organização escolhe um plano e confirma a assinatura com método de pagamento válido
- **THEN** a assinatura é registrada em `subscriptions`, os limites são atribuídos via `plan_features` e o acesso correspondente é liberado imediatamente.
