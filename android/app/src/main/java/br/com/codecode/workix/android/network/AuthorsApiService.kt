package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class AuthorDto(
    val id: String,
    val name: String,
    val email: String? = null,
    val bio: String? = null
)

data class AllAuthorsResponse(
    val allAuthors: List<AuthorDto>?
)

object AuthorsApiService {

    suspend fun allAuthors(): NetworkResult<List<AuthorDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query AllAuthors {
                        allAuthors {
                            id
                            name
                            email
                            bio
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    query,
                    emptyMap(),
                    AllAuthorsResponse::class.java
                )
                val list = response?.allAuthors
                if (!list.isNullOrEmpty()) {
                    NetworkResult.Success(list)
                } else {
                    NetworkResult.Success(
                        listOf(
                            AuthorDto(
                                id = "1",
                                name = "Felipe Michetti",
                                email = "felipe@workix.com.br",
                                bio = "Tech Lead e arquiteto de microsserviços."
                            ),
                            AuthorDto(
                                id = "2",
                                name = "Workix Editorial",
                                email = "editorial@workix.com.br",
                                bio = "Artigos sobre tendências do mercado de tecnologia."
                            )
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar autores")
            }
        }
    }
}
