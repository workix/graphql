package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class ValidateCPFResponse(
    val validateCPF: Boolean?
)

object OthersApiService {

    suspend fun validateCPF(cpf: String): NetworkResult<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query ValidateCPF(${'$'}cpf: String!) {
                        validateCPF(cpf: ${'$'}cpf)
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    query,
                    mapOf("cpf" to cpf),
                    ValidateCPFResponse::class.java
                )
                NetworkResult.Success(response?.validateCPF ?: (cpf.filter { it.isDigit() }.length == 11))
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao validar CPF")
            }
        }
    }
}
