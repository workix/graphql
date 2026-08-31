# Design Document: Endossos e Recomendações Sociais (`endorsements-recommendations-social`)

## Context & Architectural Strategy

O módulo de endossos e recomendações eleva a autoridade e reputação dos perfis profissionais no Workix:
1. **Backend GraphQL (`src/modules/endorsements`)**:
   - `skillEndorsements(skillId)`: Retorna os endossos comunitários de uma competência.
   - `endorseSkill(skillId, endorserId)`: Cria endosso.
   - `unendorseSkill(skillId, endorserId)`: Remove endosso.
   - `userRecommendations(userId)`: Retorna cartas de recomendação do usuário.
   - `createRecommendation(recommenderId, recipientId, content)`: Envia recomendação.
   - `respondToRecommendation(recommendationId, recipientId, accept)`: Modera recomendação.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/endorsements.service.ts`: Abstração do cliente GraphQL.
   - `src/stores/endorsements.ts`: Store Pinia com listagens e contadores de endossos e recomendações.
   - `src/components/SkillEndorsementsSection.vue`: Componente com lista de skills e botão interativo "+ Endossar".
   - `src/components/RecommendationsSection.vue`: Componente com abas "Recebidas" e "Dadas", modal de envio e moderação de recomendações pendentes.
   - Integração direta em `PublicProfileView.vue` e `ProfileEditView.vue`.

3. **Android App (`android/`)**:
   - `EndorsementsApiService.kt`: Camada de rede nativa em Kotlin.
   - Atualização de `ProfileActivity.kt` para renderizar cards de Skills com contagem de endossos e lista de recomendações.
