## Context

Atualmente o módulo `src/utils/BcryptEncoderDecoder.ts` exporta `encrypt` e `compare` que usam `bcrypt.hashSync` e `bcrypt.compareSync`. Conforme demonstrado nas Fases 8 e 25-B.5 do diagnóstico, o algoritmo de hashing do bcrypt é propositalmente custoso em CPU (fator de custo 10 = 1024 iterações de Blowfish). Em ambiente síncrono, cada execução retém o processo inteiro por dezenas de milissegundos, gerando filas de microtasks e timeouts em requisições concorrentes.

## Goals / Non-Goals

**Goals:**
- Substituir chamadas síncronas de `bcrypt` por chamadas assíncronas nativas que utilizam o threadpool libuv (`UV_THREADPOOL_SIZE`).
- Manter o fator de custo em 10 (`saltRounds = 10`) garantindo segurança criptográfica e compatibilidade com hashes já armazenados.
- Cobrir os métodos com testes unitários TDD automatizados.

**Non-Goals:**
- Não alterar a biblioteca bcrypt por alternativas externas sem necessidade.
- Não alterar a assinatura de schemas GraphQL de autenticação.

## Decisions

- **Decisão 1: Utilização de APIs Assíncronas Nativas do `bcrypt`**:
  - *Opção escolhida*: `await bcrypt.hash(string, saltRounds)` e `await bcrypt.compare(raw, hashed)`.
  - *Alternativa descartada*: Manter `hashSync` envolto em `setImmediate` (não resolveria a ocupação da CPU na thread principal).
- **Decisão 2: TDD Rigoroso**:
  - *Opção escolhida*: Escrever testes em `tests/unit/BcryptEncoderDecoder.spec.ts` verificando resolução de Promise e integridade dos hashes gerados.

## Risks / Trade-offs

- [Risco] Clientes legados esperando retorno síncrono → [Mitigação] Atualizar todas as chamadas internas no backend com `await`.
