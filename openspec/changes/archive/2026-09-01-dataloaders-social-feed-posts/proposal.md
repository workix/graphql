## Why

A resolução de dados aninhados nos módulos de feed social (`posts`) e rede de relacionamentos (`connections`) atualmente não conta com Field Resolvers e DataLoaders dedicados. Ao consultar listas de posts (`socialFeed`) ou conexões (`myConnections`), a expansão de campos relacionais como autor (`author`), usuário de reação (`user`), autor de comentário (`author`) ou participantes de conexão (`user1`, `user2`) causa o problema de consultas $N+1$, sobrecarregando o banco de dados e degradando o tempo de resposta da API GraphQL.

## What Changes

- Expansão dos esquemas GraphQL (`schema.gql`) dos módulos `posts` e `connections` para incluir campos relacionais aninhados (`Post.author`, `PostReaction.user`, `PostComment.author`, `Connection.user1`, `Connection.user2`, `ConnectionRequest.requester`, `ConnectionRequest.recipient`).
- Implementação de Field Resolvers em `posts.resolvers.ts` e `connections.resolvers.ts` integrando com `ctx.dataloaders.usersLoader`.
- Criação de novos métodos batch em `src/dataloader.ts` para agrupamento em lote de reações (`postReactionsLoader`) e comentários (`postCommentsLoader`) associados a posts.
- Adição de testes unitários TDD cobrindo a execução em lote sem queries duplicadas.

## Capabilities

### New Capabilities
- `dataloaders-social-feed-posts`: Resolução otimizada em lote com DataLoader nos módulos de feed social, reações, comentários e conexões.

### Modified Capabilities

## Impact

- **Código afetado**: `src/dataloader.ts`, `src/modules/posts/graphql/`, `src/modules/connections/graphql/`.
- **APIs**: Adição de campos de relacionamento nos tipos GraphQL `Post`, `PostReaction`, `PostComment`, `Connection`, `ConnectionRequest`.
- **Desempenho**: Redução drástica de queries SQL de $1 + N$ para $1 + 1$ por nível de aninhamento durante a recuperação de feeds e listas de contatos.
