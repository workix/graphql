## Context

O projeto Workix possui 7 itens de débitos técnicos mapeados em `KNOW_ISSUES.md`. A resolução deve contemplar o ecossistema completo: Backend GraphQL (Node/TypeScript/Jest), Frontend Admin (Vue 3/Pinia/Vite), Frontend Client (Vue 3/Pinia/Vite) e Aplicativo Android (Kotlin/Gradle/Espresso).

## Goals / Non-Goals

**Goals:**
- Proteger rotas autenticadas por padrão nos frontends sem exigir flags manuais para segurança.
- Restringir sessões administrativas a perfis autenticados com roles válidas no backend.
- Adicionar sincronização resiliente em tempo real para mensageria e notificações no frontend client.
- Registrar todas as Activities no Android e fornecer navegação completa.
- Tratar rotação de token FCM no Android com sincronização para o backend.
- Criar suíte de testes instrumentados `androidTest/` com Espresso no Android.
- Elevar a cobertura de testes no backend para cobrir middlewares e serviços remanescentes.

**Non-Goals:**
- Não reescrever arquitetura de banco de dados ou schemas fundamentais.
- Não alterar as regras de negócio consolidadas em `SPECIFICATION.md`.

## Decisions

1. **Auth Guard Seguro por Padrão**:
   - `import.meta.env.VITE_ENABLE_AUTH_GUARD !== 'false'` garante que o guard esteja ativo por default tanto em dev quanto em prod, permitindo desligamento apenas para testes automatizados unitários quando desejado.
2. **Gating de Role do Admin**:
   - Em produção, validar que o usuário possui role de administrador retornada pela API e falhar explicitamente caso não possua. Manter fallback apenas sob `import.meta.env.DEV` com log visível.
3. **Live Polling / Real-time nos Frontends**:
   - Adicionar polling inteligente periódico com fallback e suporte a eventos no `messaging.service.ts` e `notifications.service.ts`.
4. **Navegação Android**:
   - Adicionar menu superior de opções / drawer / menu items em `MainActivity` para abrir de forma direta todas as 10+ telas do sistema.
   - Declarar `RecruitmentKanbanActivity` e `InterviewsActivity` no `AndroidManifest.xml`.
5. **FCM Token Handler**:
   - `onNewToken` salvará no `SessionManager` e invocará a API de registro de device token no backend se logado.
6. **Android Instrumented Tests**:
   - Criar `MainActivityTest.kt` e `LoginActivityTest.kt` na pasta `android/app/src/androidTest/java/br/com/codecode/workix/android/`.

## Risks / Trade-offs

- [Bloqueio inesperado em testes unitários dos frontends] → Manter suporte para mock do authStore ou `VITE_ENABLE_AUTH_GUARD=false` em testes.
- [Conexões simultâneas em tempo real] → Polling com intervalo balanceado (5-10s) quando subscriptions WebSocket não estiverem ativas.
