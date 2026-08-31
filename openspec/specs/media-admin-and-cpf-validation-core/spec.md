# media-admin-and-cpf-validation-core Specification

## Purpose
Especifica a governança de arquivos e mídias no painel administrativo e a validação remota de CPF através do serviço GraphQL `others`.

## Requirements

### Requirement: Auditoria de Ativos de Mídia no Admin
O sistema SHALL disponibilizar tela de auditoria de mídia no painel admin (`/media`) via query `getMediaById` para inspeção de arquivos e status.

#### Scenario: Visualização de mídias no Admin
- **WHEN** o administrador acessa `/media` no painel administrativo
- **THEN** a lista de arquivos com nome, tipo MIME, status e link de visualização é exibida.

### Requirement: Validação de CPF via GraphQL
O sistema SHALL fornecer validação de CPF via query `validateCPF(cpf: String!)` no Frontend Cliente e Android.

#### Scenario: Consulta de validação de CPF
- **WHEN** o sistema ou usuário submete um CPF para verificação
- **THEN** o backend retorna `true` ou `false` indicando se os dígitos verificadores são válidos.
