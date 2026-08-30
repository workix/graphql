## ADDED Requirements

### Requirement: Modernização das Configurações de Build Gradle
O sistema SHALL disponibilizar arquivos de build Gradle (`build.gradle` na raiz e `app/build.gradle`) com suporte aos plugins Kotlin, compilando com `compileSdk 34`, `targetSdk 34` e `minSdk 24`, utilizando os repositórios `google()` e `mavenCentral()`.

#### Scenario: Sincronização do Build Gradle
- **WHEN** o projeto Android é importado ou compilado
- **THEN** as dependências do AndroidX, Kotlin Coroutines, Retrofit2 e Lifecycle ViewModel são resolvidas sem falhas de repositório.

### Requirement: Cliente HTTP Retrofit com Autenticação JWT
O sistema SHALL fornecer um cliente HTTP configurado (`ApiClient` / `Retrofit`) que inclua interceptador de cabeçalhos para inclusão do JWT Token Bearer em todas as requisições autenticadas e suporte a parsing JSON via Gson.

#### Scenario: Requisição Autenticada na API REST
- **WHEN** uma requisição para endpoint protegido é enviada pelo app Android
- **THEN** o cabeçalho `Authorization: Bearer <token>` é anexado automaticamente.

### Requirement: Estrutura Base de Manipulação de Estado de Rede
O sistema SHALL fornecer uma classe de resultado genérica (`NetworkResult`) com os estados `Success`, `Error` e `Loading` para ser consumida pelas camadas de ViewModel e Repository.

#### Scenario: Processamento de Resposta da API
- **WHEN** a resposta HTTP de uma chamada REST é recebida
- **THEN** ela é encapsulada em `NetworkResult.Success` se o status for 2xx ou `NetworkResult.Error` em caso de erro HTTP/rede.
