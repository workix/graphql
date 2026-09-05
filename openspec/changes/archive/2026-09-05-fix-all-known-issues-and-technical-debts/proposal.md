## Why

O projeto possui 7 débitos técnicos e gaps registrados no arquivo `KNOW_ISSUES.md`, cobrindo vulnerabilidades de segurança (auth guards permissivos e bypass indevido de role no admin), limitações de tempo real nos frontends (mensagens e notificações sem live-updates), defasagens de navegação e FCM no aplicativo Android, além de ausência de testes instrumentados no mobile e cobertura de testes em módulos legados do backend. Esta mudança consolida a resolução integral de todas as issues abertas, elevando a confiabilidade, conformidade e segurança de todo o ecossistema Workix.

## What Changes

- **Frontend Admin & Client Auth Guards (ISSUE-007)**: Configurar os guards de rota para operarem protegidos por padrão (`meta.requiresAuth` ativo a menos que explicitamente desativado por flag de teste), adicionando `.env.example` padronizados.
- **Frontend Admin Role Gating & Session Hardening (ISSUE-008)**: Validar estritamente papéis administrativos (`ROLE_ADMIN`, `ROLE_OPERATOR`) contra o backend e desativar emissores de tokens dummy locais quando fora do ambiente de desenvolvimento explícito (`import.meta.env.DEV`).
- **Frontend Client Real-time Messaging & Notifications (ISSUE-009)**: Integrar sincronização em tempo real (subscriptions GraphQL/WebSocket e fallback de polling ativo resiliente) nos módulos de mensagens e notificações.
- **Android App Navigation Parity & Manifest Registration (ISSUE-010)**: Registrar `RecruitmentKanbanActivity` e `InterviewsActivity` no `AndroidManifest.xml` e adicionar pontos de entrada e navegação na `MainActivity` para todas as telas (Feed Social, Chat, Conexões, Cursos, Grupos, Eventos, Vagas, Candidatos, Analytics, Kanban, Entrevistas, Planos).
- **Android App FCM Token Synchronization (ISSUE-011)**: Implementar em `MyFirebaseMessagingService.onNewToken` o envio e persistência do novo token FCM ao backend GraphQL.
- **Android Instrumented Test Suite (ISSUE-012)**: Implementar a suíte de testes instrumentados Espresso/JUnit em `android/app/src/androidTest/`.
- **Backend Test Coverage Hardening & Known Issues Resolution (ISSUE-001)**: Adicionar suítes de testes unitários TDD cobrindo edge cases dos módulos legados e serviços do backend (`extract_jwt`, `tenant.middleware`, `contact_unlock.service`, `company_integrity.service`, `job_expiration.service`, `adaptive_search.driver`, etc.), atualizando `KNOW_ISSUES.md` com status de 100% resolvido.

## Capabilities

### New Capabilities
- `technical-debt-resolution`: Resolução integral de todas as pendências arquiteturais, de segurança, tempo real e cobertura do ecossistema.

### Modified Capabilities
- `frontend-admin-capabilities`: Reforço de segurança nos guards de rota e controle de acesso estrito por perfil.
- `frontend-client-capabilities`: Adição de sincronização em tempo real e proteção padrão de rotas autenticadas.
- `android-parity-and-fcm`: Paridade completa de navegação, registro de activities e sincronização resiliente de tokens push.

## Impact

- `frontend/admin`: Arquivos de rotas, stores de autenticação e variáveis de ambiente.
- `frontend/client`: Arquivos de rotas, serviços de mensagens e notificações com live polling/subscriptions.
- `android/app`: `AndroidManifest.xml`, `MainActivity.kt`, `MyFirebaseMessagingService.kt` e pasta de testes `src/androidTest/`.
- `src/`: Módulos e middlewares com testes unitários complementares.
- `KNOW_ISSUES.md`: Atualização formal dos status de todas as 7 issues para Corrigido.
