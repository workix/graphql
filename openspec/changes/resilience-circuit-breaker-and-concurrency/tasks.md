## 1. Padrão Circuit Breaker & Resiliência

- [x] 1.1 Implementar `src/utils/circuit_breaker.ts` com estados CLOSED, OPEN, HALF_OPEN, contagem de falhas e fallback
- [x] 1.2 Implementar `src/utils/retry_backoff.ts` com cálculo de exponential backoff e jitter aleatório
- [x] 1.3 Criar testes unitários para Circuit Breaker e Retry Backoff em `tests/unit/circuit_breaker_and_retry.spec.ts`

## 2. Controle de Concorrência & Optimistic Locking

- [x] 2.1 Implementar `src/utils/concurrency_lock.service.ts` com validação de versão e detecção de conflitos
- [x] 2.2 Criar testes unitários para controle de concorrência em `tests/unit/concurrency_lock.spec.ts`

## 3. Validação & Bateria de Testes

- [x] 3.1 Executar suíte completa de testes (`npm test`) garantindo 100% de sucesso
