## Purpose

Define os requisitos de dimensionamento de pool de conexões e políticas de contenção de consumo de memória em operações de banco de dados relacionais.

## ADDED Requirements

### Requirement: Configuração Explícita de Connection Pool
O sistema SHALL configurar limites máximos e mínimos de conexões ativas e ociosas no Sequelize para todos os ambientes de execução.

#### Scenario: Inicialização do pool em produção
- **WHEN** a aplicação inicializar a conexão com PostgreSQL em ambiente de produção
- **THEN** o Sequelize SHALL aplicar parâmetros de pool contendo `max`, `min`, `idle` e `acquire` definidos.

#### Scenario: Inicialização do pool em ambiente de desenvolvimento e teste
- **WHEN** a aplicação inicializar a conexão com SQLite
- **THEN** o pool SHALL manter limites compatíveis com operações de thread única sem bloqueios de arquivo (`idleTimeout` e `max`).

### Requirement: Paginação Segura em Consultas Relacionais
Todas as operações de listagem de coleções no ORM SHALL aplicar um limite máximo para impedir o carregamento irrestrito de registros no Heap do V8.

#### Scenario: Consulta de listagem sem limite explícito fornecido
- **WHEN** uma query GraphQL solicitar listagem de registros sem especificar `limit`
- **THEN** o repositório SHALL aplicar um `limit` padrão seguro de até 50 registros.
