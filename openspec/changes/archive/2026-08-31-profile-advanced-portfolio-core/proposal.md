# Proposal: Implementação de Perfil Profissional Avançado e Portfólio de Destaques (`profile-advanced-portfolio-core`)

## Summary
Implementar a infraestrutura de perfil profissional rico e portfólio de destaques no **Frontend Cliente** e no **Android**, consumindo as queries e mutations dos módulos GraphQL `profiles` (`getProfileByUserId`, `updateMyProfile`) e `featured` (`userFeaturedItems`, `addFeaturedItem`, `removeFeaturedItem`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação da rede social profissional [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md):
- Os usuários precisam transformar currículos simples em perfis ricos estilo LinkedIn, configurando foto de capa/banner, título/headline de destaque, resumo sobre sua carreira, setor de atuação, localização e o selo "Open To Work".
- Os profissionais devem poder exibir um portfólio de destaques (`FeaturedItem`: links, artigos, projetos, certificados) diretamente no seu perfil público.
- Recrutadores e outras conexões precisam visualizar a página de perfil público (`/in/:id` ou `/profile/:id`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/profiles.service.ts`: Abstração de queries e mutations de perfil e itens em destaque.
  - `src/stores/profiles.ts`: Store Pinia para gerenciamento do perfil do usuário logado e perfis visitados.
  - `src/views/ProfileEditView.vue` (`/profile/edit`): Formulário completo de edição de perfil e gestão de itens em destaque.
  - `src/views/PublicProfileView.vue` (`/in/:id`): Tela de perfil público com banner, headline, selo Open to Work, bio e portfólio.
  - Rotas registradas no `router/index.ts` e atalho "Meu Perfil" no `TheHeader.vue`.
- **Android App (`android/`)**:
  - `ProfilesApiService.kt`: Camada de rede nativa em Kotlin para perfil e destaques.
  - `ProfileActivity.kt`: Tela nativa de visualização de perfil completo.
  - `EditProfileActivity.kt`: Tela nativa para edição de headline, sobre e selo Open To Work.
