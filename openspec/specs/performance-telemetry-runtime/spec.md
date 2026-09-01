## Purpose

Disponibiliza telemetria de runtime, métricas de saúde de memória e ferramentas de profiling para observabilidade do ecossistema Node.js / TypeScript.

## Requirements

### Requirement: Coleta e Exposição de Métricas de Memória e CPU
O sistema SHALL disponibilizar um endpoint ou função de telemetria retornando o uso atual do Heap V8, RSS, memória externa e uptime do processo.

#### Scenario: Requisição ao endpoint de métricas de saúde
- **WHEN** uma requisição HTTP for enviada ao endpoint de telemetria `/health/metrics`
- **THEN** o sistema SHALL responder em formato JSON contendo `heapUsed`, `heapTotal`, `rss`, `external`, `eventLoopLagMs` e `uptimeSeconds`.

### Requirement: Ferramental de Profiling e Rastreamento de GC
O projeto SHALL disponibilizar scripts de desenvolvimento e diagnóstico para habilitar logs de Garbage Collection e perfis de CPU do V8.

#### Scenario: Execução em modo de rastreamento de GC
- **WHEN** o comando de diagnóstico de GC for acionado
- **THEN** o Node.js SHALL inicializar com flags V8 apropriadas para registro de pausas e coletas de memória.
