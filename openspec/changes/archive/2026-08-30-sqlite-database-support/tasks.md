## 1. Dependências e Configuração de Conexão

- [x] 1.1 Adicionar a biblioteca `sqlite3` no `package.json`.
- [x] 1.2 Atualizar `.env.default` com as variáveis de ambiente de banco de dados (`DB_DIALECT=sqlite`, `DB_STORAGE=./database.sqlite`).
- [x] 1.3 Atualizar `src/config/config.json` suportando resolução dinâmica de dialeto (`sqlite`, `postgres`, `mysql`).

## 2. Refatoração da Inicialização do Sequelize

- [x] 2.1 Atualizar `src/models/index.ts` para ler as variáveis de ambiente e instanciar o `Sequelize` dinamicamente com suporte a SQLite, PostgreSQL e MySQL.
- [x] 2.2 Validar a inicialização local da aplicação e criação automática do arquivo `./database.sqlite`.
