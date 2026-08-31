## Why

A autenticação de usuários no Workix precisa ser unificada e delegada ao **Firebase Authentication**, eliminando completamente o armazenamento ou manipulação de senhas no nosso banco de dados. O backend GraphQL deve validar a identidade dos usuários através do **Firebase UID** e tokens de autenticação emitidos pelo Firebase, vinculando o identificador externo (`firebase_uuid`) à entidade existente `User` para garantir que todas as operações e permissões de acesso da API GraphQL funcionem de maneira segura, desacoplada e padronizada.

## What Changes

- **Integração e Validação do Firebase Auth no Backend**: Implementação de mecanismo para verificação e decodificação de tokens e credenciais do Firebase Authentication no backend GraphQL.
- **Vínculo do Firebase UID ao Modelo User**: Manutenção e garantia de associação unívoca entre o `firebase_uuid` vindo do Firebase Auth e o registro `User` existente na base de dados (`src/models/user.ts`), sem armazenar campos de senha ou hash de credenciais no banco.
- **Evolução do Módulo de Autenticação GraphQL (`src/modules/auth`)**:
  - Ajuste/expansão da mutation `doLogin` ou criação de mutation dedicada (`syncFirebaseUser` / `firebaseLogin`) para receber as credenciais/UID do Firebase, validar a existência do usuário e retornar o token de sessão/JWT ou dados do perfil vinculado.
  - Manutenção da query `aboutMe` protegida pelos resolvers composáveis (`authGuard`), validando o contexto de autenticação com base no `firebase_uuid`.
- **Evolução do Middleware de Extração de JWT / Auth (`src/middleware/extract_jwt.ts`)**:
  - Validação e extração do `firebase_uuid` do token bearer para montagem segura do contexto GraphQL (`ctx.user`).
- **Testes Unitários e de Integração com TDD**:
  - Criação e atualização de testes unitários para o módulo `auth`, repositório e resolvers garantindo 100% de cobertura nos cenários de autenticação com Firebase.

## Capabilities

### New Capabilities
- `firebase-auth-backend`: Implementação da camada de autenticação, verificação de identidade via Firebase UID e resolução de contexto do usuário no backend GraphQL.

### Modified Capabilities
- None

## Impact

- **Código Afetado**: `src/modules/auth/*`, `src/middleware/extract_jwt.ts`, `src/composable_resolvers/*`, `src/models/user.ts`, `tests/unit/modules/users_auth_jaas.spec.ts`.
- **APIs GraphQL**: Queries `aboutMe`, Mutations `doLogin` / `createUser` no schema GraphQL.
- **Dependências**: Integração com SDK/validação de tokens Firebase e pacotes existentes (`jsonwebtoken`).
- **Banco de Dados**: Reutilização da estrutura existente da tabela `users` com o campo `firebase_uuid`, preservando o princípio de zero armazenamento de senhas.
