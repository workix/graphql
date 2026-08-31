# Proposal: Implementação de Mídia Segura & Processos Seletivos Mobile (`media-selective-processes-final-core`)

## Summary
Implementar o serviço de upload seguro de mídias (`media`) no Frontend Cliente e a visualização nativa de processos seletivos e candidaturas (`selective_processes`) no aplicativo Android.

## Motivation & Background
Para atingir paridade total nos fluxos de usuário:
- O ecossistema Workix requer upload seguro de arquivos e anexos (fotos de perfil, banners de capa, anexos de posts sociais e currículos em PDF) através das mutations GraphQL `requestUploadUrl` e `confirmUpload`.
- O aplicativo Android necessita de uma aba dedicada em `MyApplicationsFragment.kt` e camada de rede `SelectiveProcessesApiService.kt` para que os candidatos monitorem o andamento e status de seus processos seletivos inscritos (`mySelectiveProcessesSubscribed`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/media.service.ts`: Abstração de upload seguro de arquivos com obtenção de URL assinada e confirmação de upload.
- **Frontend Admin (`frontend/admin`)**:
  - `src/services/selectiveProcessesAdmin.service.ts`: Abstração de processos seletivos para o painel administrativo.
  - `src/views/AdminSelectiveProcessesView.vue` (`/selective-processes`): Painel de moderação e auditoria de processos seletivos com Vuetify 3.
  - Atualização do menu em `AdminLayout.vue` e rotas em `router/index.ts`.
- **Android App (`android/`)**:
  - `src/main/java/br/com/codecode/workix/android/network/SelectiveProcessesApiService.kt`: Camada de rede em Kotlin para consulta de processos seletivos.
  - `src/main/java/br/com/codecode/workix/android/ui/applications/MyApplicationsFragment.kt`: Fragment nativo com lista de processos seletivos e status de candidatura.
