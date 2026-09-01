## Purpose

Garante que rotinas de processamento criptográfico intensivo executem de maneira assíncrona, desonerando a thread principal do Event Loop.

## Requirements

### Requirement: Hashing Assíncrono de Senhas
O sistema SHALL prover funções assíncronas para geração de hash de senhas delegadas às threads em segundo plano do Node.js.

#### Scenario: Criptografia de senha em fluxo não bloqueante
- **WHEN** uma senha for submetida para encriptação via `encrypt(password)`
- **THEN** a função SHALL retornar uma `Promise<string>` com o hash seguro em formato bcrypt sem bloquear o Event Loop.

### Requirement: Comparação Assíncrona de Senhas
O sistema SHALL validar senhas em texto puro contra hashes criptografados de forma assíncrona.

#### Scenario: Validação de senha correta
- **WHEN** uma senha em texto puro e seu hash válido forem passados para `compare(raw, hashed)`
- **THEN** a função SHALL resolver uma `Promise<boolean>` retornando `true`.

#### Scenario: Validação de senha incorreta
- **WHEN** uma senha divergente for validada contra um hash
- **THEN** a função SHALL resolver uma `Promise<boolean>` retornando `false`.
