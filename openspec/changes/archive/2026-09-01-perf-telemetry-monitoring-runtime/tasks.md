## 1. Implementação de Métricas de Runtime

- [x] 1.1 Criar utilitário `src/utils/metrics.ts` para coleta de métricas de memória, CPU e Event Loop Lag
- [x] 1.2 Integrar rota de telemetria `/health/metrics` em `src/index.ts`

## 2. Ferramentas de Profiling e Testes

- [x] 2.1 Adicionar scripts de diagnóstico e profiling no `package.json` (`profile:gc`, `profile:inspect`)
- [x] 2.2 Criar testes unitários para o módulo de métricas em `tests/unit/metrics.spec.ts`
- [x] 2.3 Validar execução com `npm test`
