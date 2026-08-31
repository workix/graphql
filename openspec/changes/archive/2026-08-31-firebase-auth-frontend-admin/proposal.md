## Why

O Frontend Administrativo (`frontend/admin/`) requer um mecanismo robusto de autenticação baseado em **Firebase Authentication** para operadores e administradores do sistema. O login deve validar as credenciais no Firebase, consultar os perfis/papéis administrativos (JAAS / roles) no backend GraphQL e proteger as rotas de gerenciamento de dados contra acessos não autorizados.

## What Changes

- **Integração do Firebase Client SDK no Admin**: Configuração do serviço Firebase (`frontend/admin/src/services/firebase.ts`) com credenciais do projeto.
- **Evolução do Pinia Store Admin (`frontend/admin/src/stores/adminAuth.ts`)**:
  - Implementação de login e logout com Firebase Authentication (`signInWithEmailAndPassword`, `signOut`).
  - Validação de perfil administrativo (`ROLE_ADMIN`, `ROLE_OPERATOR`) através de consulta ao backend GraphQL.
  - Persistência e reatividade de sessão (`onAuthStateChanged`).
- **Atualização da Tela de Login Administrativo (`frontend/admin/src/views/AdminLoginView.vue`)**:
  - Integração do formulário Vuetify com o Firebase Auth.
  - Bloqueio de senhas locais e exibição de mensagens de erro claras com componentes Vuetify (`v-alert`).
- **Proteção de Rotas e Headers GraphQL (`frontend/admin/src/router/index.ts` e serviços)**:
  - Garantia de envio do token de autorização no header `Authorization: Bearer <token>` em todas as operações administrativas e auditoria de sessão expirada.

## Capabilities

### New Capabilities
- `firebase-auth-frontend-admin`: Autenticação e autorização de administradores com Firebase no Frontend Admin.

### Modified Capabilities
- None

## Impact

- **Código Afetado**: `frontend/admin/src/stores/adminAuth.ts`, `frontend/admin/src/views/AdminLoginView.vue`, `frontend/admin/src/router/index.ts`, `frontend/admin/src/services/firebase.ts`, `frontend/admin/src/services/graphql.ts`.
- **Dependências**: Pacote `firebase` (npm).
- **Segurança**: Senhas são processadas unicamente pelo Firebase SDK; controle de acesso administrativo validado pelo backend.
