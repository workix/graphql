## Why

O arquivo `src/utils/BcryptEncoderDecoder.ts` utiliza métodos síncronos da biblioteca `bcrypt` (`bcrypt.genSaltSync`, `bcrypt.hashSync`, `bcrypt.compareSync`). Operações de hashing síncronas bloqueiam completamente o Event Loop do Node.js durante o cálculo criptográfico (50ms a 100ms+ por operação), impedindo o atendimento simultâneo de requisições HTTP e WebSockets. A migração para APIs assíncronas não-bloqueantes libera o Event Loop e delega o custo de CPU para o pool de threads do libuv.

## What Changes

- Refatoração de `encrypt` e `compare` em `src/utils/BcryptEncoderDecoder.ts` para funções assíncronas baseadas em Promises (`async/await`) utilizando `bcrypt.genSalt`, `bcrypt.hash` e `bcrypt.compare`.
- Implementação de cobertura de testes unitários com TDD para os novos métodos assíncronos.
- Garantia de que nenhuma rotina criptográfica execute de forma síncrona na thread principal da aplicação.

## Capabilities

### New Capabilities
- `performance-event-loop-cpu`: Operações criptográficas assíncronas e não-bloqueantes do Event Loop para autenticação e gestão de senhas.

### Modified Capabilities

## Impact

- `src/utils/BcryptEncoderDecoder.ts`: Mudança de assinatura síncrona para assíncrona com retorno de `Promise<string>` e `Promise<boolean>`.
- Testes unitários do utilitário de criptografia.
- Redução direta no `event_loop_lag_seconds` durante fluxos de autenticação.
