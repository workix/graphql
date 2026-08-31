## 1. Auditoria e Consolidação do Documento TODO.md

- [ ] 1.1 Gerar o documento `TODO.md` na raiz do projeto com o inventário completo das 32 capabilities do backend
- [ ] 1.2 Estruturar a matriz comparativa de paridade com percentuais de cobertura por plataforma (Cliente, Admin, Android)
- [ ] 1.3 Detalhar as queries, mutations e subscriptions disponíveis no backend versus o status em cada cliente

## 2. Levantamento Detalhado: Frontend Cliente (`frontend/client`)

- [ ] 2.1 Mapear views e stores para Feed Social, Postagens, Reações e Comentários (`SocialFeedView.vue`, `posts.service.ts`)
- [ ] 2.2 Mapear views e stores para Conexões, Rede e Seguidores (`MyNetworkView.vue`, `connections.service.ts`)
- [ ] 2.3 Mapear módulo de Mensageria Direta e Chat em Tempo Real com GraphQL Subscription (`MessagingView.vue`, `messaging.service.ts`)
- [ ] 2.4 Mapear Centro de Notificações persistente e badge de não-lidas (`NotificationsView.vue`, `notifications.service.ts`)
- [ ] 2.5 Mapear Perfil Profissional Avançado, Endorsements, Recomendações e SSI (`ProfileEditView.vue`, `SocialSellingView.vue`)
- [ ] 2.6 Mapear Módulos de Grupos, Eventos, Cursos/LMS e Planos Premium (`GroupsView.vue`, `EventsView.vue`, `CoursesView.vue`, `PremiumPlansView.vue`)

## 3. Levantamento Detalhado: Frontend Admin (`frontend/admin`)

- [ ] 3.1 Mapear telas administrativas pendentes para Moderação de Posts Sociais, Comentários e Hashtags (`AdminPostsView.vue`, `AdminCommentsView.vue`)
- [ ] 3.2 Mapear telas administrativas para Blogs, Autores e Membros (`AdminBlogsView.vue`, `AdminAuthorsView.vue`, `AdminMembersView.vue`)
- [ ] 3.3 Mapear módulo de Gestão de Cursos e Aulas LMS (`AdminCoursesView.vue`, `AdminLessonsView.vue`)
- [ ] 3.4 Mapear módulo de Gestão de Grupos, Eventos e Moderação de Comunidade (`AdminGroupsView.vue`, `AdminEventsView.vue`)
- [ ] 3.5 Mapear módulo de Gestão de Planos de Assinatura Premium e Faturamento (`AdminPlansView.vue`, `AdminSubscriptionsView.vue`)
- [ ] 3.6 Mapear telas para Gestão de Formulários de Contato e Processos Seletivos (`AdminFormsView.vue`, `AdminSelectiveProcessesView.vue`)

## 4. Levantamento Detalhado: Aplicativo Mobile Android (`android/`)

- [ ] 4.1 Mapear introdução da biblioteca Apollo Kotlin e cliente GraphQL com suporte a Subscriptions/WebSockets
- [ ] 4.2 Mapear telas nativas para Feed Social, Criação de Post, Reações e Comentários (`SocialFeedFragment.kt`, `PostDetailActivity.kt`)
- [ ] 4.3 Mapear telas nativas para Conexões, Convites e Busca de Rede (`ConnectionsFragment.kt`, `UserNetworkActivity.kt`)
- [ ] 4.4 Mapear telas nativas para Chat em Tempo Real e Mensageria Direta (`ChatListFragment.kt`, `DirectChatActivity.kt`)
- [ ] 4.5 Mapear tela nativa para Centro de Notificações interno com histórico (`NotificationsFragment.kt`)
- [ ] 4.6 Mapear tela nativa de Perfil Profissional Avançado, Skills, Endorsements e Open To Work (`ProfileActivity.kt`)
- [ ] 4.7 Mapear telas nativas para Grupos, Eventos, Catálogo de Cursos LMS e Assinatura Premium

## 5. Validação e Homologação da Mudança

- [ ] 5.1 Validar a integridade da mudança OpenSpec via `openspec validate`
- [ ] 5.2 Revisar o documento `TODO.md` garantindo total consistência com `SPECIFICATION.md` e `SPECIFICATION_LINKEDIN.md`
