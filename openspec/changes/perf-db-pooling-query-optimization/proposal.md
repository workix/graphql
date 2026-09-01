## Why

O arquivo de configuração `src/config/config.json` e o inicializador `src/models/index.ts` não definem limites controlados de pool de conexões (`pool: { max, min, idle, acquire }`) para os dialetos de banco de dados (PostgreSQL em produção, SQLite em desenvolvimento/teste). Sob tráfego concorrente, isso pode esgotar descritores de sockets e conexões no banco, além de gerar picos de consumo de memória no Heap do Node.js decorrentes de retenção não gerenciada de conexões e instâncias de modelos do Sequelize.

## What Changes

- Definição explícita de parâmetros de pool de conexões (`max: 20`, `min: 2`, `idle: 10000`, `acquire: 30000`, `evict: 1000`) em `src/config/config.json` e `src/models/index.ts`.
- Padronização de limites de consulta (`limit`/`offset`) e projeções de atributos para mitigar sobrecarga de GC por hidratação de objetos Sequelize em endpoints de alto volume.

## Capabilities

### New Capabilities
- `performance-database-pooling`: Gestão otimizada de pool de conexões e contenção de alocação de memória no Sequelize ORM.

### Modified Capabilities

## Impact

- `src/config/config.json` e `src/models/index.ts`.
- Prevenção de timeouts de aquisição de conexão de banco (`TimeoutError: ResourceRequest timed out`).
- Estabilização da alocação de memória por consulta SQL.
