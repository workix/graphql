# firebase-auth-android Specification

## Purpose
Define os requisitos e cenários de comportamento para autenticação de candidatos no aplicativo Android nativo utilizando o Firebase Authentication, abrangendo fluxo de login, cadastro, persistência de sessão no SessionManager e comunicação segura com o backend GraphQL.

## Requirements

### Requirement: Autenticação de Usuário com Firebase no Android
O aplicativo Android SHALL autenticar o usuário através do Firebase Auth SDK em Kotlin, enviando apenas o Firebase UID e metadados públicos para o backend GraphQL.

#### Scenario: Login com E-mail e Senha no Aplicativo
- **WHEN** o usuário informa credenciais válidas na `LoginActivity` e aciona o botão de login
- **THEN** o `AuthViewModel` autentica via `FirebaseAuth`, obtém o UID, consulta o backend GraphQL para associar o usuário e grava a sessão no `SessionManager`, redirecionando para a `MainActivity`.

#### Scenario: Falha de Login com Tratamento de Erros
- **WHEN** a autenticação no Firebase falha por credenciais incorretas ou problema de conectividade
- **THEN** o `AuthViewModel` emite estado `NetworkResult.Error` e a tela exibe mensagem amigável via Snackbar ou Toast.

### Requirement: Cadastro de Novo Usuário no Android
O aplicativo Android SHALL registrar a nova conta no Firebase Auth e, em seguida, invocar a mutation GraphQL de criação de usuário vinculada ao Firebase UID gerado.

#### Scenario: Cadastro de Candidato com Sucesso
- **WHEN** o usuário submete os dados de cadastro na `RegisterActivity`
- **THEN** o Firebase cria o usuário, o backend GraphQL registra a entidade `User` com `firebase_uuid` e a sessão é iniciada imediatamente.

### Requirement: Gerenciamento e Persistência de Sessão no Android
O `SessionManager` SHALL persistir o token de autenticação e os dados do usuário, garantindo que o `AuthInterceptor` anexe o token em todas as requisições HTTP e GraphQL.

#### Scenario: Abertura do App com Sessão Existente
- **WHEN** o usuário abre o aplicativo e possui sessão ativa salva no `SessionManager`
- **THEN** o aplicativo ignora a tela de login e navega diretamente para a tela principal `MainActivity`.

#### Scenario: Logout no Aplicativo
- **WHEN** o usuário clica na opção de sair no menu ou drawer do app
- **THEN** o aplicativo executa `FirebaseAuth.getInstance().signOut()`, limpa os dados do `SessionManager` e navega para `LoginActivity`.
