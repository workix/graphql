## 1. Pipeline de Upload de Mídia e Segurança no Backend

- [x] 1.1 Implementar rotas REST de upload de mídia (`POST /api/v1/media/upload/:id` e `POST /api/v1/media/direct-upload`) em Express com Multer e serving estático em `/uploads/media/`
- [x] 1.2 Integrar validação estrita de Magic Bytes (`validateUploadedFileBuffer`) e sanitização anti-XSS no pipeline de upload
- [x] 1.3 Atualizar `media.repo.ts` para suportar armazenamento local em disco e geração de URLs públicas dinâmicas
- [x] 1.4 Criar testes unitários para o endpoint de upload e validação de segurança de arquivos

## 2. Frontend Web Cliente: Eliminação de Mocks e Integração 100% GraphQL

- [x] 2.1 Refatorar `media.service.ts` para envio de arquivos reais via `FormData` e confirmação GraphQL sem fallbacks mockados
- [x] 2.2 Refatorar `LoginView.vue` e `auth.ts` para autenticação consistente e carregamento real de sessão via `aboutMe`
- [x] 2.3 Integrar upload real de avatares, logotipos e anexos em `ProfileEditView.vue`, `PostResumeView.vue` e `PostJobView.vue`
- [x] 2.4 Validar e testar o build de produção do Frontend Web Cliente (`npm run build`)

## 3. Frontend Web Admin: Consolidação de Dados Reais e Moderação

- [x] 3.1 Garantir que todas as views administrativas (`AdminJobsView`, `AdminCandidatesView`, `AdminCompaniesView`, `AdminPlansView`, `AdminJAASRolesView`, etc.) operem com queries e mutations reais
- [x] 3.2 Implementar modais de confirmação e ações em tempo real com notificações (*snackbar*) para todas as operações de moderação
- [x] 3.3 Validar e testar o build de produção do Frontend Web Admin (`npm run build`)

## 4. Verificação Integrada e Testes de Regressão

- [x] 4.1 Executar a suíte de testes unitários do Backend cobrindo novos endpoints e serviços
- [x] 4.2 Validar o ciclo completo de upload, salvamento e renderização de mídias entre Backend e Frontend

