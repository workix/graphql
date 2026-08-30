## 1. Implementação do Script de Povoamento de Dados

- [x] 1.1 Criar `src/seeders/populate_all_dummy_data.ts` utilizando os modelos Sequelize (`User`, `Company`, `Job`, `Resume`, `Blog`, `Comment`).
- [x] 1.2 Adicionar o comando `"seed:sqlite": "ts-node src/seeders/populate_all_dummy_data.ts"` no `package.json`.

## 2. Execução e Validação dos Dados Fictícios

- [x] 2.1 Executar `npm run seed:sqlite` para popular o banco de dados SQLite (`./database.sqlite`).
- [x] 2.2 Verificar a presença dos registros fictícios de usuários, empresas, vagas, currículos e posts de blog.
