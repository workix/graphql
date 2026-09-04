## Context

Atendendo aos critérios 38, 39, 40, 41, 44 e 45 do guia de software profissional, o sistema adiciona camadas de proteção binária para arquivos enviados, compliance com a LGPD e gestão de Feature Flags dinâmicas.

## Goals / Non-Goals

**Goals:**
- Implementar `FileSecurityValidator` com detecção de Magic Bytes (PDF `%PDF-`, PNG `89 50 4E 47`, JPEG `FF D8 FF`, WEBP `RIFF...WEBP`), validação de tamanho máximo e sanitização de nomes de arquivos.
- Implementar serviço `LgpdGovernanceService` com métodos `exportUserData(userId)` e `anonymizeUserData(userId)` para cumprimento da LGPD.
- Implementar serviço `FeatureFlagService` com suporte a flags globais e por tenant (ex: `isFeatureEnabled(flagKey, tenantSlug)`).
- Integrar operações GraphQL (queries `myLgpdDataExport`, `featureFlags` e mutations `requestAccountAnonymization`, `updateTenantFeatureFlag`).
- Cobertura completa de testes unitários e de integração com 100% de sucesso.

**Non-Goals:**
- Armazenamento físico de arquivos em buckets de terceiros nesta fase (foco no validador binário de segurança e abstração de storage existente).
- Exclusão física em cascata com perda de chaves primárias (adota-se a técnica padrão de anonimização irreversível com pseudonimização criptográfica).

## Decisions

1. **Validação de Magic Bytes sem bibliotecas externas pesadas**:
   - *Decisão*: Inspecionar os primeiros 4 a 12 bytes do Buffer (`Buffer.slice(0, 12)`) para verificar os cabeçalhos binários canônicos de PDF, PNG, JPEG e WEBP.
   - *Alternativas consideradas*: Dependência nativa `file-type` (rejeitado para evitar problemas de compilação C++/node-gyp em múltiplos ambientes).

2. **Anonimização com Preservação de Integridade Referencial**:
   - *Decisão*: Substituir `name` por `Usuário Anonimizado`, `email` por `anon_<id>@anonymized.workix.local`, mascarar CPF/telefone e desativar a conta (`activated = false`), mantendo integridade com logs de auditoria e candidaturas históricas.

3. **Feature Flags em Memória com Fallback para Variáveis de Ambiente**:
   - *Decisão*: O `FeatureFlagService` lê variáveis de ambiente com prefixo `FF_` e permite overrides dinâmicos em tempo de execução por tenant.
