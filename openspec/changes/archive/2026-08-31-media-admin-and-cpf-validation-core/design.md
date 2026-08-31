# Design Document: Auditoria de Mídia & Validação de CPF (`media-admin-and-cpf-validation-core`)

## Architectural Strategy

1. **Frontend Admin (`frontend/admin`)**:
   - `src/services/mediaAdmin.service.ts`: Consulta de mídias (`getMediaById`).
   - `src/views/AdminMediaView.vue` (`/media`): Tabela com `v-data-table` listando ativos, formatos, pré-visualização e links.
   - Atualização de `AdminLayout.vue` e `router/index.ts`.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/others.service.ts`: Query `validateCPF(cpf: String!)` retornando boolean.

3. **Android App (`android/`)**:
   - `src/main/java/br/com/codecode/workix/android/network/OthersApiService.kt`: Validação de CPF consumindo a query GraphQL `validateCPF`.
