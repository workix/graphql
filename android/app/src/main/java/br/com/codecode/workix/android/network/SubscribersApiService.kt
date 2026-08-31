package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class SubscribeMailResponse(
    val subscribeMail: Boolean?
)

object SubscribersApiService {

    suspend fun subscribeMail(email: String): NetworkResult<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation SubscribeMail(${'$'}email: String!) {
                        subscribeMail(email: ${'$'}email)
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("email" to email),
                    SubscribeMailResponse::class.java
                )
                NetworkResult.Success(response?.subscribeMail ?: true)
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao se inscrever na newsletter")
            }
        }
    }
}
