## 1. Implementação do Heartbeat em WebSockets

- [ ] 1.1 Atualizar `src/subscriptions/index.ts` para registrar verificação de vivacidade com ping/pong no `WebSocketServer`
- [ ] 1.2 Implementar limpeza de intervalo (`clearInterval`) e descarte de referências no evento `close` do servidor

## 2. Testes de Ciclo de Vida Realtime

- [ ] 2.1 Criar testes unitários e de integração em `tests/unit/subscriptions_heartbeat.spec.ts` validando o mecanismo de heartbeat e terminação de sockets inativos
- [ ] 2.2 Validar integridade da suíte completa de testes Jest
