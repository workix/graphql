## 1. Configuração do Jest e Tooling de Cobertura

- [ ] 1.1 Instalar e configurar `ts-jest` e ajustar `jest.config.js` com `coverageThreshold` em 100%
- [ ] 1.2 Atualizar o script `test` em `package.json` para suportar relatórios de cobertura automatizados (`npm test -- --coverage`)

## 2. Testes Unitários de Utilitários e Factories

- [ ] 2.1 Criar suíte de testes unitários TDD para `Paginator`, `PaginatedList` e `Pagination` em `tests/unit/utils/`
- [ ] 2.2 Criar suíte de testes unitários TDD para `queryHelper`, `RequestedFields` e `cpfValidator` em `tests/unit/utils/`
- [ ] 2.3 Criar suíte de testes unitários TDD para encodadores/decodadores (`Base64EncoderDecoder`, `BcryptEncoderDecoder`) em `tests/unit/utils/`

## 3. Testes Unitários de Repositórios e Serviços (16 Módulos)

- [ ] 3.1 Criar suíte de testes unitários TDD para repositórios de `users`, `auth` e `jaas`
- [ ] 3.2 Criar suíte de testes unitários TDD para repositórios de `candidates`, `resumes` e `jobs`
- [ ] 3.3 Criar suíte de testes unitários TDD para repositórios de `companies`, `selective_processes` e `stats`
- [ ] 3.4 Criar suíte de testes unitários TDD para repositórios de `blogs`, `authors`, `members`, `forms`, `subscribers`, `testimonials` e `others`

## 4. Testes de Resolvers GraphQL e Middlewares

- [ ] 4.1 Criar suíte de testes TDD para middlewares de autenticação (`extractJWTMiddleware`, `authResolver`, `verifyTokenResolver`)
- [ ] 4.2 Criar suíte de testes TDD para DataLoaders e resolvers GraphQL dos módulos

## 5. Validação de Cobertura e Formalização do TDD

- [ ] 5.1 Executar a suíte completa de testes e validar 100% de cobertura em Statements, Branches, Functions e Lines (`npm test -- --coverage`)
- [ ] 5.2 Atualizar as diretrizes e documentação do projeto (`CLAUDE.md`, `SPECIFICATION.md`) formalizando o ciclo TDD obrigatório
