## Purpose

Fornece o padrão Circuit Breaker para isolar falhas de integrações externas, prevenir cascateamento de indisponibilidade e executar retentativas com cálculo exponencial e jitter.

## ADDED Requirements

### Requirement: Padrão Circuit Breaker com Três Estados
O sistema SHALL implementar um Circuit Breaker que opera nos estados CLOSED (normal), OPEN (bloqueando chamadas após atingir o limite de falhas consecutivas) e HALF_OPEN (testando recuperação após timeout).

#### Scenario: Transição para Estado Aberto (OPEN) após Falhas Consecutivas
- **WHEN** uma integração externa falha consecutivamente atingindo o limiar de falhas configurado (ex: 5 falhas)
- **THEN** o Circuit Breaker abre o circuito e passa a rejeitar chamadas imediatamente retornando o fallback sem sobrecarregar a rede

#### Scenario: Recuperação para Estado Fechado (CLOSED) no modo HALF-OPEN
- **WHEN** o tempo de reset expira no estado OPEN e uma requisição de teste é executada com sucesso
- **THEN** o Circuit Breaker fecha o circuito retornando à operação normal

### Requirement: Retries com Exponential Backoff e Jitter
O sistema SHALL permitir reexecutar operações assíncronas com cálculo de atraso exponencial (`baseDelay * 2^attempt`) acrescido de jitter pseudo-aleatório para evitar contenção de rede.

#### Scenario: Retentativa bem-sucedida após falha transitória
- **WHEN** uma chamada falha na primeira tentativa com erro de rede recuperável
- **THEN** o sistema aguarda o intervalo calculado com backoff e reexecuta a operação com sucesso
