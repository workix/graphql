## Purpose

Fornece rastreabilidade de ponta a ponta através de Trace IDs únicos por requisição, emissão de logs estruturados em formato JSON e sondas de saúde aprofundadas (health, live, ready) para observabilidade contínua.

## ADDED Requirements

### Requirement: Propagação de Trace ID / Correlation ID
O sistema SHALL extrair o identificador de rastreamento do cabeçalho `x-trace-id` ou `x-correlation-id`, ou gerar um novo UUID caso ausente, propagando-o no contexto da requisição, nos logs emitidos e no cabeçalho de resposta HTTP `x-trace-id`.

#### Scenario: Requisição com Trace ID fornecido pelo cliente
- **WHEN** uma requisição HTTP chega com o cabeçalho `x-trace-id: req-abc-123`
- **THEN** o sistema reutiliza o identificador `req-abc-123` no contexto e o devolve no cabeçalho de resposta `x-trace-id`

#### Scenario: Requisição sem Trace ID
- **WHEN** uma requisição chega sem cabeçalho de rastreamento
- **THEN** o sistema gera automaticamente um novo identificador único de trace e o anexa ao ciclo de vida da requisição

### Requirement: Emissão de Logs Estruturados em JSON
O sistema SHALL registrar logs operacionais e de eventos em formato JSON estruturado contendo nível (`level`), timestamp em formato ISO-8601, identificador de trace (`traceId`), identificador de tenant (`tenant`), usuário (`userId`), operação (`operation`), tempo de execução (`durationMs`) e detalhes de erro quando aplicável.

#### Scenario: Registro de Log de Operação Concluída com Sucesso
- **WHEN** uma operação de consulta ou mutação é executada com sucesso
- **THEN** o sistema emite um log estruturado contendo a duração em milissegundos, tenant, operação e status

### Requirement: Sondas de Liveness e Readiness para Health Check
O sistema SHALL disponibilizar endpoints `/health/live` e `/health/ready` reportando o estado operacional da aplicação e a conectividade com serviços críticos (Banco de Dados relacional, RabbitMQ e Elasticsearch).

#### Scenario: Verificação de Prontidão (Readiness Probe)
- **WHEN** o orquestrador consulta `GET /health/ready` com o banco de dados saudável
- **THEN** o sistema responde status HTTP 200 com JSON contendo o status detalhado e latência de cada dependência
