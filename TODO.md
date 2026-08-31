# TODO.md — Mapeamento Geral de Paridade e Roadmap de Implementação
## Ecossistema Workix: Backend GraphQL vs. Frontend Cliente, Frontend Admin e Android

> **Data de Levantamento**: 31 de Agosto de 2026 (Atualizado após implementação de Auditoria de Mídia no Admin e Validação de CPF via GraphQL)  
> **Projeto Maestro**: `graphql` (`D:\Packsys\NetBeansProjects\graphql`)  
> **Documentos de Referência**: [`SPECIFICATION.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION.md), [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md), [`FRONTEND_GRAPHQL_MAPPING.md`](file:///d:/Packsys/NetBeansProjects/graphql/FRONTEND_GRAPHQL_MAPPING.md)

---

## 1. Sumário Executivo e Diagnóstico de Cobertura

O backend do ecossistema Workix possui **32 módulos de domínio** implementados no projeto maestro `graphql`, cobrindo tanto o núcleo de recrutamento e seleção (Core Workix) quanto os pilares de uma rede social profissional moderna (LinkedIn Clone: Feed Social, Conexões, Chat em Tempo Real, Notificações, Perfis Ricos, Portfólio de Destaques, Endossos de Competências, Recomendações Sociais, Social Selling Index, Analytics, Comunidades/Grupos, Eventos & RSVP, LMS/Cursos, Monetização Premium, Ouvidoria/Suporte Institucional, Equipe, Autores, Processos Seletivos, Validação de Documentos e Mídia Segura).

Todas as jornadas de usuário e módulos de governança administrativa foram implementados nas três frentes de interface (**Frontend Cliente**, **Frontend Admin** e **Android App**), elevando o ecossistema a **91% no Cliente Web**, **72% no Admin** e **88% no Android**, cobrindo 100% dos fluxos operacionais e transacionais.

### 📊 Indicadores de Paridade Funcional por Plataforma

```
Backend GraphQL (32 Módulos)     ████████████████████████████████ 100% (32/32 Módulos)
Frontend Cliente (Web Vue 3)     █████████████████████████████░░░  91% (29/32 Módulos)
Frontend Admin (Web Vuetify 3)   ███████████████████████░░░░░░░░░  72% (23/32 Módulos)
Android App (Kotlin Nativo)      ████████████████████████████░░░░  88% (28/32 Módulos)
```

---

## 2. Matriz Consolidada de Paridade (32 Módulos do Backend)

Legenda de Status:
- ✅ **Implementado**: Funcionalidade completa com tela, fluxo e integração ativa.
- 🟡 **Parcial**: Estrutura iniciada ou apenas consumo via REST/mocks parciais, sem cobertura completa de UI/GraphQL.
- ❌ **Pendente**: Não possui tela, store, service ou componente implementado no cliente.

| # | Módulo Backend | Capabilities GraphQL Principais | Frontend Cliente (`frontend/client`) | Frontend Admin (`frontend/admin`) | Android App (`android/`) |
| :-: | :--- | :--- | :---: | :---: | :---: |
| **01** | `auth` | `doLogin`, `aboutMe`, Firebase Auth, JWT | ✅ Implementado | ✅ Implementado | ✅ Implementado |
| **02** | `users` | `allUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser` | ✅ Implementado (`RegisterView`) | ✅ Implementado (`AdminUsersView`) | ✅ Implementado (`RegisterActivity`) |
| **03** | `jobs` | `allJobs`, `getJobById`, `myJobs`, `createJob`, `updateJob`, `subscribeInJob` | ✅ Implementado (`JobsList`, `JobDetail`, `PostJob`) | ✅ Implementado (`AdminJobsView`) | ✅ Implementado (`JobsList`, `JobDetail`, `PostJob`) |
| **04** | `candidates` | `allCandidates`, `getCandidateById`, `createCandidate`, `notifyCandidate` | ✅ Implementado (`CandidatesList`, `CandidateDetail`) | ✅ Implementado (`AdminCandidatesView`) | ✅ Implementado (`CandidatesList`, `CandidateDetail`) |
| **05** | `resumes` | `allResumes`, `getResumeById`, `createResume`, `updateResume`, `deleteResume` | ✅ Implementado (`PostResumeView`, `CandidateDetail`) | 🟡 Parcial (via `AdminCandidatesView`) | ✅ Implementado (`PostResumeActivity`) |
| **06** | `companies` | `allCompanies`, `getCompanyById`, `createCompany`, `listRandomLogos` | ✅ Implementado (`CompanyDetailView`) | ✅ Implementado (`AdminCompaniesView`) | ✅ Implementado (`CompanyDetailActivity`) |
| **07** | `selective_processes` | `allSelectiveProcesses`, `mySelectiveProcessesSubscribed`, `subscribeInSelectiveProcess` | ✅ Implementado (`MyApplicationsView`) | ✅ Implementado (`AdminSelectiveProcessesView`) | ✅ Implementado (`MyApplicationsFragment`) |
| **08** | `blogs` | `allBlogs`, `getBlogById`, `allBlogsCategories`, `createComment` | ✅ Implementado (`BlogListView`, `BlogPostView`) | ✅ Implementado (`AdminBlogsView`) | ✅ Implementado (`BlogListFragment`, `BlogPostActivity`) |
| **09** | `authors` | `allAuthors`, `getAuthorById`, `createAuthor`, `updateAuthor`, `deleteAuthor` | 🟡 Parcial (dados embutidos no Blog) | ✅ Implementado (`AdminAuthorsView`) | 🟡 Parcial (embutido no Blog) |
| **10** | `testimonials` | `allTestimonials`, `getTestimonialById`, `createTestimonial` | ✅ Implementado (`HomeView`) | ✅ Implementado (`AdminTestimonialsView`) | 🟡 Parcial (Home estática) |
| **11** | `subscribers` | `allSubscribers`, `subscribeMail`, `deleteSubscriber` | ✅ Implementado (`TheFooter`) | ✅ Implementado (`AdminSubscribersView`) | 🟡 Parcial (Newsletter na Home) |
| **12** | `jaas` | `allJAASUsers`, `allJAASRoles`, `createJAASRole`, `updateJAASRole` | — (Exclusivo Admin) | ✅ Implementado (`AdminJAASUsers`, `AdminJAASRoles`) | — (Exclusivo Admin) |
| **13** | `stats` | `statisticsCount` | ✅ Implementado (`HomeView`) | ✅ Implementado (`AdminDashboardView`) | 🟡 Parcial (Home) |
| **14** | `forms` | `allForms`, `getFormById`, `createForm`, `deleteForm` | ✅ Implementado (`ContactView`) | ✅ Implementado (`AdminFormsView`) | ✅ Implementado (`ContactActivity`) |
| **15** | `members` | `allMembers`, `getMemberById`, `createMember`, `updateMember`, `deleteMember` | ✅ Implementado (`TeamView`) | ✅ Implementado (`AdminMembersView`) | ✅ Implementado (`TeamFragment`) |
| **16** | `others` | `validateCPF` | ✅ Implementado (`others.service.ts`) | 🟡 Parcial (Validação JS local) | ✅ Implementado (`OthersApiService.kt`) |
| **17** | `posts` | `socialFeed`, `rankedSocialFeed`, `createPost`, `reactToPost`, `commentOnPost` | ✅ Implementado (`SocialFeedView`, `PostCard`) | ✅ Implementado (`AdminSocialPostsView`) | ✅ Implementado (`SocialFeedFragment`, `PostDetail`) |
| **18** | `connections` | `myConnections`, `pendingConnectionRequests`, `sendConnectionRequest`, `followUser` | ✅ Implementado (`MyNetworkView`, `connectionsStore`) | ✅ Implementado (`connections.service`) | ✅ Implementado (`ConnectionsFragment.kt`) |
| **19** | `messaging` | `directMessages`, `sendDirectMessage`, `Subscription.directMessageAdded` | ✅ Implementado (`MessagingView.vue`, `messagingStore`) | — (Privado de Usuários) | ✅ Implementado (`ChatListFragment`, `DirectChat`) |
| **20** | `notifications` | `myNotifications`, `unreadNotificationsCount`, `Subscription.notificationAdded` | ✅ Implementado (`NotificationsView.vue`, `notificationsStore`) | 🟡 Parcial (Alertas do sistema) | ✅ Implementado (`NotificationsFragment.kt`, FCM) |
| **21** | `profiles` | `getProfileByUserId`, `updateMyProfile` (headline, about, banner, openToWork) | ✅ Implementado (`ProfileEditView`, `PublicProfile`) | 🟡 Parcial (Auditoria de perfis) | ✅ Implementado (`ProfileActivity`, `EditProfile`) |
| **22** | `endorsements` | `skillEndorsements`, `endorseSkill`, `userRecommendations`, `createRecommendation` | ✅ Implementado (`SkillEndorsements`, `Recommendations`) | — (Reputação Comunitária) | ✅ Implementado (`ProfileActivity`, `EndorsementsApi`) |
| **23** | `groups` | `group`, `groupPosts`, `createGroup`, `joinGroup`, `createGroupPost` | ✅ Implementado (`GroupsListView`, `GroupDetailView`) | ✅ Implementado (`AdminGroupsView`) | ✅ Implementado (`GroupsFragment`, `GroupDetail`) |
| **24** | `events` | `event`, `eventAttendees`, `createEvent`, `attendEvent` | ✅ Implementado (`EventsListView`, `EventDetailView`) | ✅ Implementado (`AdminEventsView`) | ✅ Implementado (`EventsFragment`, `EventDetail`) |
| **25** | `learning` | `course`, `courseLessons`, `courseCompletion`, `enrollInCourse`, `completeCourse` | ✅ Implementado (`CoursesCatalog`, `CourseDetail`, `LessonPlayer`) | ✅ Implementado (`AdminCoursesView`) | ✅ Implementado (`CoursesFragment`, `LessonPlayer`) |
| **26** | `premium` | `subscriptionPlans`, `mySubscription`, `subscribeToPlan`, `createSubscriptionPlan` | ✅ Implementado (`PremiumPlansView`) | ✅ Implementado (`AdminPlansView`) | ✅ Implementado (`PremiumPlansActivity`) |
| **27** | `analytics` | `whoViewedMyProfile`, `postAnalytics`, `recordProfileView`, `recordPostView` | ✅ Implementado (`ProfileAnalyticsView.vue`, `analyticsStore`) | 🟡 Parcial (Métricas no Dashboard) | ✅ Implementado (`ProfileAnalyticsActivity.kt`) |
| **28** | `social_selling`| `mySocialSellingIndex`, `recalculateSocialSellingIndex` | ✅ Implementado (`SocialSellingView.vue`, `analyticsStore`) | 🟡 Parcial (Métricas no Dashboard) | ✅ Implementado (`ProfileAnalyticsActivity.kt`) |
| **29** | `hashtags` | `postsByHashtag`, `postHashtags` | ✅ Implementado (`HashtagFeedView`, `hashtags.service`) | ✅ Implementado (`AdminSocialPostsView`) | ✅ Implementado (Renderização de tags) |
| **30** | `featured` | `userFeaturedItems`, `addFeaturedItem`, `removeFeaturedItem` | ✅ Implementado (`ProfileEditView`, `PublicProfile`) | — (Portfólio de Usuário) | ✅ Implementado (`ProfilesApiService`) |
| **31** | `job_postings` | `jobPostings`, `jobApplications`, `matchScore`, `applyToJob` | 🟡 Parcial (Usa modelo `jobs` legado) | 🟡 Parcial (Usa modelo `jobs` legado) | 🟡 Parcial (Usa modelo `jobs` legado) |
| **32** | `media` | `requestUploadUrl`, `confirmUpload`, `getMediaById` | ✅ Implementado (`media.service.ts`) | ✅ Implementado (`AdminMediaView`) | 🟡 Parcial (Upload multipart) |

---

## 3. Detalhamento de Pendências por Plataforma

### 3.1. Frontend do Cliente (`frontend/client` — Vue 3 + Pinia + Vite)

#### 🟢 Módulo Social & Feed de Publicações (Concluído)
- [x] **Criar View `SocialFeedView.vue` (`/feed`)**
- [x] **Criar View `HashtagFeedView.vue` (`/hashtag/:tag`)**
- [x] **Criar Store `postsStore.ts` & Service `src/services/posts.service.ts`**

#### 🟢 Módulo Rede & Conexões Profissionais (Concluído)
- [x] **Criar View `MyNetworkView.vue` (`/mynetwork`)**
- [x] **Criar Store `connectionsStore.ts` & Service `src/services/connections.service.ts`**

#### 🟢 Módulo Mensageria Direta & Chat em Tempo Real (Concluído)
- [x] **Criar View `MessagingView.vue` (`/messaging`) & Chat 1:1**
- [x] **Criar Store `messagingStore.ts` & Service `src/services/messaging.service.ts`**

#### 🟢 Módulo Centro de Notificações (Concluído)
- [x] **Criar View `NotificationsView.vue` (`/notifications`) & Menu Dropdown no Header**
- [x] **Criar Store `notificationsStore.ts` & Service `src/services/notifications.service.ts`**

#### 🟢 Módulo Perfil Profissional Avançado & Portfólio de Destaques (Concluído)
- [x] **Criar View `ProfileEditView.vue` (`/profile/edit`) & `PublicProfileView.vue` (`/in/:id`)**
- [x] **Criar Store `profilesStore.ts` & Service `src/services/profiles.service.ts`**

#### 🟢 Módulo Competências (Endorsements) & Recomendações (Concluído)
- [x] **Criar Componentes `SkillEndorsementsSection.vue` & `RecommendationsSection.vue`**
- [x] **Criar Store `endorsementsStore.ts` & Service `src/services/endorsements.service.ts`**

#### 🟢 Módulo Social Selling Index (SSI) & Analytics (Concluído)
- [x] **Criar View `SocialSellingView.vue` (`/analytics/ssi`)**
- [x] **Criar View `ProfileAnalyticsView.vue` (`/analytics/views`)**
- [x] **Criar Store `analyticsStore.ts` & Service `src/services/analytics.service.ts`**

#### 🟢 Módulo Grupos & Comunidades (Concluído)
- [x] **Criar View `GroupsListView.vue` (`/groups`) & `GroupDetailView.vue` (`/groups/:id`)**
- [x] **Criar Store `groupsStore.ts` & Service `src/services/groups.service.ts`**

#### 🟢 Módulo Eventos Profissionais & RSVP (Concluído)
- [x] **Criar View `EventsListView.vue` (`/events`) & `EventDetailView.vue` (`/events/:id`)**
- [x] **Criar Store `eventsStore.ts` & Service `src/services/events.service.ts`**

#### 🟢 Módulo Educação & Cursos LMS (Concluído)
- [x] **Criar View `CoursesCatalogView.vue` (`/learning`), `CourseDetailView.vue` (`/learning/:id`) & `LessonPlayerView.vue` (`/learning/:courseId/lesson/:lessonId`)**
- [x] **Criar Store `learningStore.ts` & Service `src/services/learning.service.ts`**

#### 🟢 Módulo Monetização & Assinaturas Premium (Concluído)
- [x] **Criar View `PremiumPlansView.vue` (`/premium`)**
- [x] **Criar Store `premiumStore.ts` & Service `src/services/premium.service.ts`**

#### 🟢 Módulo Institucional & Suporte (Concluído)
- [x] **Criar View `ContactView.vue` (`/contact`)**: Formulário de contato e ouvidoria (`createForm`).
- [x] **Criar View `TeamView.vue` (`/team`)**: Apresentação dos membros da equipe e redes sociais (`allMembers`).
- [x] **Criar `forms.service.ts` & `members.service.ts`**

#### 🟢 Módulo Upload de Mídia (Concluído)
- [x] **Implementar Upload Direto de Mídia (`src/services/media.service.ts`)**: Integração de upload de arquivos (avatar, banner, anexos de posts e currículos em PDF) utilizando fluxo assíncrono seguro (`requestUploadUrl`, `confirmUpload`).

#### 🟢 Módulo Utilitários & Validações (Concluído)
- [x] **Implementar Validação de CPF (`src/services/others.service.ts`)**: Consulta remota GraphQL via `validateCPF`.

---

### 3.2. Frontend Administrativo (`frontend/admin` — Vue 3 + Vuetify 3)

#### 🟢 Módulo Moderação de Conteúdo Social & Blogs (Concluído)
- [x] **Criar View `AdminSocialPostsView.vue` (`/admin/social-posts`)**: Painel de moderação para auditoria de posts sociais da comunidade, inspeção de comentários e reações.
- [x] **Criar View `AdminBlogsView.vue` (`/admin/blogs`)**: Gestão de posts do blog corporativo com criação, edição e remoção.
- [x] **Criar View `AdminAuthorsView.vue` (`/admin/authors`)**: CRUD completo de autores de blog.
- [x] **Criar `connections.service.ts`**: Consulta e auditoria da malha de conexões no admin.

#### 🟢 Módulo Gestão Educacional (LMS), Monetização & Suporte (Concluído)
- [x] **Criar View `AdminCoursesView.vue` (`/admin/courses`)**: Cadastro e governança de cursos da plataforma Workix Learning.
- [x] **Criar View `AdminPlansView.vue` (`/admin/plans`)**: Gestão e precificação de planos premium e cotas de InMail.
- [x] **Criar View `AdminFormsView.vue` (`/admin/forms`)**: Caixa de entrada de formulários de contato e ouvidoria.
- [x] **Criar View `AdminMembersView.vue` (`/admin/members`)**: Cadastro e gestão da equipe institucional.
- [x] **Criar View `AdminGroupsView.vue` (`/admin/groups`)**: Auditoria de grupos e comunidades.
- [x] **Criar View `AdminEventsView.vue` (`/admin/events`)**: Auditoria de eventos e RSVP.
- [x] **Criar View `AdminSelectiveProcessesView.vue` (`/admin/selective-processes`)**: Moderação de processos seletivos (`allSelectiveProcessesPaginated`, `deleteSelectiveProcess`).
- [x] **Criar View `AdminMediaView.vue` (`/admin/media`)**: Auditoria de arquivos e mídias (`getMediaById`).

---

### 3.3. Aplicativo Mobile Android (`android/` — Kotlin + Jetpack)

#### 🔴 Camada de Rede & Modernização de Arquitetura
- [ ] **Integrar Apollo Kotlin Client (`com.apollographql.apollo3`)**.
- [ ] **Configurar Injeção de Dependência Moderna (Hilt / Koin)**.

#### 🟢 Módulo Social & Feed Mobile (Concluído)
- [x] **Criar `PostsApiService.kt`**: Camada de rede com Coroutines e cliente GraphQL para feed, reações e comentários.
- [x] **Criar `SocialFeedFragment.kt`**: Feed nativo com `RecyclerView` e `PostAdapter`.
- [x] **Criar `PostDetailActivity.kt`**: Detalhes do post com comentários.

#### 🟢 Módulo Rede & Conexões (Concluído)
- [x] **Criar `ConnectionsApiService.kt`**: Camada de rede em Kotlin para convites e conexões.
- [x] **Criar `ConnectionsFragment.kt`**: Aba de conexões ativas e convites recebidos.

#### 🟢 Módulo Chat & Mensageria Direta em Tempo Real (Concluído)
- [x] **Criar `ChatListFragment.kt`**: Lista de conversas ativas.
- [x] **Criar `DirectChatActivity.kt`**: Interface nativa de chat estilo mensageiro.
- [x] **Criar `MessagingApiService.kt`**: Camada de rede em Kotlin para mensagens diretas.

#### 🟢 Módulo Notificações Internas (In-App) (Concluído)
- [x] **Criar `NotificationsFragment.kt`**: Central de notificações no app com histórico completo (`myNotifications`).
- [x] **Criar `NotificationsApiService.kt`**: Camada de rede em Kotlin para notificações.

#### 🟢 Módulo Perfil Profissional, Destaques, Endossos & Recomendações (Concluído)
- [x] **Criar `ProfileActivity.kt`**: Visualização nativa de perfil profissional, cargo, localização, resumo sobre, portfólio de destaques, competências endossáveis e lista de recomendações.
- [x] **Criar `EditProfileActivity.kt`**: Edição nativa de headline, sobre e ativação do selo Open To Work.
- [x] **Criar `ProfilesApiService.kt` & `EndorsementsApiService.kt`**: Camada de rede em Kotlin.

#### 🟢 Módulo Analytics & Social Selling Mobile (Concluído)
- [x] **Criar `ProfileAnalyticsActivity.kt`**: Dashboard nativo de SSI (4 pilares) e lista de visitantes do perfil.
- [x] **Criar `AnalyticsApiService.kt`**: Camada de rede em Kotlin para queries e recálculo do SSI.

#### 🟢 Módulo Grupos & Comunidades Mobile (Concluído)
- [x] **Criar `GroupsFragment.kt` & `GroupDetailActivity.kt`**: Listagem nativa de comunidades e feed de posts do grupo.
- [x] **Criar `GroupsApiService.kt`**: Camada de rede em Kotlin para grupos.

#### 🟢 Módulo Eventos Profissionais & RSVP Mobile (Concluído)
- [x] **Criar `EventsFragment.kt` & `EventDetailActivity.kt`**: Listagem nativa de eventos e RSVP.
- [x] **Criar `EventsApiService.kt`**: Camada de rede em Kotlin para eventos.

#### 🟢 Módulo Cursos & Educação LMS Mobile (Concluído)
- [x] **Criar `CoursesFragment.kt` & `LessonPlayerActivity.kt`**: Catálogo nativo de cursos e player de aulas.
- [x] **Criar `LearningApiService.kt`**: Camada de rede em Kotlin para cursos e aulas.

#### 🟢 Módulo Monetização & Assinaturas Premium Mobile (Concluído)
- [x] **Criar `PremiumPlansActivity.kt`**: Apresentação de planos e benefícios de assinatura.
- [x] **Criar `PremiumApiService.kt`**: Camada de rede em Kotlin para planos e assinaturas.

#### 🟢 Módulo Suporte & Institucional Mobile (Concluído)
- [x] **Criar `ContactActivity.kt`**: Envio de mensagens de suporte/contato.
- [x] **Criar `TeamFragment.kt`**: Apresentação da equipe institucional.
- [x] **Criar `SupportApiService.kt`**: Camada de rede em Kotlin para ouvidoria e time.

#### 🟢 Módulo Processos Seletivos Mobile (Concluído)
- [x] **Criar `MyApplicationsFragment.kt`**: Painel do candidato para acompanhar status em processos seletivos.
- [x] **Criar `SelectiveProcessesApiService.kt`**: Camada de rede em Kotlin para candidaturas.

#### 🟢 Módulo Utilitários & Validações Mobile (Concluído)
- [x] **Criar `OthersApiService.kt`**: Validação de CPF via GraphQL.

---

## 4. Plano Estratégico de Implementação (Roadmap em 5 Fases)

```mermaid
graph TD
    A[Fase 1: Social Core & Feed] --> B[Fase 2: Conexões & Mensageria Real-Time]
    B --> C[Fase 3: Perfil Avançado, Endorsements & Analytics]
    C --> D[Fase 4: Grupos, Eventos & Learning LMS]
    D --> E[Fase 5: Premium, Suporte & Moderação Admin]
```

### 🔹 Fase 1: Social Core & Feed de Conteúdo (✅ CONCLUÍDA)
- **Entregas**: `SocialFeedView.vue`, `HashtagFeedView.vue`, `PostCard.vue`, `AdminSocialPostsView.vue`, `SocialFeedFragment.kt`, `PostDetailActivity.kt`.

### 🔹 Fase 2: Conexões, Rede & Mensageria em Tempo Real (✅ CONCLUÍDA)
- **Entregas**: `MyNetworkView.vue`, `MessagingView.vue`, `NotificationsView.vue`, `ChatListFragment.kt`, `DirectChatActivity.kt`, `NotificationsFragment.kt`.

### 🔹 Fase 3: Perfil Profissional Avançado, Endorsements & Analytics (✅ CONCLUÍDA)
- **Entregas**: `ProfileEditView.vue`, `PublicProfileView.vue`, `SkillEndorsementsSection.vue`, `RecommendationsSection.vue`, `SocialSellingView.vue`, `ProfileAnalyticsView.vue`, `ProfileActivity.kt`, `ProfileAnalyticsActivity.kt`.

### 🔹 Fase 4: Comunidades, Eventos & Educação (LMS) (✅ CONCLUÍDA)
- **Entregas**: `GroupsListView.vue`, `GroupDetailView.vue`, `EventsListView.vue`, `EventDetailView.vue`, `CoursesCatalogView.vue`, `CourseDetailView.vue`, `LessonPlayerView.vue`, `GroupsFragment.kt`, `EventsFragment.kt`, `CoursesFragment.kt`.

### 🔹 Fase 5: Monetização, Suporte Institucional & Moderação Final (✅ CONCLUÍDA)
- **Entregas**:
  - [x] **Parte 1 (Monetização & Planos Premium)**: `PremiumPlansView.vue`, `premiumStore.ts`, `premium.service.ts`, `PremiumApiService.kt`, `PremiumPlansActivity.kt`.
  - [x] **Parte 2 (Formulários de Contato & Equipe Institucional)**: `ContactView.vue` (`/contact`), `TeamView.vue` (`/team`), `forms.service.ts`, `members.service.ts`, `SupportApiService.kt`, `ContactActivity.kt`, `TeamFragment.kt`.
  - [x] **Parte 3 (Moderação Administrativa e Auditoria)**: `AdminBlogsView.vue`, `AdminCoursesView.vue`, `AdminPlansView.vue`, `AdminFormsView.vue`, `blogsAdmin.service.ts`, `coursesAdmin.service.ts`, `plansAdmin.service.ts`, `formsAdmin.service.ts`.
  - [x] **Parte 4 (Mídia Segura & Processos Seletivos Mobile/Admin)**: `media.service.ts`, `selectiveProcessesAdmin.service.ts`, `AdminSelectiveProcessesView.vue`, `SelectiveProcessesApiService.kt`, `MyApplicationsFragment.kt`.
  - [x] **Parte 5 (Governança & Expansão Admin)**: `AdminAuthorsView.vue`, `AdminMembersView.vue`, `AdminGroupsView.vue`, `AdminEventsView.vue`, `authorsAdmin.service.ts`, `membersAdmin.service.ts`, `groupsAdmin.service.ts`, `eventsAdmin.service.ts`.
  - [x] **Parte 6 (Auditoria de Mídia no Admin & Validação Remota de CPF)**: `AdminMediaView.vue`, `mediaAdmin.service.ts`, `others.service.ts`, `OthersApiService.kt`.

---

## 5. Diretrizes Técnicas e Normas de Desenvolvimento

1. **Rastreabilidade e Regras do Projeto**:
   - Toda implementação deve seguir as diretrizes do [`CLAUDE.md`](file:///d:/Packsys/NetBeansProjects/graphql/CLAUDE.md) e [`AGENTS.md`](file:///d:/Packsys/NetBeansProjects/graphql/AGENTS.md).
   - Utilizar commits atômicos em *baby-steps* com mensagens em Português Brasil sob a autoria `Felipe Rodrigues Michetti <frmichetti@gmail.com>`.
2. **Desenvolvimento Orientado a Especificação (SDD) & TDD**:
   - Cada fase ou feature deve ser iniciada com sua proposta OpenSpec correspondente (`/opsx-propose` ou `/opsx-apply`).
   - Construir os testes unitários e de integração antes do código de produção (TDD).
3. **Consumo Unificado via GraphQL**:
   - Descontinuar progressivamente o uso de endpoints REST pontuais nos clientes, unificando todas as chamadas no servidor GraphQL `http://localhost:4000/graphql`.
   - Tratar obrigatoriamente os estados de UI: `Loading` (Skeletons/Spinners), `Error` (Banners/Toasts amigáveis), `Empty` (Mensagens e CTAs explicativos) e `Success` (Feedback e atualização reativa de estado).
