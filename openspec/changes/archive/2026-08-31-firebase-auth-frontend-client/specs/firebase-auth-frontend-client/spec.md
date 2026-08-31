## Purpose

Define os requisitos e cenários de comportamento para autenticação de candidatos e empresas no Frontend Cliente utilizando o Firebase Authentication, abrangendo login, cadastro, persistência de sessão reativa e sincronização com o backend GraphQL.

## ADDED Requirements

### Requirement: Autenticação de Usuário com Firebase no Frontend Cliente
O Frontend Cliente SHALL autenticar os usuários (Candidato / Empresa) utilizando o Firebase Auth SDK, sem enviar senhas ao backend próprio.

#### Scenario: Login com E-mail e Senha no Firebase
- **WHEN** o usuário informa e-mail e senha válidos na tela de login
- **THEN** o Firebase SDK autentica o usuário, obtém o Firebase UID e o frontend requisita os dados de perfil ao backend GraphQL, redirecionando o usuário para a área correspondente.

#### Scenario: Falha de Autenticação no Firebase
- **WHEN** o usuário submete credenciais inválidas no formulário de login
- **THEN** o Firebase retorna código de erro e o sistema exibe alerta explicativo em português na interface sem recarregar a página.

### Requirement: Cadastro de Novo Usuário com Firebase
O Frontend Cliente SHALL criar a conta de novos usuários diretamente no Firebase Auth e, em seguida, registrar a entidade `User` e perfil correspondente (`Candidate` ou `Company`) no backend GraphQL via Firebase UID.

#### Scenario: Registro Concluído com Sucesso
- **WHEN** o novo usuário preenche os dados cadastrais e confirma o cadastro
- **THEN** a conta é criada no Firebase, o backend registra o `User` associado ao `firebase_uuid` e a sessão é iniciada automaticamente.

### Requirement: Gerenciamento e Persistência de Sessão
O store de autenticação do Pinia SHALL manter a sessão do usuário ativa e sincronizada com o estado do Firebase Auth (`onAuthStateChanged`) e injetar o token nos cabeçalhos de todas as consultas GraphQL.

#### Scenario: Persistência de Sessão após Recarregamento
- **WHEN** o usuário autenticado recarrega a página ou abre nova aba
- **THEN** o estado de autenticação é restaurado a partir do Firebase e do armazenamento local sem exigir novo login.

#### Scenario: Logout Seguro
- **WHEN** o usuário clica na opção de sair / desconectar
- **THEN** o Firebase SDK executa `signOut`, o token e dados de sessão são expurgados do `localStorage` e o usuário é redirecionado para a tela de login.
