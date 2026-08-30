## 1. Componentes Base do Cliente

- [x] 1.1 Criar `TheHeader.vue` com navegação, branding e status do usuário logado (preservando o HTML do Jobseek).
- [x] 1.2 Criar `TheFooter.vue` com links institucionais e formulário de inscrição em newsletter.
- [x] 1.3 Criar componentes de exibição reutilizáveis: `JobCard.vue`, `CandidateCard.vue`, `Pagination.vue` e `LoadingOverlay.vue`.

## 2. Views Principais e Autenticação

- [x] 2.1 Criar `LoginView.vue` e `RegisterView.vue` integradas aos serviços `/auth/login` e `/users`.
- [x] 2.2 Implementar a `HomeView.vue` (index.html) com busca dinâmica, carrossel de vagas em destaque (`/jobs/random_featured`) e estatísticas (`/statistics`).

## 3. Módulo de Vagas e Candidaturas

- [x] 3.1 Criar a camada de serviço `src/services/jobs.ts` para chamadas REST/GraphQL de vagas.
- [x] 3.2 Implementar `JobsListView.vue` (jobs.html) com filtro lateral e paginação server-side (`/jobs/paginated`).
- [x] 3.3 Implementar `JobDetailView.vue` (job-details.html) com formulário de candidatura (`/jobs/subscribe`).
- [x] 3.4 Implementar `PostJobView.vue` (post-a-job.html) com formulário de publicação de vaga para empresas.

## 4. Módulo de Currículos, Empresa e Blog

- [x] 4.1 Criar a camada de serviço `src/services/resumes.ts` e `src/services/blogs.ts`.
- [x] 4.2 Implementar `CandidatesListView.vue` (candidates.html) e `CandidateDetailView.vue` (resume.html).
- [x] 4.3 Implementar `PostResumeView.vue` (post-a-resume.html) e `CompanyDetailView.vue` (company.html).
- [x] 4.4 Implementar `BlogListView.vue` (blog.html) e `BlogPostView.vue` (post.html) com formulário de comentários (`/comments`).
