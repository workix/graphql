## Context

Conforme a Fase 27 e a regra fundamental do guia ("Não altere o código antes de ter evidência"), a observabilidade de runtime é o pilar que fecha o ciclo de diagnóstico. Métricas objetivas como `process.memoryUsage()` e `v8.getHeapStatistics()` permitem constatar se a aplicação opera em platô estável ou se apresenta vazamentos cumulativos.

## Goals / Non-Goals

**Goals:**
- Implementar `src/utils/metrics.ts` para coletar métricas de processo sem impacto de latência.
- Expor endpoint leve `/health/metrics` no Express.
- Adicionar scripts de profiling em `package.json`.

**Non-Goals:**
- Não introduzir agentes pesados de APM externo que aumentem o overhead de CPU em desenvolvimento.
- Não expor dados confidenciais nos endpoints de telemetria.

## Decisions

- **Decisão 1: Utilização de APIs Nativas do Node.js (`v8`, `process`)**:
  - *Opção escolhida*: `process.memoryUsage()`, `v8.getHeapStatistics()` e medição de Event Loop via `performance.now()`.
  - *Alternativa descartada*: Depender de pacotes externos volumosos apenas para métricas básicas.
- **Decisão 2: Scripts NPM de Diagnóstico**:
  - *Opção escolhida*: `"profile:gc": "node --trace-gc dist/index.js"` e `"profile:inspect": "node --inspect dist/index.js"`.

## Risks / Trade-offs

- [Risco] Sobrecarga de coleta de métricas em alta frequência → [Mitigação] Usar chamadas diretas às APIs nativas de alta performance do V8.
