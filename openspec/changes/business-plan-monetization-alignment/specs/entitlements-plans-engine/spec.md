## Purpose

Define o motor de autorização de capacidades e catálogo de planos de faturamento orientados a dados, provendo limites dinâmicos e controle centralizado server-side via função can().

## ADDED Requirements

### Requirement: Catálogo Versionado de Planos e Recursos
O sistema SHALL estruturar planos e recursos através das tabelas `plans` e `plan_features` (com limites para vagas ativas, usuários/recrutadores, créditos de contato, retenção de histórico e acesso a API), permitindo ajuste de parâmetros comerciais sem alteração no código-fonte.

#### Scenario: Consulta de catálogo de planos ativos
- **WHEN** uma organização consulta os planos de faturamento disponíveis
- **THEN** o sistema retorna os planos configurados (Free, Starter, Pro, Business) com seus respectivos limites e preços.

### Requirement: Verificação Centralizada de Autorização via Função can()
A API GraphQL SHALL centralizar a autorização de ações corporativas na função server-side `can(organization, feature_key, quantity)`, avaliando status da assinatura, limites de plano em `plan_features`, contadores de uso em `usage_counters` e eventuais `subscription_overrides`.

#### Scenario: Bloqueio de publicação além do limite do plano
- **WHEN** uma empresa no plano Free (limite de 1 vaga ativa) tenta publicar uma 2ª vaga simultânea
- **THEN** a função `can()` retorna negação (`Deny`) com o motivo e indicação clara da opção de upgrade para Starter.

### Requirement: Degradação Suave e Preservação de Dados no Downgrade
O sistema SHALL preservar integralmente dados existentes ao ocorrer cancelamento ou transição de plano, arquivando vagas excedentes com opção de seleção da vaga ativa sem destruir histórico ou informações de processos anteriores.

#### Scenario: Transição de plano Pro para Free
- **WHEN** a assinatura de uma empresa no plano Pro é encerrada e passa para o plano Free
- **THEN** o sistema mantém todas as candidaturas anteriores acessíveis, arquiva as vagas além do limite de 1 vaga ativa e permite que a empresa escolha qual vaga manter pública.
