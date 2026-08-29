## 1. Configuração do Ambiente e Tooling TypeScript

- [x] 1.1 Instalar dependências dev de TypeScript (`typescript`, `@types/node`, `@types/express`, `@types/graphql`, `@types/jsonwebtoken`, `@types/bcrypt`, `@types/lodash`, `@types/jest`, `ts-node-dev`)
- [x] 1.2 Criar e configurar `tsconfig.json` com regras estritas (`strict: true`, `target: es2022`, `moduleResolution: node`)
- [x] 1.3 Atualizar scripts do `package.json` para utilizar `tsc` e `ts-node-dev` em substituição ao Babel/Nodemon

## 2. Levantamento e Definição da Camada de Tipos (`src/types`)

- [x] 2.1 Criar interfaces e tipos para o Contexto GraphQL (`GraphQLContext`) e DataLoaders (`src/types/context.ts`)
- [x] 2.2 Criar interfaces de DTOs e entidades dos 29 modelos Sequelize (`src/types/models.ts`)
- [x] 2.3 Criar definições de tipos auxiliares para autenticação JWT e paginação (`src/types/auth.ts`, `src/types/common.ts`)

## 3. Conversão dos Modelos Sequelize para TypeScript

- [x] 3.1 Converter modelos de autores e blogs (`author.ts`, `blog.ts`, `blog_comments.ts`, etc.) em `src/models/`
- [x] 3.2 Converter modelos de candidatos, currículos e empregadores (`candidate.ts`, `resume.ts`, `company.ts`, `job.ts`, etc.) em `src/models/`
- [x] 3.3 Converter modelos de segurança JAAS, usuários, formulários e depoimentos (`user.ts`, `jaas_user.ts`, `form.ts`, etc.) em `src/models/`
- [x] 3.4 Migrar o arquivo agregador de modelos (`src/models/index.ts`)

## 4. Conversão dos Módulos, Resolvers e Middlewares

- [x] 4.1 Migrar `src/dataloader.js` -> `src/dataloader.ts` com tipagem dos DataLoaders
- [x] 4.2 Migrar `src/RequestedFields.js` -> `src/RequestedFields.ts`, middlewares e utils
- [x] 4.3 Migrar schemas e resolvers de todos os 16 módulos em `src/modules/` para `.ts`
- [x] 4.4 Migrar arquivos centrais `src/schemas.js`, `src/resolvers.js` e `src/index.js` -> `.ts`

## 5. Validação e Compilação

- [x] 5.1 Executar compilação com `npx tsc --noEmit` e corrigir quaisquer erros de tipo remanescentes
