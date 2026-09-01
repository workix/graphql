## Context

Ver `proposal.md` para motivação e justificativa. O projeto `android/` contém um app Android Kotlin com Gradle.

## Goals / Non-Goals

**Goals:**
- Mapear todas as strings existentes de `android/app/src/main/res/values/strings.xml`.
- Criar os diretórios de recursos localizados:
  - `android/app/src/main/res/values-pt-rBR/strings.xml`
  - `android/app/src/main/res/values-en-rUS/strings.xml` (e `values-en/strings.xml`)
  - `android/app/src/main/res/values-es/strings.xml`
- Implementar `LocaleHelper.kt` para compatibilidade com Android API 21+ (`ContextWrapper`, `createConfigurationContext`).

**Non-Goals:**
- Não alterar layouts XML nem regras de negócio dos ViewModels/Activities, apenas mapear recursos de texto.

## Decisions

- **Decisão 1: Utilização do mecanismo nativo de qualifiers do Android**:
  - *Racional*: Melhor desempenho e aderência aos padrões da plataforma Android.

## Risks / Trade-offs

- [Strings faltantes em locales secundários] → O Android utiliza o diretório padrão `res/values/strings.xml` como fallback automático.
