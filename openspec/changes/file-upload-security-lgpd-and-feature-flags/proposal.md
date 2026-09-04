## Why

Para consolidar a conformidade da plataforma Workix com os critérios de segurança de arquivos, conformidade com a LGPD (Lei Geral de Proteção de Dados) e flexibilidade de release com Feature Flags (Critérios 38, 39, 40, 41, 44 e 45 do guia profissional), é necessário implementar validação de segurança de uploads por Magic Bytes, mecanismos de portabilidade e anonimização de dados pessoais e gestão dinâmica de Feature Flags por tenant.

## What Changes

- **Segurança de Uploads & Validação por Magic Bytes (Critérios 40, 41)**:
  - Validador binário de assinaturas de arquivos (`FileSecurityValidator`) que verifica MIME type real, cabeçalhos mágicos (Magic Bytes para PDF, PNG, JPEG, WEBP) e sanitiza nomes de arquivos contra Path Traversal.
- **Governança LGPD & Direito ao Esquecimento (Critérios 38, 39)**:
  - Operação de **Portabilidade de Dados** (`exportUserData(userId)`): exporta todo o dossiê do titular (perfil, candidaturas, histórico) em JSON portátil.
  - Operação de **Direito ao Esquecimento / Anonimização** (`anonymizeUserData(userId)`): remove dados de identificação pessoal (PII - nome, email, telefone, cpf, foto) preservando integridade referencial de transações e logs de auditoria.
  - Gestão de consentimento de termos de serviço e privacidade.
- **Feature Flags Dinâmicas por Tenant (Critérios 44, 45)**:
  - Sistema de avaliação de Feature Flags (`FeatureFlagService`) com suporte a flags globais e por tenant (ex: `ENABLE_SEARCH_AI`, `ENABLE_DIRECT_APPLY`, `ENABLE_PCD_BADGES`), ativáveis e desativáveis em tempo de execução.

## Capabilities

### New Capabilities
- `file-upload-security-core`: Validação rigorosa de arquivos por assinatura binária (magic bytes), sanitização de nomes e bloqueio de arquivos executáveis disfarçados.
- `lgpd-data-governance-and-flags`: Recursos de portabilidade, anonimização definitiva (direito ao esquecimento) e avaliação de Feature Flags dinâmicas por tenant.

## Impact

- **Segurança de Mídia**: Prevenção de ataques de upload malicioso e proteção da infraestrutura de storage.
- **Conformidade Legal**: Atendimento pleno aos artigos 18 e 19 da LGPD para titulares de dados.
- **Operação & Negócios**: Capacidade de liberar funcionalidades progressivamente sem necessidade de novo deploy de código.
