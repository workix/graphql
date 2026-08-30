# Plano de Acompanhamento da Migração Android (Kotlin)

Este documento representa o registro oficial de acompanhamento e inventário técnico para a migração do **Frontend Cliente** (`frontend/client`) para o aplicativo mobile nativo em **Android/Kotlin** (`android/`).

---

## 1. Relatório de Análise da Infraestrutura Android Existente

### 1.1 Configuração Gradle e Estrutura do Projeto

* **Pasta Raiz**: `android/`
* **Package/Application ID**: `br.com.codecode.workix.android`
* **Gradle Wrapper**: Gradle 4.1 (`gradle/wrapper/gradle-wrapper.properties`)
* **Top-Level `build.gradle`**:
  * Buildscript Android Plugin: `com.android.tools.build:gradle:3.0.0`
  * Google Services Plugin: `com.google.gms:google-services:3.0.0`
  * Repositórios: `jcenter()`, `maven.google.com`, `mavenLocal()`, `mavenCentral()`
* **`settings.gradle`**: Módulo `:app` incluído.
* **Diagnóstico de Ajustes para Fase 2**:
  * O repositório `jcenter()` encontra-se descontinuado e deve ser substituído por `google()` e `mavenCentral()`.
  * O arquivo `android/app/build.gradle` necessita ser regerado/atualizado para suporte ao Kotlin moderno, AndroidX, SDK Target 34+, Kotlin Coroutines, Retrofit/Apollo GraphQL e Hilt.

### 1.2 Declarações no Manifest e Componentes Registrados

* **`AndroidManifest.xml`**:
  * Permissões: `INTERNET`, `ACCESS_NETWORK_STATE`
  * Classe de Aplicação: `br.com.codecode.workix.android.MyApplication`
  * Serviços FCM: `MyFirebaseMessagingService`, `MyFirebaseInstanceIDService`
  * Receiver de Conectividade: `ConnectivityReceiver`
  * Activities Legadas Catalogadas:
    * `LoginActivity` (Launcher Main)
    * `JobDetailActivity`
    * `ResetPasswordActivity`
    * `SignupActivity`
    * `OptionsActivity`
    * `CandidateActivity`
    * `MainActivity`
    * `NewMain`

---

## 2. Inventário de Telas e Mapeamento de Endpoints (Frontend Cliente -> Android)

A tabela abaixo relaciona as 12 telas do Frontend Cliente (`frontend/client/src/views/`), os equivalentes nativos em Android (Kotlin) e os endpoints de backend (REST/GraphQL) consumidos.

| View (Frontend Web) | Rota Web | Componente Android Nativo (Kotlin) | Endpoints Backend Consumidos | Funcionalidades / Ações |
| :--- | :--- | :--- | :--- | :--- |
| **`LoginView.vue`** | `/login` | `LoginActivity` / `LoginFragment` | `POST /login`, `POST /auth/login` | Autenticação por e-mail/senha, recebimento de JWT Token e perfil de usuário (`CANDIDATE` / `COMPANY`). |
| **`RegisterView.vue`** | `/register` | `RegisterActivity` / `SignupFragment` | `POST /users/register`, `POST /register` | Cadastro de novos usuários com seleção de tipo de conta (Candidato ou Empresa). |
| **`HomeView.vue`** | `/` | `MainActivity` / `HomeFragment` | `GET /jobs/paginated`, `GET /blogs/paginated` | Destaques de vagas, métricas da plataforma, banner de notícias e navegação rápida. |
| **`JobsListView.vue`** | `/jobs` | `JobsListFragment` | `GET /jobs/paginated` | Listagem paginada de vagas com filtros por palavras-chave (`q`), localização e tipo de contrato. |
| **`JobDetailView.vue`** | `/jobs/:id` | `JobDetailActivity` | `GET /jobs/:id`, `POST /jobs/subscribe` | Detalhes completos da oportunidade e candidatura à vaga (`subscribe`). |
| **`PostJobView.vue`** | `/post-job` | `PostJobActivity` | `POST /jobs` | Formulário para publicação de nova vaga de emprego por empresas autenticadas. |
| **`CandidatesListView.vue`** | `/candidates` | `CandidatesListFragment` | `GET /resumes/list_with_candidates_short_paginated` | Listagem paginada de currículos e perfis de candidatos para contratantes. |
| **`CandidateDetailView.vue`**| `/candidates/:id` | `CandidateDetailActivity` | `GET /resumes/:id` | Visualização detalhada do currículo, competências e histórico profissional do candidato. |
| **`PostResumeView.vue`** | `/post-resume` | `PostResumeActivity` | `POST /resumes` | Formulário de criação/edição do currículo do candidato autenticado. |
| **`CompanyDetailView.vue`** | `/companies/:id` | `CompanyDetailActivity` | `GET /companies/:id` | Perfil público da empresa, descrição institucional e vagas abertas. |
| **`BlogListView.vue`** | `/blog` | `BlogListFragment` | `GET /blogs/paginated` | Listagem das postagens e artigos do blog da comunidade. |
| **`BlogPostView.vue`** | `/blog/:id` | `BlogPostActivity` | `GET /blogs/:id`, `POST /comments/blog` | Leitura de postagem completa do blog e inserção de comentários. |

---

## 3. Matriz do Roadmap das 5 Fases de Migração

- [x] **Fase 1: Análise Técnica e Mapeamento de Rotas/Endpoints**
  - Mapeamento completo de telas cliente em Vue.js.
  - Análise dos scripts Gradle e AndroidManifest existentes.
  - Criação do documento oficial de acompanhamento `android/ANDROID_MIGRATION_PROGRESS.md`.

- [x] **Fase 2: Atualização do Build, Dependências e Arquitetura Base**
  - Atualização dos scripts Gradle (`android/build.gradle` e `android/app/build.gradle`) com suporte ao Kotlin 1.9.22, AndroidX, SDK Target 34 e Java 17.
  - Configuração do cliente HTTP Retrofit2 + OkHttp em Kotlin com `AuthInterceptor` (JWT Bearer Token).
  - Estruturação das interfaces de serviço (`AuthApiService`, `JobsApiService`, `ResumesApiService`, `BlogsApiService`) e encapsulamento de estado de rede via `NetworkResult`.

- [x] **Fase 3: Autenticação, Sessão e Navegação Principal**
  - Gerenciador de sessão `SessionManager` e ViewModel `AuthViewModel` em Kotlin com Coroutines.
  - Implementação das telas nativas `LoginActivity` e `RegisterActivity`.
  - Host de navegação principal `MainActivity` com `BottomNavigationView` e os 4 fragmentos base (`HomeFragment`, `JobsListFragment`, `CandidatesListFragment`, `BlogListFragment`).

- [ ] **Fase 4: Implementação Nativa das Telas e Fluxos de Negócio**
  - Módulos de Vagas (`JobsListFragment`, `JobDetailActivity`, `PostJobActivity`).
  - Módulos de Candidatos e Currículos (`CandidatesListFragment`, `CandidateDetailActivity`, `PostResumeActivity`).
  - Módulos Institucionais e Blog (`CompanyDetailActivity`, `BlogListFragment`, `BlogPostActivity`).

- [ ] **Fase 5: Testes Nativos, Notificações FCM e Build de Produção**
  - Testes unitários de ViewModels e Repositories.
  - Notificações Push via Firebase Cloud Messaging (FCM).
  - Geração e validação de APK e AAB assinados para produção.

---

## 4. Checklist de Progresso das Telas (12 Telas)

* [x] 01. `LoginView` -> `LoginActivity`
* [x] 02. `RegisterView` -> `RegisterActivity`
* [x] 03. `HomeView` -> `HomeFragment`
* [x] 04. `JobsListView` -> `JobsListFragment`
* [ ] 05. `JobDetailView` -> `JobDetailActivity`
* [ ] 06. `PostJobView` -> `PostJobActivity`
* [x] 07. `CandidatesListView` -> `CandidatesListFragment`
* [ ] 08. `CandidateDetailView` -> `CandidateDetailActivity`
* [ ] 09. `PostResumeView` -> `PostResumeActivity`
* [ ] 10. `CompanyDetailView` -> `CompanyDetailActivity`
* [x] 11. `BlogListView` -> `BlogListFragment`
* [ ] 12. `BlogPostView` -> `BlogPostActivity`
