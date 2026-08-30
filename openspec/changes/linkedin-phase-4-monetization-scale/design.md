# Design Técnico: Fase 4 — Monetização e Escala (`linkedin-phase-4-monetization-scale`)

## 1. Arquitetura de Dados (Modelos & Migrations)

### 1.1 Hashtags e Menções
- `Hashtag`: `id`, `tag` (UNIQUE), `created_at`.
- `PostHashtag`: `id`, `post_id`, `hashtag_id`, `created_at` (tabela pivô).
- `Mention`: `id`, `post_id`, `mentioned_user_id`, `created_at`.

### 1.2 Premium / Planos
- `SubscriptionPlan`: `id`, `name`, `price`, `billing_period`, `inmail_credits_per_month`, `created_at`, `updated_at`.
- `UserSubscription`: `id`, `user_id`, `plan_id`, `status` (ACTIVE, EXPIRED, CANCELED), `inmail_credits_remaining`, `started_at`, `expires_at`, `created_at`, `updated_at`.

### 1.3 LinkedIn Learning
- `Course`: `id`, `title`, `description`, `instructor_id`, `media_id` (capa), `created_at`, `updated_at`.
- `CourseLesson`: `id`, `course_id`, `title`, `media_id` (vídeo-aula), `order_index`, `created_at`.
- `CourseEnrollment`: `id`, `course_id`, `user_id`, `enrolled_at`.
- `CourseCompletion`: `id`, `enrollment_id`, `completed_at`, `certificate_url`.

### 1.4 Social Selling Index
- `SocialSellingScore`: `id`, `user_id`, `score` (0-100), `posts_score`, `network_score`, `engagement_score`, `relationships_score`, `calculated_at`.

### 1.5 Verificação de Identidade (modificação de tabela existente)
- **Tabela `users` (ALTER TABLE — requer aprovação explícita)**:
  - `verified BOOLEAN NOT NULL DEFAULT false`
  - `verification_method ENUM('GOV_ID','WORK_EMAIL','PHONE') NULL`

## 2. Módulos GraphQL

- `src/modules/hashtags`: Schema, repo, resolvers e DTOs para hashtags/menções. Integra com `src/modules/posts` via parser regex aplicado em `createPost` (extração de `#tag` e `@menção` do conteúdo, sem quebrar a assinatura atual da mutation).
- `src/modules/premium`: Schema, repo, resolvers e DTOs para planos e assinaturas; expõe `requirePlanResolver(minPlan)` em `src/composable_resolvers` para reutilização por outros módulos.
- `src/modules/learning`: Schema, repo, resolvers e DTOs para cursos, aulas, matrículas e certificados.
- `src/modules/social_selling`: Schema, repo, resolvers e DTOs para cálculo e consulta do SSI.
- `src/modules/messaging` (modificação): `sendMessage` passa a aceitar destinatários fora do grafo de conexões quando o remetente tiver `UserSubscription` ativa com `inmail_credits_remaining > 0`; nesse caso decrementa o contador em vez de lançar o erro `'Must be connected to send direct messages'`.
- `src/modules/users` / `src/models/user.ts` (modificação, pendente de aprovação): expõe `verified` e `verification_method` no `UserDTO` e adiciona mutation `verifyIdentity(userId: ID!, method: String!)`.

## 3. Composable Resolver de Planos

Seguindo o padrão de `compose(authResolver, verifyTokenResolver)` (BR-002):

```ts
const requirePlanResolver = (minPlan: string) => (resolver: any) => async (parent: any, args: any, ctx: any, info: any) => {
  const subscription = await premiumRepository(ctx.orm).getActiveSubscription(ctx.user.id);
  if (!subscription || !planSatisfies(subscription.plan, minPlan)) {
    throw new Error('Premium plan required for this action');
  }
  return resolver(parent, args, ctx, info);
};
```

## 4. Avaliação de Arquitetura (Apollo Federation)

Item de documentação: registrar em `openspec/changes/linkedin-phase-4-monetization-scale/design.md` (esta seção) os critérios de reavaliação — volume de requisições, tamanho do schema, necessidade de times independentes por domínio — sem implementação de subgraphs nesta fase.

## 5. Estratégia de Testes TDD
- Criar suítes de testes unitários isoladas em `tests/unit/modules/` para cada módulo novo (`hashtags`, `premium`, `learning`, `social_selling`).
- Estender `tests/unit/modules/messaging.spec.ts` para cobrir o novo fluxo de InMail.
- Manter limiar de 100% de cobertura para os módulos novos (limiar global do Jest possui débito pré-existente registrado em `KNOW_ISSUES.md`, ISSUE-001).
