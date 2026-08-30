# Matriz Oficial de Mapeamento: Backend GraphQL ➔ Frontends (Cliente, Admin, Android)

Este documento estabelece a auditoria completa e a matriz de rastreabilidade entre as operações GraphQL disponíveis no endpoint `http://localhost:4000/graphql` e as interfaces dos três projetos frontends:
1. **Frontend Cliente** (`frontend/client` — Vue 3 + Vite + Jobseek Design Spec)
2. **Frontend Admin** (`frontend/admin` — Vue 3 + Vite + Vuetify 3)
3. **Android** (`android/` — Kotlin + Jetpack Architecture Components)

---

## 1. Inventário de Operações GraphQL do Backend

### 1.1 Queries Auditadas

| Domínio / Entidade | Query GraphQL | Parâmetros / Filtros | Tipo de Retorno | Suporte a Paginação |
|---|---|---|---|---|
| **Author** | `allAuthors` | Nenhum | `[Author]` | Não |
| **Author** | `getAuthorById` | `id: ID!` | `Author` | Não |
| **Author** | `allAuthorsPaginated` | `limit: Int, offset: Int` | `AuthorPaginated` | ✅ Sim (`limit`, `offset`) |
| **Blog** | `allBlogs` | Nenhum | `[Blog]` | Não |
| **Blog** | `getBlogById` | `id: ID!` | `Blog` | Não |
| **Blog** | `allBlogsPaginated` | `limit: Int, offset: Int` | `BlogPaginated` | ✅ Sim (`limit`, `offset`) |
| **Blog** | `allComments` | Nenhum | `[Comment]` | Não |
| **Blog** | `getCommentById` | `id: ID!` | `Comment` | Não |
| **Blog** | `allCommentsPaginated` | `limit: Int, offset: Int` | `CommentPaginated` | ✅ Sim (`limit`, `offset`) |
| **Blog** | `allBlogsCategories` | Nenhum | `[BlogCategory]` | Não |
| **Blog** | `allBlogsTimePeriods` | Nenhum | `[String]` | Não |
| **Blog** | `allBlogsRecents` | `limit: Int` | `[Blog]` | Não |
| **Blog** | `allCommentsRecents` | `limit: Int` | `[Comment]` | Não |
| **Candidate** | `allCandidates` | Nenhum | `[Candidate]` | Não |
| **Candidate** | `getCandidateById` | `id: ID!` | `Candidate` | Não |
| **Candidate** | `allCandidatesPaginated`| `limit: Int, offset: Int` | `CandidatePaginated` | ✅ Sim (`limit`, `offset`) |
| **Company** | `allCompanies` | Nenhum | `[Company]` | Não |
| **Company** | `getCompanyById` | `id: ID!` | `Company` | Não |
| **Company** | `allCompaniesPaginated` | `limit: Int, offset: Int` | `CompanyPaginated` | ✅ Sim (`limit`, `offset`) |
| **Company** | `listRandomLogos` | `limit: Int` | `[Company]` | Não |
| **Form** | `allForms` | Nenhum | `[Form]` | Não |
| **Form** | `getFormById` | `id: ID!` | `Form` | Não |
| **Form** | `allFormsPaginated` | `limit: Int, offset: Int` | `FormPaginated` | ✅ Sim (`limit`, `offset`) |
| **JAAS** | `allJAASUsers` | Nenhum | `[JAASUser]` | Não |
| **JAAS** | `getJAASUserById` | `id: ID!` | `JAASUser` | Não |
| **JAAS** | `allJAASUsersPaginated` | `limit: Int, offset: Int` | `JAASUserPaginated` | ✅ Sim (`limit`, `offset`) |
| **JAAS** | `allJAASRoles` | Nenhum | `[JAASRole]` | Não |
| **JAAS** | `getJAASRoleByName` | `name: String!` | `JAASRole` | Não |
| **JAAS** | `allJAASRolesPaginated` | `limit: Int, offset: Int` | `JAASRolePaginated` | ✅ Sim (`limit`, `offset`) |
| **Job** | `allJobs` | Nenhum | `[Job]` | Não |
| **Job** | `getJobById` | `id: ID!` | `Job` | Não |
| **Job** | `allJobsPaginated` | `limit: Int, offset: Int` | `JobPaginated` | ✅ Sim (`limit`, `offset`) |
| **Job** | `allJobsFeatured` | Nenhum | `[Job]` | Não |
| **Job** | `listJobRandomFeatured` | `limit: Int` | `[Job]` | Não |
| **Job** | `getJobByCompanyId` | `companyId: ID!` | `[Job]` | Não |
| **Job** | `getJobByIdAndCompanyId`| `id: ID!, companyId: ID!` | `Job` | Não |
| **Job** | `myJobs` | Nenhum | `[Job]` | Não |
| **Member** | `allMembers` | Nenhum | `[Member]` | Não |
| **Member** | `getMemberById` | `id: ID!` | `Member` | Não |
| **Member** | `allMembersPaginated` | `limit: Int, offset: Int` | `MemberPaginated` | ✅ Sim (`limit`, `offset`) |
| **Resume** | `allResumes` | Nenhum | `[Resume]` | Não |
| **Resume** | `getResumeById` | `id: ID!` | `Resume` | Não |
| **Resume** | `allResumesPaginated` | `limit: Int, offset: Int` | `ResumePaginated` | ✅ Sim (`limit`, `offset`) |
| **Selective Process** | `allSelectiveProcesses` | Nenhum | `[SelectiveProcess]` | Não |
| **Selective Process** | `getSelectiveProcessById` | `id: ID!` | `SelectiveProcess` | Não |
| **Selective Process** | `allSelectiveProcessesPaginated` | `limit: Int, offset: Int` | `SelectiveProcessPaginated` | ✅ Sim (`limit`, `offset`) |
| **Selective Process** | `mySelectiveProcessesSubscribed` | Nenhum | `[SelectiveProcess]` | Não |
| **Selective Process** | `mySelectiveProcesses` | Nenhum | `[SelectiveProcess]` | Não |
| **Subscriber** | `allSubscribers` | Nenhum | `[Subscriber]` | Não |
| **Subscriber** | `getSubscriberById` | `id: ID!` | `Subscriber` | Não |
| **Subscriber** | `allSubscribersPaginated` | `limit: Int, offset: Int` | `SubscriberPaginated` | ✅ Sim (`limit`, `offset`) |
| **Testimonial** | `allTestimonials` | Nenhum | `[Testimonial]` | Não |
| **Testimonial** | `getTestimonialById` | `id: ID!` | `Testimonial` | Não |
| **Testimonial** | `allTestimonialsPaginated` | `limit: Int, offset: Int` | `TestimonialPaginated` | ✅ Sim (`limit`, `offset`) |
| **User** | `allUsers` | Nenhum | `[User]` | Não |
| **User** | `getUserById` | `id: ID!` | `User` | Não |
| **User** | `allUsersPaginated` | `limit: Int, offset: Int` | `UserPaginated` | ✅ Sim (`limit`, `offset`) |
| **Stats** | `statisticsCount` | Nenhum | `StatisticsCount` | Não |
| **Others** | `validateCPF` | `cpf: String!` | `Boolean` | Não |

---

### 1.2 Mutations Auditadas

| Domínio / Entidade | Mutation GraphQL | Input / Argumentos | Retorno |
|---|---|---|---|
| **Author** | `createAuthor` | `input: AuthorInput!` | `Author` |
| **Author** | `updateAuthor` | `id: ID!, input: AuthorInput!` | `Author` |
| **Author** | `deleteAuthor` | `id: ID!` | `Boolean` |
| **Blog** | `createBlog` | `input: BlogInput!` | `Blog` |
| **Blog** | `updateBlog` | `id: ID!, input: BlogInput!` | `Blog` |
| **Blog** | `deleteBlog` | `id: ID!` | `Boolean` |
| **Blog** | `createComment` | `input: CommentInput!` | `Comment` |
| **Blog** | `updateComment` | `id: ID!, input: CommentInput!` | `Comment` |
| **Blog** | `deleteComment` | `id: ID!` | `Boolean` |
| **Candidate** | `createCandidate` | `input: CandidateInput!` | `Candidate` |
| **Candidate** | `updateCandidate` | `id: ID!, input: CandidateInput!` | `Candidate` |
| **Candidate** | `deleteCandidate` | `id: ID!` | `Boolean` |
| **Candidate** | `notifyCandidate` | `id: ID!, message: String!` | `Boolean` |
| **Company** | `createCompany` | `input: CompanyInput!` | `Company` |
| **Company** | `updateCompany` | `id: ID!, input: CompanyInput!` | `Company` |
| **Company** | `deleteCompany` | `id: ID!` | `Boolean` |
| **Form** | `createForm` | `input: FormInput!` | `Form` |
| **Form** | `updateForm` | `id: ID!, input: FormInput!` | `Form` |
| **Form** | `deleteForm` | `id: ID!` | `Boolean` |
| **JAAS** | `createJAASUser` | `input: JAASUserInput!` | `JAASUser` |
| **JAAS** | `updateJAASUser` | `id: ID!, input: JAASUserInput!` | `JAASUser` |
| **JAAS** | `deleteJAASUser` | `id: ID!` | `Boolean` |
| **JAAS** | `createJAASRole` | `input: JAASRoleInput!` | `JAASRole` |
| **JAAS** | `updateJAASRole` | `id: ID!, input: JAASRoleInput!` | `JAASRole` |
| **JAAS** | `deleteJAASRole` | `id: ID!` | `Boolean` |
| **Job** | `createJob` | `input: JobInput!` | `Job` |
| **Job** | `updateJob` | `id: ID!, input: JobInput!` | `Job` |
| **Job** | `deleteJob` | `id: ID!` | `Boolean` |
| **Job** | `subscribeInJob` | `input: SubscribeJobInput!` | `Boolean` |
| **Member** | `createMember` | `input: MemberInput!` | `Member` |
| **Member** | `updateMember` | `id: ID!, input: MemberInput!` | `Member` |
| **Member** | `deleteMember` | `id: ID!` | `Boolean` |
| **Resume** | `createResume` | `input: ResumeInput!` | `Resume` |
| **Resume** | `updateResume` | `id: ID!, input: ResumeInput!` | `Resume` |
| **Resume** | `deleteResume` | `id: ID!` | `Boolean` |
| **Selective Process** | `createSelectiveProcess` | `input: SelectiveProcessInput!` | `SelectiveProcess` |
| **Selective Process** | `updateSelectiveProcess` | `id: ID!, input: SelectiveProcessInput!` | `SelectiveProcess` |
| **Selective Process** | `deleteSelectiveProcess` | `id: ID!` | `Boolean` |
| **Selective Process** | `subscribeInSelectiveProcess` | `input: SubscribeSelectiveProcessInput!` | `Boolean` |
| **Subscriber** | `createSubscriber` | `input: SubscriberInput!` | `Subscriber` |
| **Subscriber** | `updateSubscriber` | `id: ID!, input: SubscriberInput!` | `Subscriber` |
| **Subscriber** | `deleteSubscriber` | `id: ID!` | `Boolean` |
| **Subscriber** | `subscribeMail` | `email: String!` | `Boolean` |
| **Testimonial** | `createTestimonial` | `input: TestimonialInput!` | `Testimonial` |
| **Testimonial** | `updateTestimonial` | `id: ID!, input: TestimonialInput!` | `Testimonial` |
| **Testimonial** | `deleteTestimonial` | `id: ID!` | `Boolean` |
| **User** | `createUser` | `input: UserInput!` | `User` |
| **User** | `updateUser` | `id: ID!, input: UserInput!` | `User` |
| **User** | `deleteUser` | `id: ID!` | `Boolean` |

---

## 2. Matriz de Rastreabilidade Backend GraphQL ➔ Frontends

### 2.1 Módulo: Oportunidades & Recrutamento (Vagas, Candidaturas, Currículos)

| Operação GraphQL | Tipo | Frontend Cliente (`frontend/client`) | Frontend Admin (`frontend/admin`) | Android (`android/`) | Estados Visuais Exigidos |
|---|---|---|---|---|---|
| `allJobsPaginated` | Query | `JobsListView.vue` (`/jobs`) | `AdminJobsView.vue` (`/admin/jobs`) | `JobsListFragment.kt` | Loading spinner, empty list, error alert, pagination bar |
| `listJobRandomFeatured` | Query | `HomeView.vue` (`/`) | — | `HomeFragment.kt` | Shimmer/Skeleton loading, empty state |
| `getJobById` | Query | `JobDetailView.vue` (`/jobs/:id`) | `AdminJobsView.vue` (Modal Edição) | `JobDetailActivity.kt` | Loading spinner, not found message |
| `createJob` | Mutation | `PostJobView.vue` (`/post-job`) | `AdminJobsView.vue` (Modal Novo) | `PostJobActivity.kt` | Button loading, validation errors, success toast |
| `updateJob` | Mutation | `PostJobView.vue` (`/edit-job/:id`) | `AdminJobsView.vue` (Modal Edição) | — | Button loading, success notification |
| `deleteJob` | Mutation | — | `AdminJobsView.vue` (Ação Excluir) | — | Confirm dialog, row loading, success snackbar |
| `subscribeInJob` | Mutation | `JobDetailView.vue` (Botão Candidatar) | — | `JobDetailActivity.kt` (Botão Candidatar) | Button spinner, modal de confirmação, success message |
| `allResumesPaginated` | Query | `CandidatesListView.vue` (`/candidates`)| `AdminResumesView.vue` (`/admin/resumes`)| `CandidatesListFragment.kt` | Loading skeleton, empty search, pagination controls |
| `getResumeById` | Query | `CandidateDetailView.vue` (`/candidates/:id`)| `AdminResumesView.vue` | `CandidateDetailActivity.kt` | Loading spinner, detailed error display |
| `createResume` | Mutation | `PostResumeView.vue` (`/post-resume`) | `AdminResumesView.vue` | `PostResumeActivity.kt` | Form validation, upload progress, success alert |
| `updateResume` | Mutation | `PostResumeView.vue` (`/edit-resume/:id`)| `AdminResumesView.vue` | `PostResumeActivity.kt` | Form validation, update notification |
| `deleteResume` | Mutation | — | `AdminResumesView.vue` | — | Confirm delete dialog, success toast |
| `allSelectiveProcessesPaginated` | Query | `SelectiveProcessesView.vue` | `AdminSelectiveProcessesView.vue` | `SelectiveProcessesFragment.kt` | Table loading, pagination, search filter |
| `mySelectiveProcessesSubscribed` | Query | `MyApplicationsView.vue` | — | `MyApplicationsFragment.kt` | Empty state with CTA, loading skeleton |
| `subscribeInSelectiveProcess` | Mutation | `SelectiveProcessesView.vue` | — | `SelectiveProcessDetailActivity.kt` | Confirm subscription dialog, feedback message |

---

### 2.2 Módulo: Organizações & Gestão de Acesso (Empresas, Usuários, JAAS)

| Operação GraphQL | Tipo | Frontend Cliente (`frontend/client`) | Frontend Admin (`frontend/admin`) | Android (`android/`) | Estados Visuais Exigidos |
|---|---|---|---|---|---|
| `allCompaniesPaginated` | Query | `CompaniesListView.vue` (`/companies`) | `AdminCompaniesView.vue` (`/admin/companies`) | `CompaniesFragment.kt` | Loading overlay, grid cards, pagination |
| `listRandomLogos` | Query | `HomeView.vue` (Carrossel Parceiros) | — | `HomeFragment.kt` | Carousel loading, fallback logo |
| `getCompanyById` | Query | `CompanyDetailView.vue` (`/companies/:id`)| `AdminCompaniesView.vue` | `CompanyDetailActivity.kt` | Header banner loading, company info |
| `createCompany` | Mutation | `RegisterView.vue` / Empresa | `AdminCompaniesView.vue` | `RegisterActivity.kt` | Validation feedback, success redirect |
| `updateCompany` | Mutation | `CompanyProfileView.vue` | `AdminCompaniesView.vue` | — | Toast alert, reactive refresh |
| `deleteCompany` | Mutation | — | `AdminCompaniesView.vue` | — | Confirmation prompt, row dismissal |
| `allUsersPaginated` | Query | — | `AdminUsersView.vue` (`/admin/users`) | — | `v-data-table` loading, search query |
| `createUser` | Mutation | `RegisterView.vue` (`/register`) | `AdminUsersView.vue` | `RegisterActivity.kt` | Password strength feedback, success alert |
| `updateUser` | Mutation | `UserProfileView.vue` | `AdminUsersView.vue` | `ProfileActivity.kt` | Validation state, toast notification |
| `deleteUser` | Mutation | — | `AdminUsersView.vue` | — | Modal de confirmação, feedback visual |
| `allJAASUsersPaginated` | Query | — | `AdminJAASUsersView.vue` | — | DataTable pagination, role chips |
| `allJAASRolesPaginated` | Query | — | `AdminJAASRolesView.vue` | — | DataTable pagination, permissions matrix |
| `createJAASRole` | Mutation | — | `AdminJAASRolesView.vue` | — | Permissions checklist form, success alert |

---

### 2.3 Módulo: Conteúdo & Comunidade (Blog, Depoimentos, Formulários, Estatísticas)

| Operação GraphQL | Tipo | Frontend Cliente (`frontend/client`) | Frontend Admin (`frontend/admin`) | Android (`android/`) | Estados Visuais Exigidos |
|---|---|---|---|---|---|
| `allBlogsPaginated` | Query | `BlogListView.vue` (`/blog`) | `AdminBlogsView.vue` (`/admin/blogs`) | `BlogListFragment.kt` | Card grid skeleton, pagination, tag filter |
| `getBlogById` | Query | `BlogPostView.vue` (`/blog/:id`) | `AdminBlogsView.vue` | `BlogPostActivity.kt` | Article content loading, author bio |
| `createComment` | Mutation | `BlogPostView.vue` (Seção Comentários) | `AdminCommentsView.vue` | `BlogPostActivity.kt` | Button spinner, instant comment prepend |
| `allBlogsCategories` | Query | `BlogListView.vue` (Sidebar) | `AdminBlogsView.vue` | `BlogListFragment.kt` | Category list loading |
| `allTestimonialsPaginated` | Query | `HomeView.vue` / `TestimonialsView.vue` | `AdminTestimonialsView.vue` | `HomeFragment.kt` | Testimonials carousel, rating stars |
| `createTestimonial` | Mutation | `TestimonialModal.vue` | `AdminTestimonialsView.vue` | — | Modal submission, rating input, success alert |
| `createForm` | Mutation | `ContactView.vue` (`/contact`) | `AdminFormsView.vue` | `ContactActivity.kt` | Form validation, captcha, success message |
| `subscribeMail` | Mutation | `TheFooter.vue` (Newsletter) | `AdminSubscribersView.vue` | `HomeFragment.kt` | Email validation, inline success feedback |
| `statisticsCount` | Query | `HomeView.vue` (Contadores) | `AdminDashboardView.vue` (`/admin`) | `HomeFragment.kt` | Number counter animation, stat cards |

---

## 3. Diretrizes de Consumo e Validação

1. **Ausência de Mocks**: Todas as telas e componentes devem utilizar `graphqlClient` conectado a `http://localhost:4000/graphql`.
2. **Configuração de Ambiente**: URL do endpoint configurada via `VITE_GRAPHQL_URL` (Web) e `local.properties` / `BASE_URL` (Android).
3. **Tratamento de Estados**:
   - `loading`: Exibir indicadores visuais claros durante requisições.
   - `error`: Tratar erros de rede e erros de validação GraphQL sem travar a interface.
   - `empty`: Exibir mensagens amigáveis e ações sugeridas quando uma lista estiver vazia.
   - `success`: Atualizar reativamente as listagens após mutations.
