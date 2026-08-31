## Why

O Frontend Cliente (`frontend/client/`) necessita de um fluxo real e seguro de autenticação através do **Firebase Authentication**, substituindo as credenciais mockadas e formulários locais. O usuário (Candidato ou Empresa) deve realizar login/cadastro diretamente pelo Firebase, obtendo o Firebase UID e repassando-o para o backend GraphQL para sincronização do perfil e obtenção do token de sessão, com suporte a persistência de sessão e proteção de rotas.

## What Changes

- **Configuração do Firebase Client SDK**: Inicialização do Firebase (`firebase/app` e `firebase/auth`) na aplicação Vue 3 do Frontend Cliente.
- **Evolução do Pinia Store de Autenticação (`frontend/client/src/stores/auth.ts`)**:
  - Integração com `signInWithEmailAndPassword`, `createUserWithEmailAndPassword` e `signOut` do Firebase.
  - Listener de persistência de estado de autenticação (`onAuthStateChanged`) garantindo permanência do login entre recarregamentos e abas.
  - Gerenciamento de tokens e perfil do usuário (`id`, `email`, `role`, `firebase_uuid`).
- **Atualização das Telas de Login e Cadastro**:
  - `LoginView.vue`: Integração do formulário com o Firebase Auth, remoção de chamadas legadas com senha para o backend e redirecionamento dinâmico.
  - `RegisterView.vue`: Criação da conta no Firebase Auth e vinculação imediata com o backend GraphQL.
- **Interceptors e Header de Autorização (`frontend/client/src/services/graphql.ts`)**:
  - Envio automático do token de autenticação nos headers `Authorization: Bearer <token>` para todas as requisições GraphQL.
  - Tratamento de sessão expirada / erro 401.

## Capabilities

### New Capabilities
- `firebase-auth-frontend-client`: Fluxo completo de login, cadastro, gerenciamento de sessão e integração com Firebase no Frontend Cliente Vue 3.

### Modified Capabilities
- None

## Impact

- **Código Afetado**: `frontend/client/src/stores/auth.ts`, `frontend/client/src/views/LoginView.vue`, `frontend/client/src/views/RegisterView.vue`, `frontend/client/src/services/graphql.ts`, `frontend/client/src/services/firebase.ts`.
- **Dependências**: Pacote `firebase` (npm).
- **Segurança**: Senhas são digitadas e verificadas exclusivamente pelo Firebase SDK no cliente; nenhuma senha trafega para o backend.
