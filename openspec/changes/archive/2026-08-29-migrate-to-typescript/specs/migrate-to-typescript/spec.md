## ADDED Requirements

### Requirement: Suporte nativo e compilação TypeScript
O projeto pai (`graphql`) SHALL ser compilado utilizando o compilador oficial do TypeScript (`tsc`), garantindo a checagem de tipos em todo o código-fonte localizado em `src/`.

#### Scenario: Compilação do projeto sem erros de tipagem
- **WHEN** o comando `npm run build` ou `npx tsc --noEmit` for executado
- **THEN** o compilador TypeScript deve analisar todos os arquivos `.ts` e gerar a build em JavaScript sem emitir erros de tipo ou sintaxe.

### Requirement: Cobertura Completa de Interfaces e Tipos Estáticos
Todos os módulos, modelos do Sequelize, resolvers GraphQL, DataLoader e Middlewares SHALL utilizar tipos estáticos explícitos, eliminando o uso indevido do tipo `any`.

#### Scenario: Validação de tipos em modelos e resolvers
- **WHEN** um desenvolvedor interagir com instâncias de modelos (ex: `Candidate`, `Job`, `User`) ou com os parâmetros de resolvers GraphQL
- **THEN** a IDE e o compilador devem oferecer autocomplete e checagem estática para os atributos e métodos correspondentes.
