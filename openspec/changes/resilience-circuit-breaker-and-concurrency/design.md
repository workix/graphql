## Context

Atendendo aos critérios 32, 33, 34 e 56 do guia de software profissional, o sistema adiciona o padrão Circuit Breaker, Retries com Exponential Backoff e Jitter, e Optimistic Locking para concorrência.

## Goals / Non-Goals

**Goals:**
- Implementar classe genérica `CircuitBreaker` com parâmetros configuráveis (`failureThreshold`, `resetTimeoutMs`, `halfOpenSuccessThreshold`, `fallback`).
- Implementar utilitário `retryWithBackoff(fn, options)` com `maxRetries`, `baseDelayMs`, `maxDelayMs`, `factor`, `jitter`.
- Implementar utilitário `ConcurrencyLockService` para validação de versão otimista em entidades.
- Testes unitários cobrindo todos os estados do Circuit Breaker, retries exponenciais e detecção de conflitos de concorrência.

**Non-Goals:**
- Implementação de locks distribuídos no Redis nesta fase (foco no optimistic locking e resiliência no processo do Node).
