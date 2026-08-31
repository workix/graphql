# Design Document: Telas Administrativas de Moderação e Auditoria (`admin-moderation-blogs-plans-core`)

## Architectural Strategy

No Frontend Admin (`frontend/admin` com Vue 3 + Vuetify 3):
1. **Camada de Serviços (`frontend/admin/src/services`)**:
   - `blogsAdmin.service.ts`: Listagem paginada (`allBlogsPaginated`), criação (`createBlog`) e deleção (`deleteBlog`).
   - `coursesAdmin.service.ts`: Listagem e cadastro de cursos (`createCourse`).
   - `plansAdmin.service.ts`: Listagem e cadastro de planos (`subscriptionPlans`, `createSubscriptionPlan`).
   - `formsAdmin.service.ts`: Listagem de mensagens de contato (`allFormsPaginated`) e deleção (`deleteForm`).

2. **Componentes e Views (`frontend/admin/src/views`)**:
   - `AdminBlogsView.vue` (`/blogs`): Tabela com `v-data-table`, filtros, modal de criação de post do blog.
   - `AdminCoursesView.vue` (`/courses`): Tabela de cursos e modal de cadastro de novo curso.
   - `AdminPlansView.vue` (`/plans`): Tabela de planos com preço e cotas de InMail, modal de criação.
   - `AdminFormsView.vue` (`/forms`): Caixa de entrada de mensagens de suporte com botão de exclusão.

3. **Navegação & Rotas**:
   - Atualização de `src/layouts/AdminLayout.vue` com links no menu lateral para Blogs, Cursos, Planos e Formulários.
   - Registro de rotas em `src/router/index.ts`.
