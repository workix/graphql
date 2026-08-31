## 1. Configuração e Serviços Firebase no Admin

- [x] 1.1 Configurar o serviço de inicialização do Firebase e Firebase Auth em `frontend/admin/src/services/firebase.ts` com variáveis de ambiente
- [x] 1.2 Atualizar o `frontend/admin/package.json` caso o pacote `firebase` necessite de inclusão/atualização

## 2. Store Pinia Admin e Validação de Papéis

- [x] 2.1 Atualizar `frontend/admin/src/stores/adminAuth.ts` implementando o login via Firebase Auth (`loginWithFirebase`), logout e observação de estado (`onAuthStateChanged`)
- [x] 2.2 Integrar a consulta de verificação de permissões administrativas no backend GraphQL (`JAASUser` / papéis) antes de confirmar a sessão

## 3. Tela de Login e Guardas de Navegação

- [x] 3.1 Atualizar `frontend/admin/src/views/AdminLoginView.vue` para submissão via Firebase com feedback visual com Vuetify
- [x] 3.2 Validar guardas de navegação no `frontend/admin/src/router/index.ts` e injeção do header de autorização nas consultas GraphQL
