## Context

Ver `proposal.md` para motivação e justificativa. Atualmente `DataLoaderFactory` em `src/dataloader.ts` instancia `usersLoader` com escopo por requisição (`req['context']['dataloaders']`). No entanto, os módulos de feed (`posts`) e conexões (`connections`) não possuem Field Resolvers mapeados para carregar entidades filhas em lote.

## Goals / Non-Goals

**Goals:**
- Adicionar tipos e relações em `posts` (`Post.author`, `PostReaction.user`, `PostComment.author`) e `connections` (`Connection.user1`, `Connection.user2`, `ConnectionRequest.requester`, `ConnectionRequest.recipient`).
- Adicionar novos loaders batch em `src/dataloader.ts` se necessário (`PostLoader.batchReactions`, `PostLoader.batchComments`).
- Manter total isolamento por requisição evitando vazamentos de cache e concorrência.

**Non-Goals:**
- Não usar DataLoader para queries raiz (`Query.socialFeed`, `Query.myConnections`), mantendo buscas diretas em repositório conforme a matriz do `guia_dataloaders_graphql.md`.
- Não alterar regras de negócio de criação ou mutação.

## Decisions

- **Decisão 1: Reutilização do `usersLoader` existente no contexto**:
  - *Racional*: O `UserLoader.batchUsers` já faz projeção e ordenação correta de múltiplos IDs de usuários em lote. Utilizá-lo nos sub-resolvers economiza queries sem duplicar lógica de carregamento.
- **Decisão 2: Sub-resolvers com fallback seguro**:
  - *Racional*: Em sub-resolvers relacionais, caso o `id` da chave estrangeira seja nulo ou a entidade não seja encontrada, retornar `null` em conformidade com o GraphQL Schema.

## Risks / Trade-offs

- [Campos circulares em schemas] → Manter referências de tipos consistentes e sem dependências cíclicas infinitas nos DTOs.
- [Sobrecarga de memória em listas gigantes] → Limitar a paginação padrão na raiz (`limit: 50`) e resolver apenas os campos requisitados pelo AST (`RequestedFields`).
