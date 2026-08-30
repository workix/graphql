## Why

Após a conclusão da infraestrutura base na Fase 0, a **Fase 1 — Núcleo Social (MVP)** implementa o coração da experiência social do clone do LinkedIn no ecossistema Workix. Esta fase disponibiliza a rede de contatos profissionais, perfis enriquecidos com currículo social, feed dinâmico de postagens com reações/comentários e chat direto 1:1 entre conexões.

## What Changes

- **Grafo de Conexões de 1º/2º/3º Grau (`connections` & `follows`)**: Tabela de solicitações de conexão (`connection_requests`), tabela de conexões aceitas (`connections`) e tabela de seguidores (`follows`), com resolvers GraphQL para cálculo dinâmico de grau de distância social.
- **Perfil Profissional Estendido (`profiles`)**: Tabela `user_profiles` agregando `headline`, `about`, `banner_url`, `location`, `industry`, flag `open_to_work` e histórico profissional/acadêmico alinhado ao modelo do LinkedIn.
- **Posts, Feed & Reações (`posts`, `post_reactions`, `post_comments`)**: Publicação de posts (texto, imagens via `media_assets`), feed de timeline, reações tipadas (LIKE, CELEBRATE, SUPPORT, LOVE, INSIGHTFUL) e thread de comentários.
- **Mensageria Direta 1:1 (`direct_messages`, `conversations`)**: Conversas diretas entre conexões de 1º grau com entrega instantânea via GraphQL Subscriptions (WebSocket).

## Capabilities

### New Capabilities
- `social-graph-connections`: Gestão de solicitações e conexões profissionais com suporte a cálculo de distância (1º, 2º e 3º grau) e funcionalidade de seguir (Follow).
- `profile-extensions`: Modelo de perfil completo com bio, título profissional, localização, selo Open to Work e banner customizado.
- `posts-feed-interactions`: Sistema completo de publicação de posts, feed social, reações tipadas e comentários encadeados.
- `direct-messaging-chat`: Conversas de mensageria 1:1 com status de leitura e atualização em tempo real via WebSockets.

### Modified Capabilities
<!-- Nenhuma especificação de funcionalidade existente tem seus requisitos funcionais alterados nesta fase -->

## Impact

- **Modelos & Migrations**: Novas tabelas `connection_requests`, `connections`, `follows`, `user_profiles`, `posts`, `post_reactions`, `post_comments`, `conversations`, `direct_messages`.
- **Módulos GraphQL**: Criação de `src/modules/connections`, `src/modules/profiles`, `src/modules/posts`, `src/modules/messaging`.
- **Performance & Índices**: Índices compostos em banco relacional para busca rápida de conexões mútuas e timeline de posts.
