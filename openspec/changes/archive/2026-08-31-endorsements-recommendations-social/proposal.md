# Proposal: Implementação de Endossos de Competências e Recomendações Sociais (`endorsements-recommendations-social`)

## Summary
Implementar o fluxo completo de endossos de competências técnicas (Skills Endorsements) e cartas de recomendação profissional (Recommendations) no **Frontend Cliente** e no **Android**, consumindo as queries e mutations do módulo GraphQL `endorsements` (`skillEndorsements`, `endorseSkill`, `unendorseSkill`, `userRecommendations`, `createRecommendation`, `respondToRecommendation`).

## Motivation & Background
No ecossistema de rede profissional Workix (conforme [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md) e [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md)):
- Competências profissionais ganham credibilidade quando endossadas por conexões de trabalho (`endorseSkill`).
- Cartas de recomendação escritas por líderes e colegas (`createRecommendation`) enriquecem o perfil público (`PublicProfileView.vue` e `ProfileActivity.kt`) e podem ser aceitas ou ocultadas pelo destinatário (`respondToRecommendation`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/endorsements.service.ts`: Abstração de queries e mutations de endossos e recomendações.
  - `src/stores/endorsements.ts`: Store Pinia para gerenciamento reativo de endossos e depoimentos.
  - `src/components/SkillEndorsementsSection.vue`: Componente reutilizável para listar e endossar competências.
  - `src/components/RecommendationsSection.vue`: Componente para solicitar, escrever e exibir recomendações.
  - Integração nos arquivos `PublicProfileView.vue` e `ProfileEditView.vue`.
- **Android App (`android/`)**:
  - `EndorsementsApiService.kt`: Camada de rede nativa em Kotlin para endossos e recomendações.
  - Atualização da `ProfileActivity.kt` com seções nativas de competências com botão de endossar e lista de recomendações.
