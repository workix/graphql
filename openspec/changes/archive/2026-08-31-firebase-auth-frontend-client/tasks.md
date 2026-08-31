## 1. Configuração e Serviços Firebase

- [x] 1.1 Configurar o serviço de inicialização do Firebase e Firebase Auth em `frontend/client/src/services/firebase.ts` com suporte a variáveis de ambiente
- [x] 1.2 Atualizar dependências em `frontend/client/package.json` caso o pacote `firebase` necessite de inclusão/atualização

## 2. Store Pinia e Gerenciamento de Sessão

- [x] 2.1 Atualizar `frontend/client/src/stores/auth.ts` para implementar métodos de login com Firebase (`loginWithFirebase`), cadastro (`registerWithFirebase`), logout e listener `onAuthStateChanged`
- [x] 2.2 Integrar a chamada da mutation GraphQL `doLogin` e query `aboutMe` para obtenção e hidratação do perfil completo do usuário

## 3. Telas e Interceptores de Rede

- [x] 3.1 Atualizar `frontend/client/src/views/LoginView.vue` para utilizar o fluxo de login via Firebase Auth com tratamento de erros em português
- [x] 3.2 Atualizar `frontend/client/src/views/RegisterView.vue` para registro de conta no Firebase e sincronização imediata com o backend
- [x] 3.3 Validar a injeção do header de autorização e tratamento de sessão no `frontend/client/src/services/graphql.ts`
