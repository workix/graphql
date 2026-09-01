## Context

Ver `proposal.md` para motivação e justificativa. As entidades `Course`, `Group` e `Event` possuem chaves estrangeiras (`instructorId`, `ownerId`, `organizerId`, `userId`, `courseId`, `groupId`, `eventId`) persistidas no banco relacional, mas que carecem de sub-resolvers integrados com DataLoaders.

## Goals / Non-Goals

**Goals:**
- Adicionar classes batch loaders em `src/dataloader.ts`: `CourseLoader`, `GroupLoader`, `EventLoader`.
- Registrar `coursesLoader`, `lessonsLoader`, `groupsLoader`, `eventsLoader` no `DataLoaderFactory`.
- Mapear Field Resolvers em `learning.resolvers.ts`, `groups.resolvers.ts` e `events.resolvers.ts`.

**Non-Goals:**
- Não usar DataLoader para queries raiz com paginação dinâmica complexa (`Query.courseLessons`, `Query.groupPosts`, `Query.eventAttendees`), mantendo as consultas de lista nos repositórios e usando DataLoaders exclusivamente para os campos aninhados dos nós filhos.

## Decisions

- **Decisão 1: Criação de Loaders especializados $1:N$ e $N:1$**:
  - *Racional*: Mapear chaves compostas em Map e garantir o retorno na ordem exata dos identificadores requisitados.
- **Decisão 2: Uso de `usersLoader` para todos os relacionamentos com usuários**:
  - *Racional*: Reutilizar a projeção otimizada de `UserLoader.batchUsers`.

## Risks / Trade-offs

- [Consumo de memória em batches de aulas/participantes] → Utilizar projeção restrita de atributos via `RequestedFields`.
