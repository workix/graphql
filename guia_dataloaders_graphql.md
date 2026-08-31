# Guia Prático: Onde e Como Implementar DataLoaders no GraphQL

## 1. Visão Geral

O **DataLoader** é um utilitário projetado para resolver o problema clássico de consultas **N+1** em APIs GraphQL por meio de duas estratégias fundamentais:
1. **Batching (Agrupamento em Lote):** Coleta múltiplos identificadores (`IDs`) solicitados durante a mesma iteração do ciclo de eventos (event loop) e executa uma única busca agregada (ex.: `SELECT * WHERE id IN (...)`).
2. **Caching em Memória por Requisição:** Evita buscas redundantes da mesma chave dentro da mesma execução de consulta.

---

## 2. Onde Implementar o DataLoader?

Os DataLoaders devem ser implementados **exclusivamente nos Field Resolvers (ou sub-resolvers) de entidades aninhadas/relacionamentos**, e nunca como substitutos genéricos de chamadas diretas na raiz.

### Ponto de Injeção: Field Resolvers
O problema do $N+1$ ocorre tipicamente quando uma query raiz retorna uma lista e, para cada item dessa lista, o schema precisa resolver um campo filho.

* **Exemplo Clássico:**
  * Query Raiz: `Query.posts` retorna 50 posts.
  * Sub-resolver: `Post.author` precisa do autor de cada post.
  * **Sem DataLoader:** 1 consulta para os posts + 50 consultas individuais para cada autor ($1 + N$).
  * **Com DataLoader:** O sub-resolver `Post.author` chama `context.loaders.authorLoader.load(post.authorId)`. O DataLoader agrupa todos os 50 IDs e dispara apenas 1 consulta em lote.

### Ciclo de Vida: Escopo por Requisição (Request-Scoped)
* **Regra Fundamental:** Os DataLoaders **devem ser instanciados dentro do contexto de cada requisição HTTP**.
* **Motivo:** O cache do DataLoader opera por instância. Se você compartilhar uma instância global de DataLoader entre diferentes requisições/usuários:
  * Haverá **vazamento de dados** (data leak) entre usuários com permissões diferentes.
  * Dados obsoletos serão servidos caso outra requisição altere o banco.
  * Problemas de concorrência e gerenciamento de memória.

---

## 3. É melhor só utilizar DataLoaders para tudo?

**Não.** Usar DataLoaders indiscriminadamente para todas as consultas do sistema introduz complexidade desnecessária, piora a manutenibilidade e pode degradar o desempenho.

### Matriz de Decisão: Quando Usar vs. Quando Não Usar

| Cenário / Tipo de Consulta | Usar DataLoader? | Motivo / Justificativa |
| :--- | :---: | :--- |
| **Campos Aninhados / Relações ($1:1$, $1:N$, $N:1$)** | **Sim** | Elimina o $N+1$ transformando dezenas de queries em uma única busca com `WHERE id IN (...)`. |
| **Consultas Raiz (`Query.users`, `Query.postById`)** | **Não** | A query raiz já executa uma única busca direta. Adicionar um DataLoader cria sobrecarga de fila e agendamento sem benefício. |
| **Listas Paginadas e Filtros Dinâmicos Complexos** | **Não** | Agrupar chaves compostas complexas (ex: `(authorId, status, limit, offset)`) em batch é ineficiente e complexo no banco. |
| **Mutações (Create, Update, Delete)** | **Não** | O cache em memória do loader pode mascarar alterações recém-persistidas e retornar dados desatualizados. |
| **Consultas com Joins já Otimizados** | **Não** | Se a camada de dados/ORM já resolve a projeção completa via `JOIN` ou `Lookahead` na raiz, o DataLoader se torna redundante. |

---

## 4. Regras Práticas de Arquitetura

1. **Na Raiz (`Query.*`):** Busque diretamente no banco de dados ou serviço via repositório/service padrão.
2. **Nas Bordas e Relações (`Type.nestedField`):** Utilize `loader.load(id)` para delegar a resolução concorrente em lote.
3. **No Contexto:** Crie uma factory de loaders (`createLoaders()`) e anexe ao `context` na entrada de cada requisição.
4. **Alinhamento dos Resultados:** A função batch do DataLoader **deve** retornar uma lista com a **mesma quantidade e na mesma ordem** das chaves fornecidas. Caso um item não exista, deve retornar `null` ou uma instância de `Error`.

---

## 5. Exemplo de Estrutura de Código (TypeScript / Node.js)

```typescript
import DataLoader from 'dataloader';

// 1. Definição da Batch Function
export function createLoaders(db: DatabaseClient) {
  return {
    authorLoader: new DataLoader<string, User>(async (authorIds) => {
      // 1 query para N autores
      const users = await db.users.findMany({
        where: { id: { in: [...authorIds] } }
      });
      
      // Mapeia para manter a ordem exata das chaves recebidas
      const userMap = new Map(users.map((u) => [u.id, u]));
      return authorIds.map((id) => userMap.get(id) ?? null);
    }),
  };
}

// 2. Injeção no Contexto GraphQL (por requisição)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      db,
      loaders: createLoaders(db), // Nova instância por request
    };
  },
});

// 3. Uso nos Resolvers
const resolvers = {
  Query: {
    posts: async (_, __, { db }) => {
      // Busca direta na raiz (sem DataLoader)
      return db.posts.findMany({ take: 20 });
    },
  },
  Post: {
    author: async (post, _, { loaders }) => {
      // Resolução em lote via DataLoader no campo aninhado
      return loaders.authorLoader.load(post.authorId);
    },
  },
};
```
