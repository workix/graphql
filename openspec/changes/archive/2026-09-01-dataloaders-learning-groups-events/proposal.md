## Why

Os módulos de cursos (`learning`), comunidades (`groups`) e eventos (`events`) possuem entidades com relacionamentos fundamentais ($1:N$, $N:1$, $N:N$) que atualmente não possuem Field Resolvers nem DataLoaders associados. Listagens de aulas de cursos, participantes de grupos, posts em comunidades e participantes de eventos disparam dezenas de consultas repetidas ao banco ($N+1$).

## What Changes

- Expansão dos schemas GraphQL de `learning`, `groups` e `events` para suportar campos aninhados:
  - `Course.instructor: User`, `Course.lessons: [CourseLesson]`
  - `CourseLesson.course: Course`
  - `CourseEnrollment.user: User`, `CourseEnrollment.course: Course`
  - `Group.owner: User`, `GroupMembership.user: User`, `GroupPost.author: User`
  - `Event.organizer: User`, `EventAttendee.user: User`
- Criação de novos loaders em lote no `src/dataloader.ts` (`coursesLoader`, `lessonsLoader`, `groupsLoader`, `eventsLoader`).
- Implementação de Field Resolvers em `learning.resolvers.ts`, `groups.resolvers.ts` e `events.resolvers.ts`.
- Testes unitários TDD cobrindo os novos DataLoaders.

## Capabilities

### New Capabilities
- `dataloaders-learning-groups-events`: Batching e caching com DataLoader para as entidades de cursos/aulas, grupos e eventos.

### Modified Capabilities

## Impact

- **Código afetado**: `src/dataloader.ts`, `src/modules/learning/graphql/`, `src/modules/groups/graphql/`, `src/modules/events/graphql/`.
- **APIs**: Disponibilização de campos relacionais tipados em `Course`, `CourseLesson`, `CourseEnrollment`, `Group`, `GroupMembership`, `GroupPost`, `Event`, `EventAttendee`.
- **Desempenho**: Redução drástica de consultas SQL no banco de dados durante a navegação em cursos, grupos e eventos.
