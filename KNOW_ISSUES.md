# Known Issues

Registro de issues conhecidas do projeto `graphql`, com contexto suficiente para reprodução e correção futura.

## Formato de registro

Cada issue deve conter:

```
## [ID] Título curto do problema

- **Status**: Aberto / Em análise / Corrigido
- **Data**: AAAA-MM-DD
- **Módulo(s) afetado(s)**: src/modules/...
- **Contexto**: descrição do cenário em que o bug ocorre
- **Passos para reproduzir**:
  1. ...
  2. ...
- **Comportamento esperado**: ...
- **Comportamento atual**: ...
- **Causa raiz (se identificada)**: ...
- **Referências**: PRs, commits, arquivos relacionados
```

---

## [ISSUE-001] Cobertura global do Jest abaixo de 100% (débito pré-existente)

- **Status**: Aberto
- **Data**: 2026-08-29
- **Módulo(s) afetado(s)**: `src/modules/posts`, `src/modules/resumes`, `src/modules/selective_processes`, `src/modules/stats`, `src/modules/subscribers`, `src/modules/testimonials`, `src/modules/users`, `src/subscriptions/index.ts`, `src/utils/queryHelper.ts`
- **Contexto**: O `jest.config` define limiar global de 100% de cobertura (statements/branches/functions/lines). Ao rodar `npx jest` (suite completa) na Fase 3, o limiar global falha mesmo com todos os testes passando, pois módulos de fases anteriores (1 e 2) não atingem 100% de cobertura individualmente.
- **Passos para reproduzir**:
  1. `npx jest` na raiz do projeto
  2. Observar "Jest: global coverage threshold ... not met" ao final, apesar de "Test Suites: N passed".
- **Comportamento esperado**: Cobertura global de 100% conforme regra de TDD do projeto (`CLAUDE.md` e critérios de aceite da Fase 3).
- **Comportamento atual**: Cobertura global fica em ~89% statements / ~83% branches / ~91% lines / ~82% functions (medido logo após a conclusão da Fase 3 - grupos, eventos e analytics).
- **Causa raiz (se identificada)**: Débito de testes das Fases 1 e 2 (branches de erro/edge-case não exercitados nesses módulos). Confirmado via `git stash` que o déficit já existia antes de qualquer código da Fase 3 ser adicionado (medição anterior: ~88% statements / ~78% branches / ~89% lines / ~81% functions apenas com módulos até a Fase 2).
- **Referências**: `jest.config.js` (coverageThreshold), módulos citados acima; módulos da Fase 3 (`groups`, `events`, `analytics`) foram entregues com 100% de cobertura individual.
