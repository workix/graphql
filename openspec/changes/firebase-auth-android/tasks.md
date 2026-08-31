## 1. Dependências e Configuração Firebase Android

- [ ] 1.1 Verificar e assegurar a inclusão de `firebase-auth-ktx` e plugin do Google Services no `android/app/build.gradle` e `android/build.gradle`

## 2. ViewModel e Camada de Rede

- [ ] 2.1 Atualizar `android/app/src/main/java/br/com/codecode/workix/android/viewmodel/AuthViewModel.kt` para realizar autenticação via `FirebaseAuth` assíncrono e sincronizar o Firebase UID com o backend GraphQL
- [ ] 2.2 Atualizar `android/app/src/main/java/br/com/codecode/workix/android/data/SessionManager.kt` e `AuthInterceptor.kt` para garantir persistência e propagação do token

## 3. Telas de Login e Cadastro

- [ ] 3.1 Atualizar `android/app/src/main/java/br/com/codecode/workix/android/ui/auth/LoginActivity.kt` para utilizar o novo fluxo de autenticação Firebase
- [ ] 3.2 Atualizar `android/app/src/main/java/br/com/codecode/workix/android/ui/auth/RegisterActivity.kt` para cadastro via Firebase Auth
- [ ] 3.3 Validar navegação de sessão ativa no início do app e fluxo de logout
