## 1. Gerenciamento de Sessão e ViewModel de Autenticação

- [x] 1.1 Criar `data/SessionManager.kt` para persistência e recuperação do JWT Token e perfil de usuário.
- [x] 1.2 Integrar o `SessionManager` com o `ApiClient.setAuthTokenProvider` para injeção automática do Bearer token.
- [x] 1.3 Criar `viewmodel/AuthViewModel.kt` em Kotlin gerenciando os estados de login, registro e logout.

## 2. Telas de Autenticação (Kotlin)

- [x] 2.1 Criar `ui/auth/LoginActivity.kt` em Kotlin para login de usuários.
- [x] 2.2 Criar `ui/auth/RegisterActivity.kt` em Kotlin para registro de candidatos e empresas.

## 3. Navegação Principal e Fragmentos

- [x] 3.1 Criar `ui/main/MainActivity.kt` com suporte a `BottomNavigationView` e alternância de fragmentos.
- [x] 3.2 Criar os fragmentos base: `ui/home/HomeFragment.kt`, `ui/jobs/JobsListFragment.kt`, `ui/candidates/CandidatesListFragment.kt` e `ui/blog/BlogListFragment.kt`.

## 4. Atualização de Registro de Progresso

- [x] 4.1 Atualizar `android/ANDROID_MIGRATION_PROGRESS.md` registrando a conclusão da Fase 3 e os componentes desenvolvidos.
