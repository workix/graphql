## 1. Configuração do Jest e Tooling de Cobertura

- [x] 1.1 Instalar e configurar `ts-jest` e ajustar `jest.config.js` com `coverageThreshold` em 100%
- [x] 1.2 Atualizar o script `test` em `package.json` para suportar relatórios de cobertura automatizados (`npm test -- --coverage`)

## 2. Testes Unitários de Utilitários e Factories

- [x] 2.1 Criar suíte de testes unitários TDD para `Paginator`, `PaginatedList` e `Pagination` em `tests/unit/utils/`
- [x] 2.2 Criar suíte de testes unitários TDD para `queryHelper`, `RequestedFields` e `cpfValidator` em `tests/unit/utils/`
- [x] 2.3 Criar suíte de testes unitários TDD para encodadores/decodadores (`Base64EncoderDecoder`, `BcryptEncoderDecoder`) em `tests/unit/utils/`

## 3. Testes Unitários de Repositórios e Serviços (16 Módulos)

- [x] 3.1 Criar suíte de testes unitários TDD para repositórios de `users`, `auth` e `jaas`
- [x] 3.2 Criar suíte de testes unitários TDD para repositórios de `candidates`, `resumes` e `jobs`
- [x] 3.3 Criar suíte de testes unitários TDD para repositórios de `companies`, `selective_processes` e `stats`
- [x] 3.4 Criar suíte de testes unitários TDD para repositórios de `blogs`, `authors`, `members`, `forms`, `subscribers`, `testimonials` e `others`

## 4. Testes de Resolvers GraphQL e Middlewares

- [x] 4.1 Criar suíte de testes unitários TDD para `resolvers.ts` central e middlewares composáveis (`composable.resolver.ts`, `auth-resolver.ts`, `verify-token-resolver.ts`)
- [x] 4.2 Criar suíte de testes TDD para DataLoaders e resolvers GraphQL dos módulos

## 5. Validação de Cobertura e Formalização do TDD

- [x] 5.1 Executar a suíte completa de testes e validar 100% de cobertura em Statements, Branches, Functions e Lines (`npm test -- --coverage`)
- [x] 5.2 Atualizar as diretrizes e documentação do projeto (`CLAUDE.md`, `SPECIFICATION.md`) formalizando o ciclo TDD obrigatório
