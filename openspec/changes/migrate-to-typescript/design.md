## Context

O projeto `graphql` é a aplicação backend maestro construída com Node.js, Express, Apollo Server / Express GraphQL e Sequelize ORM. Atualmente, a base de código está escrita inteiramente em JavaScript ES6+ (com transpilador Babel). Para elevar a qualidade do código, eliminar erros runtime em modelos e resolvers, e facilitar a manutenção, o projeto será migrado para TypeScript com tipagem estática rigorosa.

## Goals / Non-Goals

**Goals:**
- Configurar o compilador TypeScript (`tsconfig.json`) com modo estrito (`strict: true`).
- Adicionar todas as dependências de desenvolvimento necessárias (`typescript`, `@types/node`, `@types/express`, `@types/graphql`, `@types/jsonwebtoken`, `@types/bcrypt`, `@types/lodash`, `@types/jest`, `ts-node-dev`).
- Criar a camada de tipagem centralizada em `src/types/`:
  - Contexto GraphQL (`GraphQLContext` com DataLoader loaders, user autenticado, req/res);
  - DTOs de entrada e saída para Mutations/Queries;
  - Interfaces dos 29 modelos Sequelize (`CandidateAttributes`, `JobAttributes`, `UserAttributes`, etc.);
  - Interfaces de payloads JWT e respostas paginadas.
- Converter todos os arquivos de código `.js` em `src/` para `.ts`.
- Garantir a compilação limpa (`tsc --noEmit` sem erros).

**Non-Goals:**
- Alterar as assinaturas de rotas REST ou campos das queries/mutations GraphQL já existentes.
- Refatorar a estrutura física dos diretórios do projeto (a hierarquia em `src/` será preservada).

## Decisions

### 1. Ferramental de Compilação e Dev Server
- **Decisão**: Substituir `@babel/core`, `@babel/node` e `nodemon` por `typescript` e `ts-node-dev`.
- **Justificativa**: `ts-node-dev` recompila e reinicia o servidor automaticamente em ambiente de desenvolvimento com checagem rápida de tipos, eliminando a necessidade de passar por transpilação extra do Babel.

### 2. Estratégia de Tipagem dos Modelos Sequelize
- **Decisão**: Tipar os modelos Sequelize utilizando a API de interfaces de atributos do Sequelize (`Model<TAttributes, TCreationAttributes>`) ou declaração de classes tipadas extendendo `Model`.
- **Justificativa**: Garante que buscas via `findOne`, `findAll`, `create` e `update` retornem objetos FORTEMENTE tipados no TypeScript, prevenindo acessos a propriedades inexistentes.

### 3. Tipagem de Contexto e Resolvers GraphQL
- **Decisão**: Definir uma interface `GraphQLContext` que inclui a instância dos `DataLoaders`, token JWT decodificado e conexões.
- **Justificativa**: Os resolvers receberão `(parent, args, context: GraphQLContext, info)` completamente tipados, eliminando `any` em todos os parâmetros.

## Risks / Trade-offs

- **Extensão da Base de Código (29 Modelos + 16 Módulos)**:
  - *Risco*: Erros de tipagem em cascata ao converter arquivos de forma desordenada.
  - *Mitigação*: Fasear a migração: primeiro dependências e `tsconfig.json`, segundo tipos/interfaces (`src/types`), terceiro modelos Sequelize (`src/models`), quarto DataLoader e middlewares, quinto módulos/resolvers (`src/modules`), e por fim `src/index.ts`.
- **Tipagem de Pacotes sem `@types` Oficiais**:
  - *Risco*: Bibliotecas secundárias que não possuem `@types` publicados.
  - *Mitigação*: Criar declarações de módulos customizadas em `src/types/global.d.ts`.
