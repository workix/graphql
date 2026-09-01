## Why

Conforme as Fases 20, 25-B.10, 26 e 27 do guia técnico de diagnóstico de memória e CPU, qualquer otimização precisa ser acompanhada e validada por evidências objetivas e telemetria contínua. O projeto não disponibiliza utilitários de diagnóstico de métricas de runtime (Heap V8, RSS, Event Loop Delay, estatísticas de GC) nem scripts padronizados de profiling (`clinic`, `node --prof`), dificultando a detecção proativa de degradação e regressões de desempenho.

## What Changes

- Implementação de um módulo utilitário de métricas de runtime (`src/utils/metrics.ts`) expondo estatísticas de memória Heap V8, RSS nativo, memória externa e atraso do Event Loop.
- Criação de endpoint HTTP `/health/metrics` para consulta das métricas de processo e telemetria de integridade.
- Inclusão de scripts NPM em `package.json` para execução com logs de Garbage Collection (`--trace-gc`), profiling de CPU (`--prof`) e análise com ferramentas de diagnóstico.

## Capabilities

### New Capabilities
- `performance-telemetry-runtime`: Exposição de métricas de runtime (Heap, RSS, Event Loop Lag) e utilitários de profiling para o backend GraphQL.

### Modified Capabilities

## Impact

- `src/utils/metrics.ts`: Novo utilitário de coleta de métricas de processo.
- `src/index.ts`: Rota de verificação de métricas e saúde do processo.
- `package.json`: Scripts para inspeção de GC e profiling.
- Viabilização do monitoramento contínuo da saúde de memória e CPU.
