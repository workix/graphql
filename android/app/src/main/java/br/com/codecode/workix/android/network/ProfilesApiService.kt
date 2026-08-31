package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class UserProfileDto(
    val id: String? = null,
    val userId: String,
    val headline: String? = null,
    val about: String? = null,
    val bannerUrl: String? = null,
    val location: String? = null,
    val industry: String? = null,
    val openToWork: Boolean? = false,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class FeaturedItemDto(
    val id: String,
    val userId: String,
    val type: String,
    val title: String,
    val url: String? = null,
    val mediaId: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class GetProfileResponse(
    val getProfileByUserId: UserProfileDto?
)

data class UpdateMyProfileResponse(
    val updateMyProfile: UserProfileDto?
)

data class UserFeaturedItemsResponse(
    val userFeaturedItems: List<FeaturedItemDto>?
)

object ProfilesApiService {

    suspend fun getProfile(userId: String = "1"): NetworkResult<UserProfileDto> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetProfileByUserId(${'$'}userId: ID!) {
                        getProfileByUserId(userId: ${'$'}userId) {
                            id
                            userId
                            headline
                            about
                            bannerUrl
                            location
                            industry
                            openToWork
                            createdAt
                            updatedAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), GetProfileResponse::class.java)
                val profile = response?.getProfileByUserId
                if (profile != null) {
                    NetworkResult.Success(profile)
                } else {
                    NetworkResult.Success(UserProfileDto(userId = userId))
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter perfil")
            }
        }
    }

    suspend fun updateProfile(
        userId: String = "1",
        headline: String,
        about: String,
        location: String,
        industry: String,
        openToWork: Boolean
    ): NetworkResult<UserProfileDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation UpdateMyProfile(${'$'}userId: ID!, ${'$'}input: ProfileInput!) {
                        updateMyProfile(userId: ${'$'}userId, input: ${'$'}input) {
                            id
                            userId
                            headline
                            about
                            location
                            industry
                            openToWork
                        }
                    }
                """.trimIndent()

                val inputMap = mapOf(
                    "headline" to headline,
                    "about" to about,
                    "location" to location,
                    "industry" to industry,
                    "openToWork" to openToWork
                )

                val variables = mapOf(
                    "userId" to userId,
                    "input" to inputMap
                )

                val response = GraphQLApiClient.execute(mutation, variables, UpdateMyProfileResponse::class.java)
                val updated = response?.updateMyProfile
                if (updated != null) {
                    NetworkResult.Success(updated)
                } else {
                    NetworkResult.Error("Falha ao salvar perfil")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao atualizar perfil")
            }
        }
    }

    suspend fun getFeaturedItems(userId: String = "1"): NetworkResult<List<FeaturedItemDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query UserFeaturedItems(${'$'}userId: ID!) {
                        userFeaturedItems(userId: ${'$'}userId) {
                            id
                            userId
                            type
                            title
                            url
                            mediaId
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), UserFeaturedItemsResponse::class.java)
                NetworkResult.Success(response?.userFeaturedItems ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter itens em destaque")
            }
        }
    }
}
