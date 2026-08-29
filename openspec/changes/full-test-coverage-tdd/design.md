## Context

Atualmente, o projeto `graphql` possui uma suíte limitada de testes baseada em solicitações HTTP (`node-fetch` / `graphql-request`) que dependem de um servidor em execução ativa na porta 4000 e de um banco de dados relacional populado. Para elevar a qualidade e garantir 100% de cobertura de código independente de serviços externos, a infraestrutura de testes será configurada com `ts-jest` e mocks isolados para Sequelize, Redis, RabbitMQ e DataLoader.

## Goals / Non-Goals

**Goals:**
- Configurar o Jest com `ts-jest` no `jest.config.js` para suportar arquivos `.spec.ts` e `.test.ts`.
- Configurar o `coverageThreshold` em 100% em `jest.config.js` para `statements`, `branches`, `functions` e `lines`.
- Criar suítes de testes unitários isoladas para:
  - Utilitários (`Paginator`, `PaginatedList`, `queryHelper`, `RequestedFields`, `cpfValidator`, `Base64EncoderDecoder`, `BcryptEncoderDecoder`);
  - Modelos Sequelize e DTOs;
  - Repositórios e Serviços dos 16 módulos (`users`, `candidates`, `jobs`, `companies`, `resumes`, `selective_processes`, `blogs`, `authors`, `members`, `forms`, `jaas`, `stats`, `subscribers`, `testimonials`, `auth`, `others`);
  - Resolvers GraphQL e Middlewares (`extractJWTMiddleware`, `authResolver`, `verifyTokenResolver`).
- Institucionalizar a regra do TDD (Test-Driven Development) no fluxo de trabalho.

**Non-Goals:**
- Substituir o framework de testes Jest por outro concorrente (ex: Vitest ou Mocha).

## Decisions

### 1. Preset e Transformer do Jest
- **Decisão**: Utilizar `ts-jest` com `preset: 'ts-jest'` em `jest.config.js`.
- **Justificativa**: O `ts-jest` compila e executa os testes diretamente da base de código em TypeScript, fornecendo mapas de código precisos (*sourcemaps*) para relatórios de cobertura.

### 2. Estratégia de Isolamento e Mocks de Banco de Dados e Serviços
- **Decisão**: Os testes unitários utilizarão mocks para o Sequelize (`db.User.findAll`, `db.Job.findOne`, etc.), `ioredis` e `amqplib` (RabbitMQ).
- **Justificativa**: Permite que a suíte inteira seja executada em milissegundos sem necessidade de bancos de dados MySQL/PostgreSQL rodando em container ou servidor ativo.

### 3. Handlers e Middlewares Composáveis
- **Decisão**: Testar os middlewares isoladamente passando objetos genéricos mockados de `req`, `res` e `next`.

## Risks / Trade-offs

- **Manutenção de Mocks com Alterações de Schemas**:
  - *Risco*: Mocks ficarem desalinhados das assinaturas reais dos modelos.
  - *Mitigação*: Utilizar os tipos TypeScript compartilhados (`src/types/models.ts`) na construção de mocks dos objetos de teste.
