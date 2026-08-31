## Purpose

Especifica o comportamento, fluxos de interface e regras de consumo para o Feed Social, criação de publicações, reações dinâmicas, comentários e navegação por hashtags nos clientes Frontend e Android.

## ADDED Requirements

### Requirement: Visualização e Paginação do Feed Social
O sistema SHALL permitir que usuários autenticados visualizem a linha do tempo do feed social, exibindo postagens de autores e conexões ordenadas cronologicamente ou por relevância via queries `socialFeed` e `rankedSocialFeed`, com suporte a paginação contínua (scroll infinito).

#### Scenario: Carregamento do feed social com sucesso
- **WHEN** o usuário autenticado acessa a rota `/feed` no Frontend ou a aba Feed no Android
- **THEN** o sistema deve renderizar os cartões de postagem com autor, data formatada, conteúdo textual, mídia anexada, contadores de reações e comentários.

### Requirement: Publicação de Posts com Mídia e Menções
O sistema SHALL disponibilizar uma interface de composição para criação de novas postagens via mutation `createPost`, permitindo texto livre, identificadores de mídia (`mediaIds`) e marcação de outros usuários (`mentionedUserIds`).

#### Scenario: Criação de postagem bem-sucedida
- **WHEN** o usuário digita um texto na caixa de postagem e clica no botão "Publicar"
- **THEN** o sistema envia a mutation `createPost`, limpa o formulário e insere a nova postagem no topo do feed reativamente.

### Requirement: Reações Dinâmicas em Postagens
O sistema SHALL permitir que o usuário expresse reações (ex.: `LIKE`, `CELEBRATE`, `SUPPORT`, `LOVE`, `INSIGHTFUL`, `FUNNY`) em qualquer postagem do feed via mutation `reactToPost`, exibindo o estado ativo da reação do usuário logado.

#### Scenario: Alternância de reação no post
- **WHEN** o usuário seleciona uma reação em uma postagem
- **THEN** o sistema registra a reação via GraphQL, atualiza o contador em tempo real e destaca visualmente a reação selecionada.

### Requirement: Comentários em Postagens
O sistema SHALL permitir a listagem paginada de comentários associados a um post via query `postComments` e a inserção de novos comentários via mutation `commentOnPost`.

#### Scenario: Envio de comentário no post
- **WHEN** o usuário expande a seção de comentários de uma postagem, digita uma mensagem e envia
- **THEN** o sistema executa a mutation `commentOnPost` e adiciona o comentário instantaneamente na lista abaixo do post.

### Requirement: Navegação e Filtro por Hashtags
O sistema SHALL identificar hashtags no conteúdo das postagens e permitir que o usuário clique em uma hashtag para visualizar todas as publicações associadas via query `postsByHashtag`.

#### Scenario: Filtragem de posts por hashtag
- **WHEN** o usuário clica em `#tecnologia` ou navega para `/hashtag/tecnologia`
- **THEN** o sistema exibe o feed filtrado contendo apenas as postagens que possuem a referida hashtag.

### Requirement: Moderação Administrativa de Posts Sociais
O Frontend Admin (`frontend/admin`) SHALL fornecer tela administrativa em Vuetify 3 para listagem, auditoria e moderação de postagens sociais e comentários denunciados ou inapropriados.

#### Scenario: Visualização e moderação no painel admin
- **WHEN** o administrador acessa `/admin/social-posts`
- **THEN** a tabela exibe todas as postagens cadastradas com ações para inspecionar comentários, autores e aplicar moderação.
