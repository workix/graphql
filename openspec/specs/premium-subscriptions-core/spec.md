# premium-subscriptions-core Specification

## Purpose
Especifica o comportamento, regras de exibição e fluxo de assinatura de planos e créditos InMail no ecossistema Workix.

## Requirements

### Requirement: Tabela de Planos de Assinatura
O sistema SHALL listar os planos de assinatura disponíveis via query `subscriptionPlans` exibindo nome, preço, período de faturamento e créditos de InMail mensais.

#### Scenario: Visualização de planos premium
- **WHEN** o usuário acessa `/premium`
- **THEN** a tabela comparativa de benefícios (Free, Premium Career, Recruiter) é exibida.

### Requirement: Consulta de Assinatura Ativa
O sistema SHALL permitir que o usuário consulte o status de sua assinatura ativa e saldo de créditos InMail via query `mySubscription(userId)`.

#### Scenario: Visualização do plano ativo
- **WHEN** o usuário consulta o painel de assinatura
- **THEN** o sistema exibe o status (ACTIVE, EXPIRED), data de renovação e créditos InMail restantes.

### Requirement: Contratação / Assinatura de Plano
O sistema SHALL permitir que usuários autenticados assinem um plano premium via mutation `subscribeToPlan(userId, planId)`.

#### Scenario: Assinatura com sucesso
- **WHEN** o usuário escolhe um plano e confirma a contratação
- **THEN** a assinatura é ativada e os créditos de InMail são creditados.

### Requirement: Interface Mobile de Planos no Android
O sistema SHALL disponibilizar suporte a planos de assinatura no app Android através do `PremiumPlansActivity.kt`.

#### Scenario: Contratação de plano no Android
- **WHEN** o usuário acessa a tela de Planos Premium no app Android
- **THEN** ele pode selecionar um plano e assinar diretamente no aplicativo móvel.
