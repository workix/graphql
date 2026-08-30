## Context

Com o inventário da Fase 1 finalizado, a Fase 2 estabelece a atualização dos scripts de compilação Gradle e a base da arquitetura nativa em Kotlin no módulo `android/`.

## Goals / Non-Goals

**Goals:**
- Atualizar o arquivo de compilação de nível superior `android/build.gradle`.
- Criar/configurar `android/app/build.gradle` com suporte completo a Kotlin, AndroidX, `compileSdk 34`, `targetSdk 34` e `minSdk 24`.
- Adicionar dependências essenciais: AndroidX Core, AppCompat, Material Components, Lifecycle ViewModel, Retrofit2, Gson, OkHttp Logging Interceptor e Kotlin Coroutines.
- Estruturar a camada de rede Kotlin (`ApiClient`, `AuthInterceptor`, `NetworkResult`) e interfaces das APIs (`AuthApiService`, `JobsApiService`, `ResumesApiService`, `BlogsApiService`).

**Non-Goals:**
- Não criar telas completas ou fluxos visuais complexos nesta fase (serão desenvolvidos nas Fases 3 e 4).

## Decisions

- **Decisão 1: Repositórios Google e Maven Central**:
  Substituir o repositório descontinuado `jcenter()` por `google()` e `mavenCentral()` para garantir resolução segura das bibliotecas AndroidX e Kotlin.

- **Decisão 2: Arquitetura HTTP com Retrofit2 e OkHttp Interceptor**:
  Utilizar Retrofit2 para chamadas REST fortemente tipadas com conversor JSON Gson, e anexar um `AuthInterceptor` customizado para injeção automática de tokens de autenticação JWT (`Authorization: Bearer <token>`).

- **Decisão 3: Abstração de Estado com `NetworkResult<T>`**:
  Implementar uma `sealed class` Kotlin (`Success`, `Error`, `Loading`) para simplificar o tratamento de respostas HTTP, erros de conexão e estados de progresso nas ViewModels.

## Risks / Trade-offs

- [Incompatibilidade entre versões de plugins Gradle e JDK] → Configurar opções de compilação Java 17 e Kotlin JVM 17 no `app/build.gradle`.
