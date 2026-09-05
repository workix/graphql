## 1. Segurança nos Frontends (ISSUE-007 & ISSUE-008)

- [x] 1.1 Configurar Auth Guard ativo por padrão em `frontend/admin/src/router/index.ts` e `frontend/client/src/router/index.ts` com `.env.example`
- [x] 1.2 Implementar gating estrito de role (`ROLE_ADMIN`, `ROLE_OPERATOR`) e desativar bypass fake em produção em `frontend/admin/src/stores/adminAuth.ts`
- [x] 1.3 Executar e validar suítes de testes dos frontends admin e client

## 2. Live Updates em Mensageria e Notificações (ISSUE-009)

- [x] 2.1 Implementar live polling / sincronização de mensagens e notificações em `frontend/client/src/services/messaging.service.ts` e `notifications.service.ts`
- [x] 2.2 Integrar ciclo de atualização reativa em `MessagingView.vue` e `NotificationsView.vue`
- [x] 2.3 Validar suíte de testes do client frontend

## 3. Navegação, Manifest e FCM no App Android (ISSUE-010 & ISSUE-011)

- [x] 3.1 Registrar `RecruitmentKanbanActivity` e `InterviewsActivity` em `android/app/src/main/AndroidManifest.xml`
- [x] 3.2 Implementar menu de opções / navegação completa em `MainActivity.kt` conectando todas as telas do ecossistema
- [x] 3.3 Implementar propagação e persistência de token em `MyFirebaseMessagingService.kt` (`onNewToken`)
- [x] 3.4 Validar compilação e testes unitários do Android

## 4. Testes Instrumentados no Android (ISSUE-012)

- [x] 4.1 Criar diretório `android/app/src/androidTest/java/br/com/codecode/workix/android/`
- [x] 4.2 Implementar testes instrumentados `MainActivityTest.kt` e `LoginActivityTest.kt`
- [x] 4.3 Validar integridade da suíte Android

## 5. Cobertura de Testes no Backend e Atualização de KNOW_ISSUES.md (ISSUE-001)

- [x] 5.1 Adicionar testes unitários para middlewares e serviços sem cobertura (`extract_jwt`, `tenant.middleware`, `contact_unlock.service`, `company_integrity.service`, etc.)
- [x] 5.2 Executar suíte completa do backend `npm test` garantindo 100% de aprovação
- [x] 5.3 Atualizar `KNOW_ISSUES.md` marcando todas as issues como `Corrigido`
