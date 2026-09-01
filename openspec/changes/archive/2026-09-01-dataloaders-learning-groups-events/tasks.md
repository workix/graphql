## 1. Mapeamento de Schemas e DTOs

- [x] 1.1 Atualizar `src/modules/learning/graphql/schema.gql` com relações `instructor`, `lessons`, `course`, `user`
- [x] 1.2 Atualizar `src/modules/groups/graphql/schema.gql` com relações `owner`, `user`, `author`
- [x] 1.3 Atualizar `src/modules/events/graphql/schema.gql` com relações `organizer`, `user`

## 2. Implementação de Loaders e Field Resolvers

- [x] 2.1 Criar `CourseLoader`, `GroupLoader` e `EventLoader` em `src/dataloader.ts`
- [x] 2.2 Implementar Field Resolvers em `learning.resolvers.ts`, `groups.resolvers.ts` e `events.resolvers.ts`
- [x] 2.3 Criar testes unitários em `tests/unit/dataloaders_learning_groups_events.spec.ts`
