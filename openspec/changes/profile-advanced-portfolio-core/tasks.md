## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/profiles.service.ts` para queries e mutations de perfil e destaques
- [ ] 1.2 Criar `frontend/client/src/stores/profiles.ts` para gerenciamento do perfil do usuário e portfólio

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/ProfileEditView.vue` (`/profile/edit`) para edição de perfil e portfólio
- [ ] 2.2 Criar `frontend/client/src/views/PublicProfileView.vue` (`/in/:id`) para exibição pública do perfil profissional
- [ ] 2.3 Registrar rotas `/profile/edit` e `/in/:id` em `frontend/client/src/router/index.ts` e adicionar atalho "Meu Perfil" em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `ProfilesApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `ProfileActivity.kt` e `EditProfileActivity.kt` no pacote `ui/profile` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para os módulos `profiles` e `featured`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate profile-advanced-portfolio-core`
