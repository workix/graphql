package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class SkillEndorsementDto(
    val id: String,
    val skillId: String,
    val endorserId: String,
    val createdAt: String? = null
)

data class RecommendationDto(
    val id: String,
    val recommenderId: String,
    val recipientId: String,
    val content: String,
    val status: String? = "ACCEPTED",
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class SkillEndorsementsResponse(
    val skillEndorsements: List<SkillEndorsementDto>?
)

data class UserRecommendationsResponse(
    val userRecommendations: List<RecommendationDto>?
)

data class EndorseSkillResponse(
    val endorseSkill: Boolean?
)

data class CreateRecommendationResponse(
    val createRecommendation: RecommendationDto?
)

object EndorsementsApiService {

    suspend fun getSkillEndorsements(skillId: String): NetworkResult<List<SkillEndorsementDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query SkillEndorsements(${'$'}skillId: ID!) {
                        skillEndorsements(skillId: ${'$'}skillId) {
                            id
                            skillId
                            endorserId
                            createdAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("skillId" to skillId), SkillEndorsementsResponse::class.java)
                NetworkResult.Success(response?.skillEndorsements ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar endossos")
            }
        }
    }

    suspend fun endorseSkill(skillId: String, endorserId: String = "1"): NetworkResult<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation EndorseSkill(${'$'}skillId: ID!, ${'$'}endorserId: ID!) {
                        endorseSkill(skillId: ${'$'}skillId, endorserId: ${'$'}endorserId)
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("skillId" to skillId, "endorserId" to endorserId),
                    EndorseSkillResponse::class.java
                )
                NetworkResult.Success(response?.endorseSkill ?: true)
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao endossar competência")
            }
        }
    }

    suspend fun getUserRecommendations(userId: String): NetworkResult<List<RecommendationDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query UserRecommendations(${'$'}userId: ID!) {
                        userRecommendations(userId: ${'$'}userId) {
                            id
                            recommenderId
                            recipientId
                            content
                            status
                            createdAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), UserRecommendationsResponse::class.java)
                NetworkResult.Success(response?.userRecommendations ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar recomendações")
            }
        }
    }

    suspend fun createRecommendation(
        recommenderId: String = "1",
        recipientId: String,
        content: String
    ): NetworkResult<RecommendationDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CreateRecommendation(${'$'}recommenderId: ID!, ${'$'}recipientId: ID!, ${'$'}content: String!) {
                        createRecommendation(recommenderId: ${'$'}recommenderId, recipientId: ${'$'}recipientId, content: ${'$'}content) {
                            id
                            recommenderId
                            recipientId
                            content
                            status
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "recommenderId" to recommenderId,
                    "recipientId" to recipientId,
                    "content" to content
                )

                val response = GraphQLApiClient.execute(mutation, variables, CreateRecommendationResponse::class.java)
                val rec = response?.createRecommendation
                if (rec != null) {
                    NetworkResult.Success(rec)
                } else {
                    NetworkResult.Error("Falha ao criar recomendação")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao enviar recomendação")
            }
        }
    }
}
