## 1. Governança Open Core e Documentação Pública

- [ ] 1.1 Criar documento `RANKING.md` detalhando a fórmula de ranqueamento orgânico auditável e as regras de slots patrocinados
- [ ] 1.2 Criar documento `TRADEMARK.md` com a política de marca registrada Workix e limites de uso em forks AGPLv3
- [ ] 1.3 Criar documento `CLA.md` com o Contributor License Agreement em português claro
- [ ] 1.4 Criar documento `PRIVACY.md` especificando o tratamento LGPD, consentimento em 3 chaves e retenção de logs
- [ ] 1.5 Criar documento `SELF-HOSTING.md` com guia de execução do núcleo aberto e esclarecimento sobre módulos comerciais
- [ ] 1.6 Atualizar `README.md` e `SPECIFICATION.md` com a seção oficial dos 5 Pactos e o novo modelo de monetização

## 2. Modelagem de Dados e Migrações (Sequelize)

- [ ] 2.1 Criar migrações para novas tabelas de faturamento e planos (`plans`, `plan_features`, `subscriptions`, `subscription_overrides`, `usage_counters`, `purchases`, `invoices`, `webhook_events`, `billing_audit_log`)
- [ ] 2.2 Criar migrações para controle de visibilidade e consentimento (`visibility_settings`, `profile_views`, `contact_unlocks`)
- [ ] 2.3 Criar migrações para impulsionamento de vagas (`job_boosts`, `profile_boosts`)
- [ ] 2.4 Atualizar tabelas existentes (`candidates`, `companies`, `jobs`) adicionando campos de validade, taxas de resposta e desfecho
- [ ] 2.5 Criar seeders para catálogo de planos versionados (`free_v1`, `starter_v1`, `pro_v1`, `business_v1`) e seus limites em `plan_features`

## 3. Conformidade LGPD & Chaves de Visibilidade do Candidato

- [ ] 3.1 Remover obrigatoriedade do CPF no cadastro inicial de candidatos, adotando validação por e-mail/Firebase
- [ ] 3.2 Implementar modelo e repositório para `visibility_settings` (as 3 chaves do candidato)
- [ ] 3.3 Implementar a função server-side `reveal(candidate, viewer_organization, data_scope)` para proteção de dados pessoais
- [ ] 3.4 Implementar registro e rotina periódica de purga automática de `profile_views` (12 meses Premium / 7 dias Free)
- [ ] 3.5 Criar queries e mutations GraphQL para gestão de preferências de visibilidade do candidato

## 4. Integridade de Vagas & Taxa de Resposta Pública da Empresa

- [ ] 4.1 Implementar validação e expiração compulsória de vagas vencidas (`expires_at`) com solicitação de desfecho
- [ ] 4.2 Implementar rotina diária para cálculo da taxa de resposta de 90 dias (`response_rate_90d`) e tempo médio de resposta
- [ ] 4.3 Exibir publicamente a taxa de resposta da empresa na Company Page e schema GraphQL
- [ ] 4.4 Implementar verificação de critérios de mérito e suspensão automática para o Selo de Empresa Verificada

## 5. Motor de Entitlements e Planos Versionados

- [ ] 5.1 Implementar repositórios de acesso a planos, limites e contadores de uso (`usage_counters`)
- [ ] 5.2 Implementar a função server-side `can(organization, feature_key, quantity)` integrada ao contexto GraphQL
- [ ] 5.3 Implementar lógica de degradação suave e arquivamento de vagas excedentes no downgrade de plano
- [ ] 5.4 Criar queries e mutations GraphQL para catálogo de planos e consulta de status de assinatura da empresa

## 6. Motor de Vagas em Destaque e Rotulagem Obrigatória

- [ ] 6.1 Implementar repositório e regras de negócio para alocação de `job_boosts` respeitando limite de slots por região/categoria
- [ ] 6.2 Implementar injeção obrigatória e imutável de `is_sponsored = true` e `sponsor_label = 'Patrocinada'` nos resolvers de busca
- [ ] 6.3 Garantir a preservação integral do resultado orgânico retornado abaixo dos blocos de destaque
- [ ] 6.4 Implementar mutations GraphQL para contratação de destaque avulso e ativação via créditos do plano

## 7. Desbloqueio de Contato com Notificação Obrigatória

- [ ] 7.1 Implementar mutation `unlockCandidateContact` registrando o acesso em `contact_unlocks` com débito de créditos
- [ ] 7.2 Integrar notificação assíncrona obrigatória ao candidato titular (`notified_candidate_at`) via fila RabbitMQ/e-mail

## 8. Faturamento Nacional e Webhooks Idempotentes

- [ ] 8.1 Implementar serviço de integração com gateway de pagamento nacional (Asaas/Iugu) para Pix, Cartão e Boleto
- [ ] 8.2 Implementar endpoint de webhook com persistência prévia em `webhook_events` e garantia de idempotência
- [ ] 8.3 Implementar gravação e consulta de NFS-e emitida em `invoices` e `purchases`
- [ ] 8.4 Implementar máquina de estados de cobrança e dunning (recuperação de falhas de pagamento)

## 9. Testes Automatizados TDD e Validação

- [ ] 9.1 Escrever testes unitários para a função `can()` cobrindo todas as combinações de planos, limites e contadores
- [ ] 9.2 Escrever testes unitários para a função `reveal()` cobrindo todas as 3 chaves de visibilidade e negações de acesso
- [ ] 9.3 Escrever testes de integração para o webhook idempotente e transações de faturamento
- [ ] 9.4 Escrever testes de contrato GraphQL garantindo que `is_sponsored = true` nunca omita o `sponsor_label`
