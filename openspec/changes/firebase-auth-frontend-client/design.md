## Context

O Frontend Cliente está estruturado em Vue 3 (Composition API com `<script setup lang="ts">`), Pinia para gerenciamento de estado e Vite como bundler. As requisições para a API são centralizadas no `GraphQLClient` (`frontend/client/src/services/graphql.ts`), que lê o token de autenticação do `useAuthStore` e o injeta no header `Authorization: Bearer <token>`.

Atualmente, `LoginView.vue` continha botões de acesso rápido simulando tokens locais e um formulário que tentava bater em um endpoint REST legado. Este design estabelece a integração oficial do **Firebase Authentication JS SDK** (`firebase/auth`), delegando totalmente a validação de credenciais ao Firebase e mantendo o Pinia Store sincronizado via `onAuthStateChanged`.

## Goals / Non-Goals

**Goals:**
- Configurar o módulo de inicialização do Firebase (`frontend/client/src/services/firebase.ts`) com suporte a variáveis de ambiente (`VITE_FIREBASE_*`).
- Atualizar o store Pinia `useAuthStore` para expor métodos de login (`loginWithFirebase`), cadastro (`registerWithFirebase`), logout e sincronização com o backend.
- Conectar `LoginView.vue` e `RegisterView.vue` aos fluxos reais do Firebase, mantendo mensagens de feedback visual elegantes e tratamento de erros do Firebase (ex.: `auth/user-not-found`, `auth/wrong-password`, `auth/email-already-in-use`).
- Garantir que `GraphQLClient` receba e repasse o token JWT retornado pelo backend (ou Firebase ID Token) em todas as requisições protegidas.

**Non-Goals:**
- Enviar a senha do usuário para qualquer endpoint do backend próprio.
- Modificar o layout visual ou estilos base do template do Jobseek além do necessário para acomodar o fluxo de autenticação e feedback.

## Decisions

1. **Camada de Serviço Firebase Desacoplada (`services/firebase.ts`)**:
   - *Decisão*: Isolar a inicialização de `getAuth(app)` e configuração do Firebase em um serviço dedicado, exportando `auth` e helpers de autenticação.
   - *Alternativa considerada*: Inicializar o Firebase diretamente no `main.ts`. A separação em `services/firebase.ts` facilita testes e reutilização em stores e componentes.

2. **Fluxo Híbrido: Firebase Auth → GraphQL Backend**:
   - *Decisão*: Ao autenticar no Firebase, o frontend obtém o `uid` e `email` (e opcionalmente `getIdToken()`), executa a mutation GraphQL `doLogin` enviando `{ firebaseUUID, email }`, obtém o JWT do backend e armazena os dados do `User` / perfil no Pinia store e `localStorage`.
   - *Alternativa considerada*: Usar apenas o Firebase ID Token sem consultar o backend no login. A consulta ao backend é essencial para recuperar a role (`CANDIDATE` ou `COMPANY`), o ID interno do banco e os relacionamentos (`Resume` / `Company`).

3. **Reatividade e Persistência de Sessão**:
   - *Decisão*: Registrar um observer `onAuthStateChanged` na inicialização do store para restaurar e validar a sessão do usuário caso o token local expire ou o usuário retorne à aplicação.

## Risks / Trade-offs

- **[Risco] Erro de Rede ou Indisponibilidade do Firebase** → *Mitigação*: Tratar exceções com mensagens amigáveis em português na interface, impedindo estados inconsistentes de login.
- **[Risco] Token Expirado durante Navegação** → *Mitigação*: `GraphQLClient` intercepta falhas de autorização e aciona `authStore.logout()`, redirecionando para `/login?redirect=...`.
