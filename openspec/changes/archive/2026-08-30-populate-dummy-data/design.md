## Context

Para viabilizar testes instantâneos do aplicativo Android e do frontend web, é necessário garantir que o banco SQLite possua um conjunto completo e integro de dados relacionais.

## Goals / Non-Goals

**Goals:**
- Criar `src/seeders/populate_all_dummy_data.ts` que utilize os modelos Sequelize exportados em `src/models/index.ts`.
- Gerar senhas de teste hash com `bcrypt` (senha `123456`) para testes de login realistas.
- Adicionar `"seed:sqlite": "ts-node src/seeders/populate_all_dummy_data.ts"` no `package.json`.
- Executar a população de dados e verificar a integridade da base.

**Non-Goals:**
- Não apagar coleções ou alterar migrações existentes.

## Decisions

- **Decisão 1: Utilização de Modelos Sequelize (`db.User`, `db.Job`, `db.Company`, etc.)**:
  Construir os registros via métodos `sync({ force: false })` e `bulkCreate()` / `create()` do Sequelize para assegurar compatibilidade universal com SQLite, PostgreSQL e MySQL.

- **Decisão 2: Credenciais Padronizadas para Teste**:
  - Candidato: `candidato@workix.com` / `123456`
  - Empresa: `empresa@workix.com` / `123456`

## Risks / Trade-offs

- [Duplicação de Chaves] → Utilizar verificação `findOrCreate` ou contagem preventiva antes de inserir novos registros fictícios.
