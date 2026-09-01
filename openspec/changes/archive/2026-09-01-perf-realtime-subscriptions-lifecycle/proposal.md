## Why

No arquivo `src/subscriptions/index.ts`, a inicialização do servidor de WebSockets (`ws` + `graphql-ws`) não implementa mecanismo de heartbeat (ping/pong) nem rotina de descarte para conexões inativas ou desconectadas de forma anômala (half-open TCP sockets). Isso leva ao acúmulo gradual de sockets zumbis no processo e de listeners pendentes no `PubSub`, caracterizando um vazamento de memória progressivo no heap e esgotamento de descritores de arquivos do sistema operacional.

## What Changes

- Implementação de verificação de vivacidade periódica (heartbeat / ping-pong) a cada 30 segundos no `WebSocketServer`.
- Encerramento forçado (`ws.terminate()`) de clientes que não respondem ao pong dentro do intervalo de tolerância.
- Limpeza explícita de listeners e desinscrições automáticas no encerramento da conexão.

## Capabilities

### New Capabilities
- `performance-realtime-subscriptions`: Gerenciamento do ciclo de vida de conexões WebSocket e contenção de vazamentos em subscrições GraphQL.

### Modified Capabilities

## Impact

- `src/subscriptions/index.ts`: Adição de listener de heartbeat e terminação de conexões inativas.
- Prevenção de acúmulo de instâncias `WebSocket` órfãs no Heap.
