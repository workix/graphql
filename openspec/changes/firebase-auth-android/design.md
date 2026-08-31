## Context

O aplicativo Android foi reestruturado para Kotlin moderno com arquitetura MVVM, Coroutines, LiveData e Retrofit / OkHttp para integração com a API GraphQL (`GraphQLApiClient.kt`).

Anteriormente, o `AuthViewModel.kt` enviava um objeto `LoginRequest` com campos de senha para o backend REST legado. Este design estabelece o uso direto do **Firebase Authentication Kotlin SDK** (`FirebaseAuth`) no `AuthViewModel`, obtendo o Firebase UID e Firebase ID Token para sincronizar a sessão com o backend GraphQL e salvá-la no `SessionManager`.

## Goals / Non-Goals

**Goals:**
- Utilizar `FirebaseAuth` para autenticar o usuário via email/senha de forma assíncrona com Coroutines no `AuthViewModel`.
- Invocar a API GraphQL com o Firebase UID obtido do Firebase para recuperar os dados completos do usuário (`User` / `Candidate`) e o token de sessão.
- Salvar a sessão no `SessionManager` e propagar o Bearer token via `AuthInterceptor`.
- Implementar logout completo (`FirebaseAuth.signOut()` + `SessionManager.logout()`).

**Non-Goals:**
- Enviar senhas para o backend próprio.
- Modificar componentes de UI de outras features não relacionadas à autenticação.

## Decisions

1. **Autenticação Direta no Firebase SDK no Android**:
   - *Decisão*: O `AuthViewModel` executa `FirebaseAuth.getInstance().signInWithEmailAndPassword(email, password)` usando Kotlin Coroutines `await()`. Após sucesso, utiliza o `user.uid` para chamar a mutation GraphQL `doLogin` ou `aboutMe`.
   - *Alternativa considerada*: Delegar autenticação para um Webview intermediário. Rejeitada por piorar a experiência do usuário nativo.

2. **SessionManager como Fonte Única de Sessão Nativa**:
   - *Decisão*: O `SessionManager` guarda o token de sessão retornado pelo backend e os dados do usuário em `SharedPreferences` criptografadas/privadas.

## Risks / Trade-offs

- **[Risco] Falha do Google Play Services no dispositivo** → *Mitigação*: Tratar exceções específicas do Firebase (`FirebaseAuthInvalidCredentialsException`, `FirebaseNetworkException`) e exibir mensagens claras ao usuário.
