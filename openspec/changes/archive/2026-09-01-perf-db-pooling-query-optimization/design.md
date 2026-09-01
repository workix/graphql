## Context

Conforme apontado na Fase 11 do guia de diagnóstico, a ausência de configuração de pool de conexões no Sequelize delega o comportamento para padrões que podem ser inadequados sob alta concorrência. Na Fase 12, identificou-se que hydration completa de instâncias Sequelize sem projeção consome até 5x mais memória heap do que objetos JavaScript simples ou consultas com projeção restrita.

## Goals / Non-Goals

**Goals:**
- Configurar o pool de conexões com valores dimensionados para ambientes conteinerizados no `src/config/config.json`.
- Garantir que a inicialização do Sequelize em `src/models/index.ts` propague corretamente as opções de pool tanto para SQLite quanto para PostgreSQL/MySQL.
- Preservar compatibilidade total com os 32 suites de teste Jest existentes.

**Non-Goals:**
- Não migrar de ORM (manter Sequelize 5.x).
- Não alterar schemas de tabelas de banco de dados.

## Decisions

- **Decisão 1: Configuração do Pool por Ambiente**:
  - *Opção escolhida*:
    - Produção (Postgres): `max: 20`, `min: 2`, `idle: 10000`, `acquire: 30000`, `evict: 1000`.
    - SQLite: `max: 5`, `min: 1`, `idle: 10000`, `acquire: 20000`.
  - *Alternativa descartada*: Conexão sem pool explícito.
- **Decisão 2: Preservação de Defaults Seguros no `src/models/index.ts`**:
  - *Opção escolhida*: Mesclar opções de `config` com fallback programático para garantir resiliência mesmo se variáveis de ambiente sobrescreverem `DATABASE_URL`.

## Risks / Trade-offs

- [Risco] `acquireTimeoutMillis` muito baixo disparar erros em picos instantâneos → [Mitigação] Ajustar para 30.000ms (30s) garantindo tempo hábil sob fila.
