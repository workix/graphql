## ADDED Requirements

### Requirement: Gerenciamento Persistente de Sessão JWT
O sistema SHALL fornecer a classe `SessionManager` para armazenar, recuperar e limpar o JWT Token e os dados de perfil do usuário (`id`, `email`, `role`, `name`) de forma persistente nas SharedPreferences do Android.

#### Scenario: Armazenamento Pós-Login
- **WHEN** a autenticação é bem-sucedida
- **THEN** o JWT token e as informações do usuário são salvos no `SessionManager` e o `ApiClient` passa a enviar o token nas requisições subsequentes.

### Requirement: ViewModel de Autenticação com Coroutines
O sistema SHALL implementar o `AuthViewModel` para gerenciar o estado da UI durante a autenticação (login, registro e logout) e realizar as chamadas assíncronas ao `AuthApiService` via Kotlin Coroutines.

#### Scenario: Execução de Login Nativo
- **WHEN** o usuário submete o formulário em `LoginActivity`
- **THEN** o `AuthViewModel` invoca o `AuthApiService.login()`, atualiza o `SessionManager` em caso de sucesso e notifica a UI sobre o estado da operação.

### Requirement: Container de Navegação Principal com BottomNavigationView
O sistema SHALL disponibilizar a `MainActivity` com um menu de navegação inferior (`BottomNavigationView`) que alterne dinamicamente entre os fragmentos principais: `HomeFragment`, `JobsListFragment`, `CandidatesListFragment` e `BlogListFragment`.

#### Scenario: Alternância entre Seções da Aplicação
- **WHEN** o usuário clica em um item da barra de navegação inferior
- **THEN** a `MainActivity` substitui o fragmento visível pelo fragmento correspondente sem recarregar a Activity.
