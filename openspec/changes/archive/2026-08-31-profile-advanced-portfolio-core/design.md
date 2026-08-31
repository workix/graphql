# Design Document: Perfil Profissional Avançado e Destaques (`profile-advanced-portfolio-core`)

## Context & Architectural Strategy

O módulo de perfil e portfólio consolida a identidade profissional no ecossistema Workix:
1. **Backend GraphQL (`src/modules/profiles` & `src/modules/featured`)**:
   - `getProfileByUserId(userId)`: Retorna os dados cadastrais enriquecidos (`headline`, `about`, `bannerUrl`, `location`, `industry`, `openToWork`).
   - `updateMyProfile(userId, input)`: Atualiza as informações do perfil.
   - `userFeaturedItems(userId)`: Retorna portfólio de projetos, artigos e links destacados.
   - `addFeaturedItem` / `removeFeaturedItem`: Gestão de itens em destaque.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/profiles.service.ts`: Abstração de cliente GraphQL.
   - `src/stores/profiles.ts`: Store Pinia para gerenciamento do perfil do usuário logado e perfis públicos.
   - `src/views/ProfileEditView.vue` (`/profile/edit`): Formulário de edição de Headline, Sobre, Setor, Localização, Imagem de Capa e Selo Open To Work, com modal para adicionar itens em destaque.
   - `src/views/PublicProfileView.vue` (`/in/:id`): Tela pública de perfil visualmente rica estilo LinkedIn.

3. **Android App (`android/`)**:
   - `ProfilesApiService.kt`: Chamadas de rede nativas com Coroutines.
   - `ProfileActivity.kt`: Exibição visual de perfil.
   - `EditProfileActivity.kt`: Edição nativa do perfil.
