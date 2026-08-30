## 1. Modernização dos Scripts de Build Gradle

- [x] 1.1 Atualizar `android/build.gradle` (substituindo jcenter por google() e mavenCentral(), adicionando plugins Kotlin e Android Gradle Plugin).
- [x] 1.2 Criar `android/app/build.gradle` com a definição do aplicativo Android, suporte ao Kotlin, `compileSdk 34`, `targetSdk 34`, `minSdk 24`, Java 17 / JVM 17 e dependências (AndroidX Core, AppCompat, Material, Lifecycle ViewModel, Retrofit2, Gson, OkHttp Logging Interceptor e Coroutines).

## 2. Implementação da Camada de Rede e Autenticação HTTP (Kotlin)

- [x] 2.1 Criar a abstração `NetworkResult.kt` (`Success`, `Error`, `Loading`) para encapsular o estado das requisições.
- [x] 2.2 Criar `AuthInterceptor.kt` em Kotlin para anexar dinamicamente o cabeçalho `Authorization: Bearer <token>`.
- [x] 2.3 Criar `ApiClient.kt` configurando o Retrofit2, GsonConverterFactory, OkHttpClient e baseURL apontando para a API backend.
- [x] 2.4 Criar as interfaces Retrofit: `AuthApiService.kt`, `JobsApiService.kt`, `ResumesApiService.kt` e `BlogsApiService.kt`.

## 3. Atualização da Documentação de Acompanhamento

- [x] 3.1 Atualizar `android/ANDROID_MIGRATION_PROGRESS.md` registrando a conclusão da Fase 2 e detalhando os componentes da nova arquitetura base.
