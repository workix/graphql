## Why

O backend GraphQL já implementou os módulos `posts` (`socialFeed`, `rankedSocialFeed`, `createPost`, `reactToPost`, `commentOnPost`) e `hashtags` (`postsByHashtag`, `postHashtags`). No entanto, conforme diagnosticado no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md), as interfaces de usuário ainda não possuem telas e serviços para permitir que os usuários interajam no Feed Social, criem postagens, reajam com emojis/reações, comentem e descubram publicações por hashtags.

Esta proposta formaliza a especificação, o design técnico e as tarefas atômicas para a implementação da experiência de Feed Social nos clientes Web e Mobile.

## What Changes

- **Frontend Cliente (`frontend/client`)**:
  - Criação do serviço `src/services/posts.service.ts` e store Pinia `src/stores/posts.ts` para consumo das queries `socialFeed`, `rankedSocialFeed`, `postsByHashtag` e mutations `createPost`, `reactToPost`, `commentOnPost`.
  - Criação da view principal do Feed Social `SocialFeedView.vue` (`/feed`) com scroll virtual, caixa de postagem rica, barra de reações dinâmicas e comentários aninhados.
  - Criação da view de exploração de hashtags `HashtagFeedView.vue` (`/hashtag/:tag`).
- **Frontend Admin (`frontend/admin`)**:
  - Criação do serviço `src/services/socialPosts.service.ts` e view `AdminSocialPostsView.vue` (`/admin/social-posts`) para auditoria e moderação de postagens sociais e comentários.
- **Android App (`android/`)**:
  - Criação do `PostsApiService` / Apollo Queries para posts e reações.
  - Criação do fragmento nativo `SocialFeedFragment.kt` e activity `PostDetailActivity.kt`.

## Capabilities

### New Capabilities
- `social-feed-posts-core`: Implementação completa de Feed Social, criação de postagens, reações dinâmicas (Like, Celebrate, Support, Love, Insightful, Funny), comentários aninhados e exploração de hashtags em Frontend Cliente, Frontend Admin e Android.

### Modified Capabilities
<!-- Nenhuma capability existente tem seus requisitos modificados. -->

## Impact

- **Frontend Cliente**: Adiciona nova rota `/feed` e `/hashtag/:tag` no Vue Router e na barra de navegação principal.
- **Frontend Admin**: Adiciona nova rota `/admin/social-posts` no menu lateral do Vuetify 3 para moderação.
- **Android**: Adiciona aba de Feed Social no `BottomNavigationView` da `MainActivity`.
- **APIs**: Consumo intensivo das operações GraphQL dos módulos `posts` e `hashtags`.
