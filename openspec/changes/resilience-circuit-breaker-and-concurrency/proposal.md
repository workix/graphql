## Why

Para cumprir com excelência os critérios 32, 33, 34 e 56 do guia de software profissional (Resiliência, Circuit Breaker, Retries com Exponential Backoff e Controle de Concorrência), o backend da Workix precisa de mecanismos formais para absorver falhas transitórias de infraestrutura, isolar dependências lentas ou inativas e prevenir conflitos de concorrência simultânea em registros críticos.

## What Changes

- **Padrão Circuit Breaker (`CircuitBreaker`)**: Mecanismo de três estados (CLOSED, OPEN, HALF_OPEN) com rastreamento de taxa de erro, janela de tempo para reset e execução de fallbacks seguros para chamadas ao Elasticsearch, RabbitMQ e Gateways de Pagamento.
- **Retentativas com Exponential Backoff e Jitter (`retryWithBackoff`)**: Função assíncrona resiliente que reexecuta operações transitórias com crescimento exponencial do intervalo e jitter aleatório para evitar picos de sobrecarga (*thundering herd*).
- **Controle de Concorrência & Optimistic Locking (`ConcurrencyLockService`)**: Utilitário para validação de versão e detecção de atualizações simultâneas conflitantes.

## Capabilities

### New Capabilities
- `resilience-circuit-breaker-core`: Proteção de integrações externas e operações I/O com Circuit Breaker e estratégias de fallback e retentativas exponenciais.
- `concurrency-control-core`: Prevenção de concorrência destrutiva e detecção de conflitos de versão em registros compartilhados.

## Impact

- **Estabilidade do Sistema**: Impedimento de travamentos ou consumo excessivo de recursos causados por serviços externos fora do ar.
- **Integridade dos Dados**: Garantia de que modificações simultâneas não corrompam ou sobrescrevam dados inadvertidamente.
