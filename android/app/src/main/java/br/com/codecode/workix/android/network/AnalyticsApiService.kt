package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class SocialSellingScoreDto(
    val id: String? = null,
    val userId: String,
    val score: Int = 0,
    val postsScore: Int = 0,
    val networkScore: Int = 0,
    val engagementScore: Int = 0,
    val relationshipsScore: Int = 0,
    val calculatedAt: String? = null
)

data class ProfileViewDto(
    val id: String,
    val viewedId: String,
    val viewerId: String,
    val viewedAt: String? = null
)

data class PostAnalyticsDto(
    val id: String? = null,
    val postId: String,
    val viewsCount: Int = 0,
    val sharesCount: Int = 0,
    val createdAt: String? = null
)

data class MySocialSellingIndexResponse(
    val mySocialSellingIndex: SocialSellingScoreDto?
)

data class RecalculateSSIResponse(
    val recalculateSocialSellingIndex: SocialSellingScoreDto?
)

data class WhoViewedMyProfileResponse(
    val whoViewedMyProfile: List<ProfileViewDto>?
)

object AnalyticsApiService {

    suspend fun getMySocialSellingIndex(userId: String = "1"): NetworkResult<SocialSellingScoreDto> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query MySocialSellingIndex(${'$'}userId: ID!) {
                        mySocialSellingIndex(userId: ${'$'}userId) {
                            id
                            userId
                            score
                            postsScore
                            networkScore
                            engagementScore
                            relationshipsScore
                            calculatedAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), MySocialSellingIndexResponse::class.java)
                val ssi = response?.mySocialSellingIndex
                if (ssi != null) {
                    NetworkResult.Success(ssi)
                } else {
                    NetworkResult.Success(SocialSellingScoreDto(userId = userId, score = 70, postsScore = 18, networkScore = 18, engagementScore = 17, relationshipsScore = 17))
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter SSI")
            }
        }
    }

    suspend fun recalculateSSI(userId: String = "1"): NetworkResult<SocialSellingScoreDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation RecalculateSocialSellingIndex(${'$'}userId: ID!) {
                        recalculateSocialSellingIndex(userId: ${'$'}userId) {
                            id
                            userId
                            score
                            postsScore
                            networkScore
                            engagementScore
                            relationshipsScore
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(mutation, mapOf("userId" to userId), RecalculateSSIResponse::class.java)
                val updated = response?.recalculateSocialSellingIndex
                if (updated != null) {
                    NetworkResult.Success(updated)
                } else {
                    NetworkResult.Error("Falha ao recalcular SSI")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao recalcular índice")
            }
        }
    }

    suspend fun getWhoViewedMyProfile(userId: String = "1", limit: Int = 50, offset: Int = 0): NetworkResult<List<ProfileViewDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query WhoViewedMyProfile(${'$'}userId: ID!, ${'$'}limit: Int, ${'$'}offset: Int) {
                        whoViewedMyProfile(userId: ${'$'}userId, limit: ${'$'}limit, offset: ${'$'}offset) {
                            id
                            viewedId
                            viewerId
                            viewedAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf("userId" to userId, "limit" to limit, "offset" to offset)
                val response = GraphQLApiClient.execute(query, variables, WhoViewedMyProfileResponse::class.java)
                NetworkResult.Success(response?.whoViewedMyProfile ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar visitantes")
            }
        }
    }
}
