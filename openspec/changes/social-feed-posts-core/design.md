## Context

O backend `graphql` expõe as operações dos módulos `posts` e `hashtags` em `http://localhost:4000/graphql`. Para que os usuários possam usufruir da experiência social e os administradores possam auditar o conteúdo gerado, é necessário construir a camada de consumo cliente (serviços GraphQL, gerenciamento de estado Pinia, componentes de UI e rotas) nas três plataformas.

## Goals / Non-Goals

**Goals:**
- Implementar os serviços `posts.service.ts` e `hashtags.service.ts` consumindo as queries `socialFeed`, `rankedSocialFeed`, `postsByHashtag`, `postReactions`, `postComments` e as mutations `createPost`, `reactToPost`, `commentOnPost`.
- Criar a view `SocialFeedView.vue` no Frontend Cliente com editor de postagens, reações dinâmicas e comentários aninhados, além de `HashtagFeedView.vue`.
- Criar a view `AdminSocialPostsView.vue` no Frontend Admin com Vuetify 3 para moderação de postagens e comentários.
- Estruturar a camada Android (`SocialFeedFragment.kt`, `PostDetailActivity.kt`, `PostsApiService.kt`) para exibição nativa do feed e interações.

**Non-Goals:**
- Chat direto 1:1 e WebSockets em tempo real (fazem parte da Fase 2: Conexões & Mensageria).
- Algoritmos avançados de ranqueamento de feed baseados em grafo social (utiliza os resolvers existentes do backend).

## Decisions

### Decisão 1: Gerenciamento de Estado no Frontend Cliente
- **Decisão**: Utilizar Pinia store (`postsStore.ts`) com estado normalizado de posts e mapa reativo de comentários e reações por post ID.
- **Alternativa**: Gerenciar estado localmente em cada componente. Rejeitada porque a mesma postagem pode ser atualizada em diferentes fluxos (feed geral, feed de hashtag ou perfil).

### Decisão 2: Interações e Reações Otimistas
- **Decisão**: Aplicar atualização otimista na interface do usuário (adicionar contagem de likes e comentários instantaneamente no estado local antes da resposta da mutation GraphQL), revertendo em caso de falha.
- **Alternativa**: Aguardar o ciclo completo de resposta do servidor. Rejeitada para proporcionar a sensação instantânea de rede social moderna.

### Decisão 3: Detecção de Menções e Hashtags
- **Decisão**: Processar expressões regulares no cliente (`/#(\w+)/g` e `/@(\w+)/g`) para formatar links clicáveis de hashtags e menções diretamente no corpo do texto renderizado.

## Risks / Trade-offs

- **[Performance de Feed Longo]**: Renderização de dezenas de cartões com mídia e comentários pode degradar o DOM.
  → *Mitigação*: Paginação com limit/offset e carregamento sob demanda ao rolar a página.
- **[Concorrência de Reações]**: Vários cliques rápidos em reações podem gerar chamadas duplicadas.
  → *Mitigação*: Debounce no botão de reações e bloqueio de cliques concorrentes por post.
