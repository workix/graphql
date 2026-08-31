# Design Document: Mídia Segura & Processos Seletivos (`media-selective-processes-final-core`)

## Architectural Strategy

1. **Frontend Cliente (`frontend/client`)**:
   - `src/services/media.service.ts`:
     - `requestUploadUrl(fileName, fileType, context, userId)`
     - `confirmUpload(id)`
     - `uploadFile(file, context, userId)`: Função orquestradora que requisita a URL assinada, executa o PUT do binário do arquivo via Axios / fetch, e chama `confirmUpload` retornando o asset de mídia final.

2. **Frontend Admin (`frontend/admin`)**:
   - `src/services/selectiveProcessesAdmin.service.ts`:
     - `getSelectiveProcessesPaginated(page, limit)`
     - `deleteSelectiveProcess(id)`
   - `src/views/AdminSelectiveProcessesView.vue` (`/selective-processes`): Tabela com `v-data-table` listando processos, prazos de expiração, limites de candidatos e ações de exclusão.
   - Atualização do menu em `AdminLayout.vue` e rotas em `router/index.ts`.

3. **Android App (`android/`)**:
   - `src/main/java/br/com/codecode/workix/android/network/SelectiveProcessesApiService.kt`:
     - Data models: `SelectiveProcessDto`, `JobSummaryDto`, `CandidateSummaryDto`.
     - Suspend fun `mySelectiveProcessesSubscribed()` e `subscribeInSelectiveProcess()`.
   - `src/main/java/br/com/codecode/workix/android/ui/applications/MyApplicationsFragment.kt`:
     - Renderização nativa de cards com título da vaga, prazo de expiração, total de inscritos e badge de status.
