## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/endorsements.service.ts` para queries e mutations de endossos e recomendações
- [ ] 1.2 Criar `frontend/client/src/stores/endorsements.ts` para gerenciamento de competências e recomendações

## 2. Frontend Cliente: Componentes e Integrações

- [ ] 2.1 Criar `frontend/client/src/components/SkillEndorsementsSection.vue` para endosso interativo de competências
- [ ] 2.2 Criar `frontend/client/src/components/RecommendationsSection.vue` para leitura, envio e moderação de recomendações
- [ ] 2.3 Integrar os novos componentes nas views `PublicProfileView.vue` e `ProfileEditView.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `EndorsementsApiService.kt` no módulo de rede do Android
- [ ] 3.2 Atualizar `ProfileActivity.kt` para exibir competências endossáveis e recomendações no Android

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para o módulo `endorsements`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate endorsements-recommendations-social`
