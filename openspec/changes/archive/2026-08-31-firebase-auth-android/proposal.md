## Why

O aplicativo Android (`android/`) necessita de modernização do seu fluxo de autenticação para operar estritamente com **Firebase Authentication** em Kotlin. O usuário deve autenticar através do Firebase Auth SDK (via `FirebaseAuth` / Kotlin Coroutines), obtendo o Firebase UID e Firebase ID Token para sincronizar a sessão com o backend GraphQL e persistir o estado local no `SessionManager`, eliminando o envio de senhas para o backend.

## What Changes

- **Integração do Firebase Auth no Android ViewModel (`AuthViewModel.kt`)**:
  - Implementação de chamadas assíncronas com corrotinas utilizando `FirebaseAuth.getInstance().signInWithEmailAndPassword` e `createUserWithEmailAndPassword`.
  - Remoção de envio de campos de senha (`password_hash` / `password`) nas requisições ao backend.
- **Sincronização com o Backend GraphQL**:
  - Envio do Firebase UID e e-mail para a API GraphQL (`doLogin` / `createUser`) para recuperação da entidade `User` e perfis de `Candidate` / `Company`.
  - Armazenamento do token de sessão e dados do usuário no `SessionManager`.
- **Evolução das Telas de Autenticação (`LoginActivity.kt` e `RegisterActivity.kt`)**:
  - Adaptação dos fluxos de interface, exibição de estados de carregamento e tratamento de erros do Firebase (credenciais inválidas, e-mail já existente, conexão indisponível).
- **Interceptors e Header de Autorização (`AuthInterceptor.kt` e `GraphQLApiClient.kt`)**:
  - Injeção automática do Bearer token nas requisições HTTP e GraphQL do Android.
  - Implementação de fluxo de logout seguro limpando `FirebaseAuth` e `SessionManager`.

## Capabilities

### New Capabilities
- `firebase-auth-android`: Fluxo de autenticação, login, cadastro e gerenciamento de sessão com Firebase no aplicativo Android Kotlin.

### Modified Capabilities
- None

## Impact

- **Código Afetado**: `android/app/src/main/java/br/com/codecode/workix/android/viewmodel/AuthViewModel.kt`, `android/app/src/main/java/br/com/codecode/workix/android/ui/auth/LoginActivity.kt`, `android/app/src/main/java/br/com/codecode/workix/android/ui/auth/RegisterActivity.kt`, `android/app/src/main/java/br/com/codecode/workix/android/data/SessionManager.kt`, `android/app/src/main/java/br/com/codecode/workix/android/network/AuthInterceptor.kt`.
- **Dependências**: `com.google.firebase:firebase-auth-ktx` no `build.gradle`.
- **Segurança**: Senhas são processadas unicamente no SDK nativo do Firebase.
