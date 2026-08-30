# Proposta: Fase 4 — Monetização e Escala (`linkedin-phase-4-monetization-scale`)

## 1. Contexto e Objetivos

Esta proposta implementa a **Fase 4 (Monetização e Escala)** da paridade técnica com a plataforma LinkedIn, conforme o roadmap oficial em `SPECIFICATION_LINKEDIN.md` (Seção 7). O objetivo é introduzir mecanismos de monetização (**Planos Premium e InMail**), diferenciação de conteúdo educacional (**LinkedIn Learning**), inteligência de rede (**Social Selling Index**) e confiança/segurança (**Verificação de Identidade**). Também fecha um débito herdado da Fase 3: **Hashtags e Menções** (Seção 4.8), previsto no roadmap para a Fase 3 mas não incluído na proposta `linkedin-phase-3-community-analytics` executada.

## 2. Escopo das Funcionalidades

1. **Hashtags e Menções (`hashtags`, `post_hashtags`, `mentions`)** — débito herdado da Fase 3:
   - Extração automática de `#hashtag` e `@menção` via regex no resolver de criação de post.
   - Query `postsByHashtag(tag, start, max)`.
   - Notificação ao usuário mencionado reaproveitando o pipeline RabbitMQ `notifications`.
2. **Premium / Planos + InMail avançado (`subscription_plans`, `user_subscriptions`)**:
   - Composable resolver `requirePlanResolver(minPlan)` seguindo o padrão de `compose(authResolver, verifyTokenResolver)` (BR-002).
   - Extensão da mutation `sendMessage` do módulo `messaging`: permite envio a não-conexões quando o remetente possui plano Premium ativo, decrementando um contador mensal de créditos de InMail.
   - Sem integração real de gateway de pagamento — fora do escopo técnico deste levantamento (`SPECIFICATION.md`, Seção 1.2 "Não Incluído").
3. **LinkedIn Learning (`courses`, `course_lessons`, `course_enrollments`, `course_completions`)**:
   - Módulo `src/modules/learning` reaproveitando o módulo de mídia já existente (`media`) para vídeo-aulas.
   - Certificados de conclusão exibidos na seção de Licenças e Certificações do perfil (Seção 4.18).
4. **Social Selling Index (`social_selling_scores`)**:
   - Serviço/job que calcula score 0–100 combinando nº de posts publicados, taxa de engajamento recebida, nº de conexões qualificadas (mesmo setor) e nº de InMails/mensagens respondidas.
5. **Verificação de Identidade / Selo Verificado**:
   - Campos `verified` e `verification_method` na tabela `users` existente (**ALTER TABLE** — requer aprovação explícita antes de aplicar, conforme regra de modificação de estrutura de banco).
   - Fluxo de verificação por e-mail corporativo reaproveitando a infraestrutura JWT já existente (BR-001).
6. **Avaliação de Arquitetura para Apollo Federation**:
   - Item de avaliação/documentação (não implementação obrigatória nesta fase) sobre divisão em microsserviços, caso o volume justifique.

## 3. Critérios de Aceite e Qualidade
- **TDD (Red-Green-Refactor)** para cada modelo, repositório e resolver.
- **100% de Cobertura de Testes** validada no Jest, por módulo novo.
- Commits incrementais em **baby steps** com autoria `Felipe Rodrigues Michetti <frmichetti@gmail.com>`.
- Toda modificação de estrutura em tabelas **já existentes** (ex.: `users`) deve ser notificada e aprovada antes da execução da migration.
