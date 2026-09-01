## Purpose

Garante controle de fluxo e backpressure em mensageria assíncrona, além de sanitização e proteção de credenciais em serviços de cache.

## ADDED Requirements

### Requirement: Controle de Backpressure em Consumidores de Filas
O sistema SHALL permitir configurar o limite de mensagens pré-carregadas (`prefetch`) no canal RabbitMQ para evitar esgotamento de memória por backlog.

#### Scenario: Consumo de mensagens com prefetch ativo
- **WHEN** um consumidor for iniciado com limite de prefetch definido
- **THEN** o canal do RabbitMQ SHALL limitar a entrega simultânea ao número máximo de mensagens configurado até que ocorra a confirmação (`ack`).

### Requirement: Parametrização Segura de Credenciais de Cache
O cliente de cache Redis SHALL obter configurações de autenticação e rede exclusivamente a partir de variáveis de ambiente.

#### Scenario: Inicialização do cliente Redis sem senhas no código-fonte
- **WHEN** o módulo `redis_server` for carregado
- **THEN** as opções de conexão SHALL ler `REDIS_PASSWORD`, `REDIS_HOST` e `REDIS_PORT` de `process.env` sem valores sensíveis embutidos estaticamente.
