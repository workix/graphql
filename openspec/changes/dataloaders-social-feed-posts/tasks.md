## 1. Mapeamento de Tipos e Esquemas GraphQL

- [ ] 1.1 Atualizar `src/modules/posts/graphql/schema.gql` adicionando relações `author`, `user` em `PostReaction` e `author` em `PostComment`
- [ ] 1.2 Atualizar `src/modules/connections/graphql/schema.gql` adicionando relações `user1`, `user2`, `requester`, `recipient`

## 2. Field Resolvers e Batch Loaders

- [ ] 2.1 Implementar Field Resolvers em `src/modules/posts/graphql/posts.resolvers.ts` com `usersLoader`
- [ ] 2.2 Implementar Field Resolvers em `src/modules/connections/graphql/connections.resolvers.ts` com `usersLoader`
- [ ] 2.3 Criar testes unitários em `tests/unit/dataloaders_posts_connections.spec.ts` validando o carregamento em lote sem N+1
