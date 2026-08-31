# Proposal: Implementação de Auditoria de Mídia no Admin e Validação de CPF via GraphQL (`media-admin-and-cpf-validation-core`)

## Summary
Implementar o painel administrativo de auditoria de mídias e arquivos (`AdminMediaView.vue`), além da integração do serviço GraphQL de validação de CPF (`others`) no Frontend Cliente e Android.

## Motivation & Background
- O painel administrativo necessita de uma visão de governança sobre ativos de mídia (`getMediaById`) para verificar status de upload, tipos MIME e integridade de fotos/banners.
- A validação de CPF através do módulo `others` (`validateCPF(cpf: String!)`) garante a conformidade cadastral unificada com as regras de negócio do backend GraphQL.

## Impacted Areas
- **Frontend Admin (`frontend/admin`)**:
  - `src/services/mediaAdmin.service.ts`: Abstração para consulta de ativos de mídia.
  - `src/views/AdminMediaView.vue` (`/media`): Painel de auditoria de arquivos e mídias.
  - Atualização do menu em `AdminLayout.vue` e rotas em `router/index.ts`.
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/others.service.ts`: Validação de CPF via GraphQL query `validateCPF`.
- **Android App (`android/`)**:
  - `src/main/java/br/com/codecode/workix/android/network/OthersApiService.kt`: Validador de CPF em Kotlin consumindo o endpoint GraphQL.
