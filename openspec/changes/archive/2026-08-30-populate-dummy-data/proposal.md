## Why

Para permitir que a aplicação cliente Android e o frontend web executem testes de integração, login, navegação e manipulação de dados imediatamente sem requerer cadastro manual, é necessário popular o banco de dados SQLite com um conjunto completo e realista de dados fictícios (seeder).

## What Changes

- **Script de Inicialização e Povoamento Automático (`src/seeders/populate_all_dummy_data.ts`)**:
  - Criação de tabelas caso não existam via `sequelize.sync()`.
  - Povoamento de Usuários com perfis `CANDIDATE` e `COMPANY` (ex: `candidato@workix.com` e `empresa@workix.com`, senha `123456`).
  - Povoamento de Empresas parceiras (ex: `Tech Corp`, `Workix Solutions`, `Inovação Digital`).
  - Povoamento de Vagas de Emprego ativas com dados de localização, tipo de contrato (`CLT`, `PJ`, `Remoto`) e faixa salarial.
  - Povoamento de Currículos e Perfis de Candidatos com resumos, habilidades e experiência profissional.
  - Povoamento de Notícias e Artigos do Blog com autores e comentários.
- **Script NPM `npm run seed:sqlite`**:
  - Adição do comando `"seed:sqlite": "ts-node src/seeders/populate_all_dummy_data.ts"` no `package.json` para facilidade de execução rápida.

## Capabilities

### New Capabilities
- `populate-dummy-data`: Povoamento automático e resiliente de dados fictícios para testes integrados do app Android e frontend web.

### Modified Capabilities

Nenhuma capacidade existente possui alteração de requisitos.

## Impact

- **Banco de Dados**: Preenche o banco SQLite (`./database.sqlite`) com dados fictícios estruturados e válidos para testes.
- **Desenvolvimento & Testes**: Disponibiliza credenciais de teste para login instantâneo e amostragem de dados em todas as 12 telas.
