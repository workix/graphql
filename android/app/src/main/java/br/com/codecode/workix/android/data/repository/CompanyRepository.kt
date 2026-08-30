package br.com.codecode.workix.android.data.repository

import br.com.codecode.workix.android.data.model.CompanyGraphQL
import br.com.codecode.workix.android.network.GraphQLApiClient
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class SingleCompanyResponse(
    val getCompanyById: CompanyGraphQL?
)

data class PaginatedCompanyResponse(
    val allCompaniesPaginated: PaginatedCompanyData?
)

data class PaginatedCompanyData(
    val companies: List<CompanyGraphQL>?,
    val totalPages: Int?,
    val currentPage: Int?,
    val maxRows: Int?
)

/**
 * Repositório responsável pelo consumo de dados de Empresas via GraphQL no Android.
 */
class CompanyRepository {

    suspend fun getCompaniesPaginated(page: Int = 1, limit: Int = 10): NetworkResult<PaginatedCompanyData> =
        withContext(Dispatchers.IO) {
            try {
                val query = """
                    query AllCompaniesPaginated(${'$'}page: Int!, ${'$'}limit: Int!) {
                        allCompaniesPaginated(page: ${'$'}page, limit: ${'$'}limit) {
                            companies {
                                id
                                name
                                description
                                email
                                cnpj
                                phone
                                location
                            }
                            totalPages
                            currentPage
                            maxRows
                        }
                    }
                """.trimIndent()

                val variables = mapOf("page" to page, "limit" to limit)
                val response = GraphQLApiClient.execute(
                    query = query,
                    variables = variables,
                    responseType = PaginatedCompanyResponse::class.java
                )

                val data = response?.allCompaniesPaginated
                if (data != null) {
                    NetworkResult.Success(data)
                } else {
                    NetworkResult.Error("Nenhuma empresa encontrada")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao listar empresas")
            }
        }

    suspend fun getCompanyById(id: String): NetworkResult<CompanyGraphQL> =
        withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetCompanyById(${'$'}id: ID!) {
                        getCompanyById(id: ${'$'}id) {
                            id
                            name
                            description
                            email
                            cnpj
                            phone
                            location
                        }
                    }
                """.trimIndent()

                val variables = mapOf("id" to id)
                val response = GraphQLApiClient.execute(
                    query = query,
                    variables = variables,
                    responseType = SingleCompanyResponse::class.java
                )

                val data = response?.getCompanyById
                if (data != null) {
                    NetworkResult.Success(data)
                } else {
                    NetworkResult.Error("Empresa não encontrada")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao buscar detalhes da empresa")
            }
        }
}
