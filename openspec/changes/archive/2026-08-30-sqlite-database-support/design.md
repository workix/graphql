## Context

Atualmente a aplicação GraphQL utiliza a configuração do Sequelize direcionada por padrão ao PostgreSQL em `src/config/config.json`. Para simplificar a execução local sem dependências de infraestrutura, deve-se adotar o SQLite como padrão, mantendo suporte multi-dialeto no `src/models/index.ts`.

## Goals / Non-Goals

**Goals:**
- Instalar a biblioteca `sqlite3` nas dependências do projeto.
- Atualizar `src/models/index.ts` para instanciar o `Sequelize` com base nas variáveis de ambiente `DB_DIALECT`, `DB_STORAGE`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`.
- Atualizar `src/config/config.json` e `.env.default` com os valores padrão para SQLite (`sqlite` e `./database.sqlite`).

**Non-Goals:**
- Não alterar as definições nem as associações dos modelos existentes em `src/models/`.

## Decisions

- **Decisão 1: Fallback para SQLite em Desenvolvimento Local**:
  Se `DB_DIALECT` não for informado, a aplicação usará `sqlite` e armazenará o arquivo de banco em `./database.sqlite` (ou caminho definido em `DB_STORAGE`).

- **Decisão 2: Suporte a `DATABASE_URL` e Variáveis Individuais**:
  A classe de inicialização lerá `DATABASE_URL` (se disponível) ou comporá os parâmetros dinamicamente para Postgres/MySQL/SQLite.

## Risks / Trade-offs

- [Tipos de Dados Específicos por Dialeto em Migrações] → Manter definidores genéricos do Sequelize (`DataTypes.STRING`, `DataTypes.INTEGER`, `DataTypes.TEXT`, `DataTypes.DATE`) compatíveis entre SQLite, Postgres e MySQL.
