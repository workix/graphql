## 1. Mapeamento de Schemas e DTOs

- [ ] 1.1 Atualizar `src/modules/learning/graphql/schema.gql` com relações `instructor`, `lessons`, `course`, `user`
- [ ] 1.2 Atualizar `src/modules/groups/graphql/schema.gql` com relações `owner`, `user`, `author`
- [ ] 1.3 Atualizar `src/modules/events/graphql/schema.gql` com relações `organizer`, `user`

## 2. Implementação de Loaders e Field Resolvers

- [ ] 2.1 Criar `CourseLoader`, `GroupLoader` e `EventLoader` em `src/dataloader.ts`
- [ ] 2.2 Implementar Field Resolvers em `learning.resolvers.ts`, `groups.resolvers.ts` e `events.resolvers.ts`
- [ ] 2.3 Criar testes unitários em `tests/unit/dataloaders_learning_groups_events.spec.ts`
