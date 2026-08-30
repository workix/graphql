## Why

Após concluir o mapeamento e diagnóstico da Fase 1, é essencial executar a Fase 2 da migração Android: modernização da infraestrutura de build Gradle, atualização do suporte ao Kotlin, configuração das dependências modernas (AndroidX, Retrofit2/OkHttp, Kotlin Coroutines, ViewModel) e estruturação da arquitetura base da aplicação nativa.

## What Changes

- **Modernização do Gradle da Raiz (`android/build.gradle`)**: Substituição de repositórios descontinuados (`jcenter`) por `google()` e `mavenCentral()`, atualização do Android Gradle Plugin e inclusão do Kotlin Gradle Plugin.
- **Criação/Atualização do Build do Módulo App (`android/app/build.gradle`)**: Configuração do plugin `com.android.application` e `kotlin-android`, definição de `compileSdk 34`, `minSdk 24`, `targetSdk 34`, Java 17 / Kotlin JVM 17, e inclusão de dependências (AndroidX Core, AppCompat, Material, Lifecycle ViewModel, Retrofit2, Gson Converter, OkHttp Logging Interceptor, Coroutines).
- **Estruturação da Arquitetura Base**:
  - Criação da camada de rede (`network/ApiClient.kt`, `network/AuthInterceptor.kt`).
  - Criação das interfaces de serviço API (`AuthApiService.kt`, `JobsApiService.kt`, `ResumesApiService.kt`, `BlogsApiService.kt`).
  - Implementação de wrapper genérico de resposta HTTP (`network/NetworkResult.kt`).
  - Estruturação dos pacotes base da aplicação Kotlin (`data`, `network`, `model`, `viewmodel`, `ui`).

## Capabilities

### New Capabilities
- `android-build-architecture`: Infraestrutura de build Gradle modernizada e arquitetura base da aplicação Android/Kotlin (Retrofit, ViewModel, Coroutines e manipulação de estado de rede).

### Modified Capabilities

Nenhuma capacidade existente possui alteração de requisitos funcionais.

## Impact

- **Código Android**: Arquivos Gradle em `android/` e novos arquivos de código em `android/app/src/main/java/br/com/codecode/workix/android/`.
- **Arquitetura**: Estabelece a fundação técnica robusta necessária para a construção das telas e fluxos nas Fases 3, 4 e 5.
