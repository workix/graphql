## Why

Com a Fase 2 (Infraestrutura de Build e Camada de Rede HTTP) concluída, a Fase 3 implementa os fluxos fundamentais de Autenticação, Gerenciamento de Sessão de Usuário e a Estrutura Principal de Navegação (BottomNavigation / Fragments) no aplicativo nativo Android em **Kotlin**.

## What Changes

- **Gerenciamento de Sessão (`data/SessionManager.kt`)**: Armazenamento seguro do token JWT Bearer e dados de perfil do usuário (`CANDIDATE` ou `COMPANY`) via `SharedPreferences`.
- **ViewModel de Autenticação (`viewmodel/AuthViewModel.kt`)**: ViewModel em Kotlin utilizando Coroutines e LiveData/StateFlow para consumir o `AuthApiService` e expor os estados de login, registro e logout.
- **Telas de Autenticação Nativa**:
  - `LoginActivity.kt`: Tela de login nativa com formulário de e-mail/senha, tratamento de erros e redirecionamento pós-login.
  - `RegisterActivity.kt`: Tela de cadastro nativa com escolha de perfil (Candidato vs Empresa).
- **Navegação Principal**:
  - `MainActivity.kt`: Activity principal contendo `BottomNavigationView` e contêiner para alternar entre os fragmentos das seções da aplicação.
  - Fragments das seções principais: `HomeFragment.kt`, `JobsListFragment.kt`, `CandidatesListFragment.kt` e `BlogListFragment.kt`.

## Capabilities

### New Capabilities
- `android-auth-navigation`: Gerenciamento de sessão de usuário, autenticação nativa (Login/Register) e container de navegação principal com BottomNavigationView e Fragments em Kotlin.

### Modified Capabilities

Nenhuma capacidade existente possui alteração de requisitos.

## Impact

- **Código Android**: Novos arquivos em `android/app/src/main/java/br/com/codecode/workix/android/` nas camadas `data`, `viewmodel` e `ui`.
- **Experiência do Usuário**: Transição da autenticação e navegação para telas nativas Android fluídas e integradas com o backend.
