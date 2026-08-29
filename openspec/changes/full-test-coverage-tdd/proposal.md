# Proposta: Cobertura Total de Testes (100%) e Adoção Oficial do TDD

## Why

Para garantir a estabilidade, prevenção de regressões e máxima confiabilidade do backend maestro `graphql` após a migração para TypeScript, é necessário estabelecer 100% de cobertura de testes automatizados e institucionalizar a metodologia **TDD (Test-Driven Development)** como padrão obrigatório para toda nova funcionalidade ou manutenção no projeto.

## What Changes

- **Configuração e Tooling de Testes**:
  - Instalação e configuração do `ts-jest` para execução nativa de suítes em TypeScript (`.spec.ts` / `.test.ts`).
  - Configuração do `jest.config.js` ativando `collectCoverage: true` e definindo `coverageThreshold` em **100%** (linhas, funções, ramificações e instruções).
- **Metodologia TDD Obrigatoria**:
  - Atualização dos fluxos de desenvolvimento e especificações (`CLAUDE.md`, `SPECIFICATION.md`) para exigir o ciclo **Red-Green-Refactor** em qualquer nova task.
- **Suíte Completa de Testes**:
  - Testes unitários para utilitários (`Paginator`, `PaginatedList`, `queryHelper`, `RequestedFields`, `cpfValidator`, `Base64`, `Bcrypt`).
  - Testes unitários de repositórios e serviços para os 16 módulos de domínio (`users`, `candidates`, `jobs`, `companies`, `resumes`, `selective_processes`, `blogs`, `authors`, `members`, `forms`, `jaas`, `stats`, `subscribers`, `testimonials`, `auth`, `others`).
  - Testes de integração de resolvers GraphQL e middlewares de autenticação.

## Capabilities

### New Capabilities
- `full-test-coverage-tdd`: Capacidade de execução de testes automatizados unitários/integração com 100% de cobertura de código e aplicação estrita da metodologia TDD.

### Modified Capabilities

## Impact

- **Qualidade de Código**: Impedimento automático de compilação ou merge caso a cobertura de testes caia abaixo de 100%.
- **Infraestrutura de Testes**: Suporte a execução de testes offline sem depender de serviços externos ativos (mocks de banco Sequelize, Redis e RabbitMQ).
- **Projetos Afetados**: `c:\Packsys\NetBeansProjects\graphql`
