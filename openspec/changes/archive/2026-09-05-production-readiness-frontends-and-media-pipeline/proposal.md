## Why

A plataforma Workix foi submetida à auditoria de software profissional (73 critérios) e necessita da consolidação final de seus frontends Web (Cliente e Admin) e pipeline de upload de mídia. Esta mudança elimina todos os mockups, dados estáticos fictícios e fallbacks de desenvolvimento, garantindo que todas as telas, formulários e fluxos de upload de arquivos funcionem de forma 100% real, integrada e pronta para uso em produção.

## What Changes

- **Pipeline Real de Mídia e Upload de Arquivos**: Implementação de endpoint REST em Express (`POST /api/v1/media/upload/:id` e `POST /api/v1/media/direct-upload`) com validação estrita de tipos, Magic Bytes e sanitização anti-XSS (`file_security_validator.ts`), fornecendo URLs públicas/assinadas sem mocks ou URLs de placeholder externas.
- **Frontend Web Cliente 100% Integrado**:
  - Remoção de fallbacks mockados em `media.service.ts` e `auth.ts`.
  - Formulários de perfil, currículo, postagem de vagas, candidaturas, postagens sociais, mensagens e agendamento de entrevistas conectados diretamente ao GraphQL.
  - Tratamento aprimorado de erros visuais, feedbacks de carregamento e validações client-side com feedback real do servidor.
- **Frontend Web Admin 100% Integrado**:
  - Conexão completa de todos os painéis (`AdminJobsView`, `AdminCandidatesView`, `AdminCompaniesView`, `AdminPlansView`, `AdminJAASUsersView`, `AdminJAASRolesView`, `AdminResumesView`, `AdminCoursesView`, `AdminEventsView`, `AdminBlogsView`) a queries e mutations GraphQL com paginação, filtros e ações imediatas.

## Capabilities

### New Capabilities
- `production-media-pipeline`: Pipeline de upload, processamento e disponibilização de arquivos de mídia (imagens, PDFs de currículo, logotipos de empresas e avatares) com validação de segurança server-side.

### Modified Capabilities
- `frontend-client-implementation`: Eliminação completa de dados mockados e conexões de fallback, garantindo navegação, autenticação e gerenciamento de perfil 100% operacionais via GraphQL.
- `frontend-admin-implementation`: Operações administrativas e de moderação totalmente operacionais com persistência e feedback em tempo real.

## Impact

- **Backend**: Adição de rotas de upload de arquivos em `src/server.ts` e repositório de mídia `src/modules/media/repository/media.repo.ts`.
- **Frontend Client**: Atualização de serviços em `frontend/client/src/services/` e componentes de upload/perfil.
- **Frontend Admin**: Atualização de serviços e views em `frontend/admin/src/views/`.
