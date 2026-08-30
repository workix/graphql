## ADDED Requirements

### Requirement: Inicialização Dinâmica do Banco de Dados pelo Sequelize
O sistema SHALL permitir a escolha do dialeto do banco de dados (`sqlite`, `postgres`, `mysql`) e arquivo/credenciais de conexão via variáveis de ambiente, utilizando o `sqlite3` como banco de dados padrão para desenvolvimento local.

#### Scenario: Execução em Ambiente de Desenvolvimento com SQLite
- **WHEN** a aplicação é iniciada sem variáveis explicitando PostgreSQL/MySQL
- **THEN** o Sequelize conecta utilizando o dialeto `sqlite` e cria/utiliza o arquivo `./database.sqlite`.

#### Scenario: Alternância Dinâmica para PostgreSQL ou MySQL
- **WHEN** a variável de ambiente `DB_DIALECT` é definida como `postgres` ou `mysql` com as respectivas credenciais (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`)
- **THEN** o Sequelize conecta automaticamente ao banco relacional especificado sem necessidade de alterações no código-fonte.
