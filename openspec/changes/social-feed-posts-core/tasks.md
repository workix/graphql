## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/posts.service.ts` para queries e mutations de posts, comentários e reações
- [ ] 1.2 Criar `frontend/client/src/services/hashtags.service.ts` para consulta de posts por hashtag
- [ ] 1.3 Criar `frontend/client/src/stores/posts.ts` para gerenciamento do feed, reações e paginação

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar componente `PostCard.vue` com autor, mídia, formatador de hashtags/menções e contador de reações
- [ ] 2.2 Criar componente `PostReactionsBar.vue` com seletor de emojis de reações (Like, Celebrate, Support, Love, Insightful, Funny)
- [ ] 2.3 Criar componente `PostCommentsSection.vue` para listar e adicionar comentários em tempo real
- [ ] 2.4 Criar `frontend/client/src/views/SocialFeedView.vue` (`/feed`) com caixa de publicação e scroll infinito
- [ ] 2.5 Criar `frontend/client/src/views/HashtagFeedView.vue` (`/hashtag/:tag`) e registrar as rotas no Vue Router

## 3. Frontend Admin: Moderação

- [ ] 3.1 Criar `frontend/admin/src/services/socialPosts.service.ts` para consulta e moderação administrativa
- [ ] 3.2 Criar `frontend/admin/src/views/AdminSocialPostsView.vue` (`/admin/social-posts`) no Vuetify 3 com ações de auditoria
- [ ] 3.3 Adicionar rota e item de menu no layout do Admin para Moderação de Posts

## 4. Android: Mapeamento e Implementação Mobile

- [ ] 4.1 Criar `PostsApiService.kt` no módulo de rede do Android para chamadas GraphQL de feed e reações
- [ ] 4.2 Criar `SocialFeedFragment.kt` com `RecyclerView` e `PostAdapter` para exibição nativa do feed
- [ ] 4.3 Criar `PostDetailActivity.kt` para leitura de post completo e comentários no Android

## 5. Validação e Testes

- [ ] 5.1 Adicionar testes unitários para o `posts.service.ts` e `postsStore.ts`
- [ ] 5.2 Validar conformidade da proposta via `openspec validate social-feed-posts-core`
