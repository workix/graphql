## Context

Ver `proposal.md` para motivação e justificativa. As mensagens diretas (`DirectMessage`), notificações (`Notification`) e recomendações/endossos (`Recommendation`, `SkillEndorsement`) operam em alta frequência de leitura e utilizam `userId`, `senderId`, `recipientId`, `recommenderId` e `endorserId`.

## Goals / Non-Goals

**Goals:**
- Mapear os tipos GraphQL em `messaging`, `notifications` e `endorsements` com campos relacionais.
- Adicionar Field Resolvers conectando com `ctx.dataloaders.usersLoader`.
- Garantir 100% de cobertura de testes unitários sem queries $N+1$.

**Non-Goals:**
- Não usar DataLoader para consultas paginadas de conversas completas (`Query.directMessages`), preservando os repositórios na raiz.

## Decisions

- **Decisão 1: Reutilização uniforme do `usersLoader`**:
  - *Racional*: Evita criar múltiplos loaders redundantes que consultam a mesma tabela `users`.
- **Decisão 2: Suporte a subscrições em tempo real**:
  - *Racional*: Assegurar que os payloads emitidos em `Subscription.directMessageAdded` e `Subscription.notificationAdded` possam resolver campos aninhados sem quebrar o contexto.

## Risks / Trade-offs

- [Resolução de usuário nulo ou deletado] → Retornar `null` de forma resiliente sem disparar exceções GraphQL.
