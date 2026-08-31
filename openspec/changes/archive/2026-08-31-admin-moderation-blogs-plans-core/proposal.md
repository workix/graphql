# Proposal: Implementação de Telas Administrativas de Moderação e Auditoria (`admin-moderation-blogs-plans-core`)

## Summary
Implementar no **Frontend Admin (`frontend/admin`)** os painéis de moderação e auditoria para o blog corporativo (`blogs`), comentários (`comments`), cursos LMS (`learning`), planos de assinatura (`premium`) e mensagens de contato/suporte (`forms`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação de governança e administração do ecossistema Workix:
- O time de administradores necessita de controle centralizado sobre os artigos de blog corporativo publicados, com criação, edição e exclusão.
- Moderação de cursos cadastrados na plataforma LMS.
- Manutenção dos planos de assinatura e precificação comercial do Workix Premium.
- Caixa de entrada para leitura e acompanhamento das mensagens de contato e ouvidoria dos usuários.

## Impacted Areas
- **Frontend Admin (`frontend/admin`)**:
  - `src/services/blogsAdmin.service.ts`: Abstração de queries e mutations de blogs e comentários.
  - `src/services/coursesAdmin.service.ts`: Abstração de queries e mutations de cursos LMS.
  - `src/services/plansAdmin.service.ts`: Abstração de queries e mutations de planos premium.
  - `src/services/formsAdmin.service.ts`: Abstração de queries e mutations de formulários.
  - `src/views/AdminBlogsView.vue` (`/blogs`): Gestão e criação de posts do blog com Vuetify 3.
  - `src/views/AdminCoursesView.vue` (`/courses`): Gestão e cadastro de cursos do Workix Learning.
  - `src/views/AdminPlansView.vue` (`/plans`): Cadastro e gestão de planos de assinatura.
  - `src/views/AdminFormsView.vue` (`/forms`): Caixa de entrada de formulários de contato.
  - Atualização do menu lateral em `src/layouts/AdminLayout.vue` e rotas em `src/router/index.ts`.
