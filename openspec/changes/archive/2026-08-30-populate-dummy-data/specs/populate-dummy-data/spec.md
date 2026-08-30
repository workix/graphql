## ADDED Requirements

### Requirement: Povoamento Automático de Dados Fictícios para Testes
O sistema SHALL disponibilizar um script de povoamento (`src/seeders/populate_all_dummy_data.ts`) executável via `npm run seed:sqlite` que popule o banco de dados com registros válidos e integrados para usuários, empresas, vagas, currículos e postagens do blog.

#### Scenario: Povoamento de Dados com Sucesso
- **WHEN** o comando `npm run seed:sqlite` é executado
- **THEN** as tabelas do banco de dados SQLite são populadas com usuários de teste (`candidato@workix.com` / `empresa@workix.com`), vagas ativas, currículos e postagens de blog sem erros de chave estrangeira.
