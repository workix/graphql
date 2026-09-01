## Why

As conversas de mensagens diretas (`messaging`), notificações (`notifications`) e recomendações/endossos de competências (`endorsements`) possuem alto volume de acessos e iterações contínuas. Ao exibir mensagens em tempo real ou caixas de entrada de notificações e listas de recomendações, a resolução de remetentes, destinatários e recomendadores gera gargalos $N+1$ em produção.

## What Changes

- Expansão dos esquemas GraphQL (`schema.gql`) dos módulos `messaging`, `notifications` e `endorsements` para mapear relações aninhadas:
  - `DirectMessage.sender: User`, `DirectMessage.recipient: User`
  - `Notification.user: User`
  - `Recommendation.recommender: User`, `Recommendation.recipient: User`
  - `SkillEndorsement.endorser: User`
- Implementação de Field Resolvers em `messaging.resolvers.ts`, `notifications.resolvers.ts` e `endorsements.resolvers.ts` integrando com `ctx.dataloaders.usersLoader`.
- Testes unitários TDD cobrindo a execução em lote das relações.

## Capabilities

### New Capabilities
- `dataloaders-messaging-notifications-social`: Resolução em lote via DataLoader para mensagens diretas, notificações do usuário e endossos/recomendações.

### Modified Capabilities

## Impact

- **Código afetado**: `src/modules/messaging/graphql/`, `src/modules/notifications/graphql/`, `src/modules/endorsements/graphql/`.
- **APIs**: Campos relacionais tipados em `DirectMessage`, `Notification`, `Recommendation` e `SkillEndorsement`.
- **Desempenho**: Eliminação de consultas repetidas para a tabela `users` durante conversas em chat e renderização de notificações.
