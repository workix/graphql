## Why

Para iniciar a migração incremental do Frontend Cliente para a aplicação mobile Android/Kotlin (`android/`), é fundamental realizar a Fase 1: Análise técnica do projeto Android existente, mapeamento completo de rotas e funcionalidades do frontend cliente e criação do arquivo de controle de progresso `android/ANDROID_MIGRATION_PROGRESS.md`.

## What Changes

- **Análise do Projeto Android**: Mapeamento do estado atual da pasta `android/` (Gradle wrapper, `build.gradle`, SDKs, dependências de terceiros e arquivos Java/Kotlin).
- **Mapeamento de Rotas e Endpoints**: Levantamento de todas as telas do portal cliente (`LoginView`, `RegisterView`, `HomeView`, `JobsListView`, `JobDetailView`, `PostJobView`, `CandidatesListView`, `CandidateDetailView`, `PostResumeView`, `CompanyDetailView`, `BlogListView`, `BlogPostView`) e seus respectivos endpoints REST/GraphQL.
- **Criação do Documento de Controle**: Criação de `android/ANDROID_MIGRATION_PROGRESS.md` contendo a checklist funcional, decisões de arquitetura e inventário completo de telas a serem desenvolvidas nas fases subsequentes.

## Capabilities

### New Capabilities
- `android-analysis-mapping`: Análise arquitetural e mapeamento de rotas e telas do Frontend Cliente para a migração Android/Kotlin.

### Modified Capabilities

Nenhuma capacidade existente foi modificada.

## Impact

- **Código & Documentação**: Criação de `android/ANDROID_MIGRATION_PROGRESS.md` e inventário completo de telas.
- **Sistemas**: Define a base conceitual e o roadmap de execução para as fases de build, arquitetura e telas do aplicativo Android.
