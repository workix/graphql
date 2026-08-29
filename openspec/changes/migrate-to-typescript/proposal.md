# Proposta: Migração do Projeto Pai `graphql` para TypeScript com Tipagem Forte

## Why

Atualmente, o projeto pai `graphql` está escrito em JavaScript ES6+ utilizando Babel e Nodemon. A ausência de tipagem estática dificulta a manutenção, a evolução de modelos/resolvers GraphQL e aumenta o risco de erros em tempo de execução (como *NullPointer/TypeError*). Converter a base de código inteira para TypeScript trará segurança de tipos em tempo de compilação, autocompletar em IDEs e maior confiabilidade na integração de schemas, DTOs e entidades Sequelize.

## What Changes

- **Infraestrutura & Tooling**:
  - Instalação de `typescript`, `@types/node`, `@types/express`, `@types/graphql`, `@types/jsonwebtoken`, `@types/bcrypt`, `@types/lodash`, `@types/jest`, `ts-node-dev`.
  - Adição do arquivo de configuração `tsconfig.json` com regras estritas (`strict: true`, `target: es2022`, `moduleResolution: node`).
  - Atualização dos scripts do `package.json` para substituir Babel pelo compilador TypeScript (`tsc`) e `ts-node-dev`.
- **Definições de Tipos e Interfaces**:
  - Criação do diretório `src/types/` com interfaces para DTOs, argumentos GraphQL, contexto GraphQL (`GraphQLContext`), payload JWT e loaders DataLoader.
  - Tipagem forte de todos os 29 modelos Sequelize (`Candidate`, `Job`, `Company`, `Resume`, `User`, `JAASUser`, etc.).
- **Conversão dos Arquivos de Código**:
  - Conversão de 100% dos arquivos `.js` em `src/` para `.ts` (`index.ts`, `resolvers.ts`, `schemas.ts`, `dataloader.ts`, `RequestedFields.ts`).
  - Conversão dos módulos de domínio (`src/modules/*`) e middlewares (`src/middleware/*`) para TypeScript.

## Capabilities

### New Capabilities
- `typescript-migration`: Capacidade de compilação, verificação de tipos estáticos em tempo de build e tipagem completa de modelos, resolvers GraphQL e serviços.

### Modified Capabilities

## Impact

- **Build & Execution**: Substituição do Babel por `tsc` e `ts-node-dev`.
- **Arquivos Afetados**: Todos os arquivos em `src/` (`.js` -> `.ts`) e `package.json`.
- **Compatibilidade**: Nenhuma alteração funcional nos schemas GraphQL existentes ou nas respostas da API; a migração é exclusivamente de infraestrutura e qualidade de código.
