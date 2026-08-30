## Why

Para facilitar o desenvolvimento local sem a necessidade de infraestrutura pesada (como contêineres ou servidores PostgreSQL/MySQL ativos), é necessário configurar o SQLite como o banco de dados padrão leve da aplicação, mantendo a arquitetura do Sequelize totalmente dinâmica e configurada para alternar transparentemente para PostgreSQL (`postgres`) ou MySQL (`mysql`) por variáveis de ambiente.

## What Changes

- **Instalação do Driver SQLite**: Adição da dependência `sqlite3` no `package.json`.
- **Suporte a Múltiplos Dialetos no Sequelize (`src/models/index.ts`)**: Atualização do arquivo de inicialização dos modelos para resolver dinamicamente o dialeto (`sqlite`, `postgres`, `mysql`), arquivo de banco local (`DB_STORAGE` / `./database.sqlite`) e credenciais via variáveis de ambiente (`DB_DIALECT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`).
- **Atualização das Configurações (`src/config/config.json` e `.env.default`)**:
  - Inclusão das variáveis padrão para SQLite (`DB_DIALECT=sqlite`, `DB_STORAGE=./database.sqlite`).
  - Documentação das configurações alternativas para alternar para `postgres` ou `mysql`.

## Capabilities

### New Capabilities
- `sqlite-database-support`: Suporte nativo ao banco de dados SQLite com alternância dinâmica para PostgreSQL e MySQL no backend Sequelize.

### Modified Capabilities

Nenhuma capacidade existente possui alteração de requisitos funcionais.

## Impact

- **Dependências**: Adição de `sqlite3` no `package.json`.
- **Configuração**: Alteração em `src/models/index.ts`, `src/config/config.json` e `.env.default`.
- **Banco de Dados**: Facilita a execução zero-config da aplicação localmente gerando o arquivo `./database.sqlite`.
