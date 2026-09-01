## Context

Conforme descrito nas Fases 10 e 25-B.3 do guia de diagnóstico, conexões WebSockets não monitoradas por heartbeat permanecem ativas na tabela do sistema operacional e na árvore de dominadores do Heap V8 quando o cliente desconecta abruptamente (queda de rede móvel, fechamento forçado de aba sem envio de frame close TCP).

## Goals / Non-Goals

**Goals:**
- Adicionar rotina de heartbeat no `WebSocketServer` via `setInterval` seguro com flag `isAlive`.
- Garantir que a cada desconexão todos os event listeners e recursos sejam liberados.
- Manter compatibilidade com clientes GraphQL Subscription existentes (`graphql-ws`).

**Non-Goals:**
- Não substituir o transporte WebSocket nativo.
- Não alterar a lógica de autenticação JWT via subscrições.

## Decisions

- **Decisão 1: Heartbeat com Flag `isAlive`**:
  - *Opção escolhida*:
    - Na conexão: `ws.isAlive = true; ws.on('pong', () => ws.isAlive = true)`.
    - A cada 30 segundos: se `!ws.isAlive`, invocar `ws.terminate()`; caso contrário, marcar `ws.isAlive = false` e enviar `ws.ping()`.
  - *Alternativa descartada*: Depender exclusivamente de TCP Keep-Alive do SO (que pode demorar horas para detectar conexão perdida).
- **Decisão 2: Encerramento do Interval no Fechamento do Servidor**:
  - *Opção escolhida*: Adicionar hook no fechamento do servidor para limpar o intervalo de heartbeat (`clearInterval`), prevenindo handles abertos que impeçam o processo de encerrar.

## Risks / Trade-offs

- [Risco] Clientes com alta latência sofrerem desconexão se o intervalo for muito curto → [Mitigação] Definir intervalo padrão de 30 segundos com 1 ciclo de tolerância.
