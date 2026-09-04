## Purpose

Padroniza a resposta de erros na API sem vazamento de detalhes técnicos ou stack traces e fornece proteção contra execuções duplicadas via cabeçalho de Idempotência em operações mutacionais críticas.

## ADDED Requirements

### Requirement: Tratamento e Formatação Padronizada de Erros
O sistema SHALL formatar todos os erros emitidos pelo Apollo Server GraphQL e Express no contrato `{ code, message, timestamp, traceId }`, omitindo stack traces e mensagens sensíveis de banco de dados em ambientes não-locais.

#### Scenario: Formatação de Erro com Trace ID
- **WHEN** ocorre uma exceção durante a execução de uma operação
- **THEN** a resposta JSON contém o código de erro, mensagem amigável, timestamp UTC e o `traceId` correspondente para rastreamento nos logs

### Requirement: Idempotência em Operações Mutacionais
O sistema SHALL suportar o cabeçalho `Idempotency-Key` em operações críticas, garantindo que o reenvio de uma mesma chave retorne o resultado da execução anterior sem duplicar cobranças, registros ou mutações de estado.

#### Scenario: Reenvio de Requisição com Mesma Chave de Idempotência
- **WHEN** uma requisição com `Idempotency-Key: key-xyz` é enviada novamente após ter sido processada com sucesso
- **THEN** o sistema retorna a resposta previamente armazenada sem reprocessar a operação no banco de dados
