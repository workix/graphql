## 1. Hashtags e Menções (`hashtags`) — débito herdado da Fase 3

- [ ] 1.1 Criar modelos Sequelize `Hashtag`, `PostHashtag`, `Mention` e suas migrations
- [ ] 1.2 Criar módulo GraphQL `src/modules/hashtags` com schema, DTOs, repositório e resolvers; integrar parser de `#hashtag`/`@menção` na mutation `createPost` existente e notificar usuário mencionado via RabbitMQ
- [ ] 1.3 Criar suíte de testes unitários TDD em `tests/unit/modules/hashtags.spec.ts` com 100% de cobertura

## 2. Premium / Planos e InMail (`premium`)

- [ ] 2.1 Criar modelos Sequelize `SubscriptionPlan`, `UserSubscription` e suas migrations
- [ ] 2.2 Criar módulo GraphQL `src/modules/premium` com schema, DTOs, repositório e resolvers para planos e assinaturas; criar composable `requirePlanResolver` em `src/composable_resolvers`
- [ ] 2.3 Estender `src/modules/messaging` (`sendMessage`) para permitir InMail a não-conexões com plano ativo, decrementando créditos mensais
- [ ] 2.4 Criar/estender suítes de testes unitários TDD (`tests/unit/modules/premium.spec.ts` e extensão de `tests/unit/modules/messaging.spec.ts`) com 100% de cobertura

## 3. LinkedIn Learning (`learning`)

- [ ] 3.1 Criar modelos Sequelize `Course`, `CourseLesson`, `CourseEnrollment`, `CourseCompletion` e suas migrations
- [ ] 3.2 Criar módulo GraphQL `src/modules/learning` com schema, DTOs, repositório e resolvers para cursos, matrículas e certificados
- [ ] 3.3 Criar suíte de testes unitários TDD em `tests/unit/modules/learning.spec.ts` com 100% de cobertura

## 4. Social Selling Index (`social_selling`)

- [ ] 4.1 Criar modelo Sequelize `SocialSellingScore` e sua migration
- [ ] 4.2 Criar módulo GraphQL `src/modules/social_selling` com schema, DTOs, repositório e resolver de cálculo/consulta do score
- [ ] 4.3 Criar suíte de testes unitários TDD em `tests/unit/modules/social_selling.spec.ts` com 100% de cobertura

## 5. Verificação de Identidade

- [ ] 5.1 **Aprovação obrigatória**: apresentar ao usuário o relatório da migration de ALTER TABLE em `users` (colunas `verified`, `verification_method`) antes de criar o arquivo de migration
- [ ] 5.2 Criar migration de alteração da tabela `users` (após aprovação) e atualizar o model `User`/`UserDTO`
- [ ] 5.3 Adicionar mutation `verifyIdentity` no módulo `src/modules/users` reaproveitando a infraestrutura JWT existente (BR-001)
- [ ] 5.4 Criar/estender suíte de testes unitários TDD cobrindo o fluxo de verificação com 100% de cobertura

## 6. Avaliação de Arquitetura (Apollo Federation)

- [ ] 6.1 Documentar critérios de reavaliação (volume de requisições, tamanho do schema, autonomia de times) e uma recomendação preliminar em `design.md` — sem implementação de subgraphs nesta fase

## 7. Validação Final

- [ ] 7.1 Rodar suíte completa do Jest e atualizar `KNOW_ISSUES.md` caso o débito de cobertura global (ISSUE-001) mude de estado
- [ ] 7.2 Gerar relatório final de migrações da Fase 4 e obter aprovação antes de concluir
