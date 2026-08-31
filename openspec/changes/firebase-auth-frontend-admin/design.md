## Context

O Frontend Admin foi construído com Vue 3, Vuetify 3 (Material Design), Pinia e Vite. O acesso ao painel dá controle total sobre vagas, candidatos, empresas, posts do blog e usuários JAAS (`src/views/AdminJAASUsersView.vue` e `src/views/AdminJAASRolesView.vue`).

Atualmente, `AdminLoginView.vue` realizava chamadas a um endpoint REST com senha. Este design estabelece o uso do Firebase Authentication no Admin com verificação cruzada dos perfis administrativos no backend GraphQL.

## Goals / Non-Goals

**Goals:**
- Configurar o módulo de inicialização do Firebase Auth para o Frontend Admin (`frontend/admin/src/services/firebase.ts`).
- Evoluir `useAdminAuthStore` para gerenciar login com Firebase, consultar os papéis do usuário no backend e armazenar `AdminUser` com role validada.
- Adaptar o formulário `AdminLoginView.vue` com Vuetify para o fluxo de autenticação Firebase.
- Assegurar que o `navigation guard` em `router/index.ts` valide `isAuthenticated` e papéis de acesso antes de permitir a entrada em rotas protegidas.

**Non-Goals:**
- Permitir cadastro aberto de administradores pela interface de login (contas administrativas devem ser pré-provisionadas ou aprovadas via backend/Firebase console).
- Armazenar senhas no backend.

## Decisions

1. **Validação de Papéis Administrativos em Duas Etapas**:
   - *Decisão*: O usuário autentica no Firebase Authentication. Em seguida, o frontend executa uma consulta GraphQL no backend para verificar se o `firebase_uuid` possui vínculo com um papel administrativo (`JAASUser` / `JAASRole` ou role de administrador). Caso não possua, a sessão é recusada com aviso claro.
   - *Alternativa considerada*: Confiar unicamente em custom claims do Firebase. Rejeitada para manter o controle de papéis dinâmico centralizado no banco de dados da aplicação (`jaas_users` e `jaas_roles`).

2. **Persistência Reativa com Vuetify State**:
   - *Decisão*: Manter tokens no `localStorage` sob a chave `workix_admin_token` e validar o estado do Firebase Auth via `onAuthStateChanged`.

## Risks / Trade-offs

- **[Risco] Tentativa de Acesso por Usuário Comum no Painel Admin** → *Mitigação*: Validação estrita dos papéis no backend logo após a autenticação Firebase, efetuando logout automático caso o usuário não seja admin/operador.
