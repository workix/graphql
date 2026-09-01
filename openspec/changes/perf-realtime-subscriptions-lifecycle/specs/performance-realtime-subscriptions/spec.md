## Purpose

Define os requisitos de vivacidade, encerramento de sockets zumbis e gestão de ciclo de vida em conexões realtime de subscrições GraphQL.

## ADDED Requirements

### Requirement: Detecção e Encerramento de Conexões WebSocket Inativas
O servidor WebSocket SHALL manter uma rotina periódica de ping/pong para identificar e encerrar conexões inativas.

#### Scenario: Cliente ativo respondendo ao ping
- **WHEN** o servidor emitir um ping periódico para o cliente conectado
- **THEN** a conexão SHALL ser mantida como ativa mediante recebimento do respectivo pong.

#### Scenario: Cliente inativo ou desconectado sem aviso
- **WHEN** um cliente não responder ao ping dentro do ciclo configurado
- **THEN** o servidor SHALL terminar a conexão (`ws.terminate()`) e liberar os recursos alocados no heap.
