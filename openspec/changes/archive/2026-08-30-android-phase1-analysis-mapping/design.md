## Context

A Fase 1 estabelece o mapeamento técnico completo para a conversão do Frontend Cliente em um aplicativo Android nativo escrito em **Kotlin**, consumindo as APIs REST/GraphQL do backend existente.

## Goals / Non-Goals

**Goals:**
- Mapear 100% dos componentes e telas do frontend cliente em `frontend/client/src/views/`.
- Inspecionar a estrutura do projeto em `android/` (`build.gradle`, `gradle.properties`, `settings.gradle`, `app/build.gradle`, `AndroidManifest.xml`).
- Criar o documento `android/ANDROID_MIGRATION_PROGRESS.md` com inventário detalhado de rotas, telas, regras de negócio e checklist.

**Non-Goals:**
- Não implementar código de UI ou chamadas de API nesta fase (serão executadas nas fases 2 a 5).

## Decisions

- **Decisão 1: Manter 100% de Equivalência de Telas e Funcionalidades**:
  Todas as views existentes no cliente (`Login`, `Register`, `Home`, `JobsList`, `JobDetail`, `PostJob`, `CandidatesList`, `CandidateDetail`, `PostResume`, `CompanyDetail`, `BlogList`, `BlogPost`) terão telas equivalentes no aplicativo Android.

- **Decisão 2: Arquivo de Acompanhamento `ANDROID_MIGRATION_PROGRESS.md`**:
  Criar o arquivo `android/ANDROID_MIGRATION_PROGRESS.md` como a fonte oficial para acompanhar o progresso das 5 fases.

## Risks / Trade-offs

- [Incompatibilidade de versões no projeto Android original] → Mapear versões do Gradle, SDKs e plugins na Fase 1 para correção cirúrgica na Fase 2.
