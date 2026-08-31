# firebase-auth-backend Specification

## Purpose
Fornece o contrato de comportamento para o fluxo de autenticação e identificação de usuários no backend GraphQL através do Firebase Authentication, associando o Firebase UID aos registros de usuários e garantindo a proteção de recursos sem persistência de senhas no banco de dados.

## Requirements

### Requirement: Autenticação e Validação de Credenciais Firebase
O backend GraphQL SHALL autenticar usuários exclusivamente através da validação do Firebase UID e/ou Firebase Tokens, associando a identidade remota ao registro `User` existente.

#### Scenario: Autenticação com Firebase UID Válido
- **WHEN** uma requisição de autenticação (`doLogin`) é enviada contendo `firebaseUUID` e `email` correspondentes a um usuário existente
- **THEN** o backend valida a correspondência e retorna um token de sessão válido para o usuário autenticado.

#### Scenario: Tentativa de Autenticação com Credenciais Inválidas
- **WHEN** uma requisição de login é submetida com `firebaseUUID` ou `email` não cadastrados ou divergentes
- **THEN** o backend rejeita a operação com mensagem de erro explicativa sem expor detalhes sensíveis.

### Requirement: Zero Armazenamento de Senhas no Banco de Dados
O sistema SHALL delegar integralmente a gestão de credenciais e senhas ao Firebase Authentication, sendo expressamente proibido persistir, processar ou requerer senhas na tabela `users` do banco de dados.

#### Scenario: Criação de Usuário Vinculado ao Firebase
- **WHEN** um novo usuário é registrado no backend via mutation `createUser`
- **THEN** a entidade `User` é persistida contendo `email`, `firebaseUUID`, status de ativação e identificadores únicos, sem nenhum atributo de senha no banco.

### Requirement: Resolução de Contexto Autenticado e Proteção de Queries/Mutations
O middleware e guardas de autorização GraphQL SHALL extrair o token da requisição, validar a identidade do usuário e injetar o usuário correspondente no contexto (`ctx.user`).

#### Scenario: Consulta aboutMe com Token Válido
- **WHEN** o usuário autenticado executa a query protegida `aboutMe` enviando o token no header `Authorization`
- **THEN** o backend retorna as informações consolidadas do `User`, bem como dados vinculados de `Company`, `Candidate` e `Resume` correspondentes.

#### Scenario: Acesso a Recursos Protegidos sem Token
- **WHEN** um cliente não autenticado tenta executar uma query ou mutation protegida por guardas de autorização
- **THEN** o GraphQL retorna erro de não autorizado (`Unauthorized! Token not provided`).
