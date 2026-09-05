package br.com.codecode.workix.android.data.repository

import br.com.codecode.workix.android.data.model.*
import br.com.codecode.workix.android.network.GraphQLApiClient
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repositório responsável por executar as operações de Vagas via GraphQL no Android.
 */
class JobRepository {

    suspend fun getJobsPaginated(page: Int = 1, limit: Int = 10): NetworkResult<PaginatedListJobData> =
        withContext(Dispatchers.IO) {
            try {
                val query = """
                    query AllJobsPaginated(${'$'}page: Int!, ${'$'}limit: Int!) {
                        allJobsPaginated(page: ${'$'}page, limit: ${'$'}limit) {
                            jobs {
                                id
                                title
                                description
                                benefits
                                requirement
                                jobCategory
                                jobType
                                categories
                                employmentType
                                isPcd
                                isRemote
                                minPayment
                                maxPayment
                                featured
                                activated
                                createdAt
                                company {
                                    id
                                    name
                                    description
                                    logo
                                }
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
                    responseType = PaginatedListJobResponse::class.java
                )

                val data = response?.allJobsPaginated
                if (data != null) {
                    NetworkResult.Success(data)
                } else {
                    NetworkResult.Error("Nenhum dado retornado para a listagem de vagas")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro desconhecido ao carregar vagas")
            }
        }

    suspend fun getJobById(id: String): NetworkResult<JobGraphQL> =
        withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetJobById(${'$'}id: ID!) {
                        getJobById(id: ${'$'}id) {
                            id
                            title
                            description
                            benefits
                            requirement
                            jobCategory
                            jobType
                            categories
                            employmentType
                            isPcd
                            isRemote
                            minPayment
                            maxPayment
                            featured
                            activated
                            createdAt
                            company {
                                id
                                name
                                description
                                logo
                            }
                        }
                    }
                """.trimIndent()

                val variables = mapOf("id" to id)
                val response = GraphQLApiClient.execute(
                    query = query,
                    variables = variables,
                    responseType = SingleJobResponse::class.java
                )

                val data = response?.getJobById
                if (data != null) {
                    NetworkResult.Success(data)
                } else {
                    NetworkResult.Error("Vaga não encontrada")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao buscar detalhes da vaga")
            }
        }

    suspend fun subscribeInJob(jobId: String, candidateId: String): NetworkResult<Boolean> =
        withContext(Dispatchers.IO) {
            try {
                val query = """
                    mutation SubscribeInJob(${'$'}input: SubscribeInJobInput!) {
                        subscribeInJob(input: ${'$'}input)
                    }
                """.trimIndent()

                val variables = mapOf(
                    "input" to mapOf(
                        "jobId" to jobId,
                        "candidateId" to candidateId
                    )
                )

                val response = GraphQLApiClient.execute(
                    query = query,
                    variables = variables,
                    responseType = SubscribeInJobResponse::class.java
                )

                val success = response?.subscribeInJob ?: false
                if (success) {
                    NetworkResult.Success(true)
                } else {
                    NetworkResult.Error("Não foi possível concluir a candidatura")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao enviar candidatura para a vaga")
            }
        }

    suspend fun searchJobs(filter: JobFilterInput = JobFilterInput(), page: Int = 1, limit: Int = 10): NetworkResult<JobSearchData> =
        withContext(Dispatchers.IO) {
            try {
                val query = """
                    query SearchJobs(${'$'}query: String, ${'$'}filter: JobSearchFilterInput, ${'$'}page: Int, ${'$'}limit: Int) {
                        searchJobs(query: ${'$'}query, filter: ${'$'}filter, page: ${'$'}page, limit: ${'$'}limit) {
                            jobs {
                                id
                                title
                                description
                                benefits
                                requirement
                                jobCategory
                                jobType
                                categories
                                employmentType
                                isPcd
                                isRemote
                                minPayment
                                maxPayment
                                featured
                                activated
                                createdAt
                                company {
                                    id
                                    name
                                    description
                                    logo
                                }
                            }
                            totalCount
                            page
                            totalPages
                            facets {
                                categories
                                employmentTypes
                            }
                        }
                    }
                """.trimIndent()

                val variables = mutableMapOf<String, Any?>()
                if (!filter.keyword.isNullOrBlank()) {
                    variables["query"] = filter.keyword
                }
                val filterMap = filter.toMap()
                if (filterMap.isNotEmpty()) {
                    variables["filter"] = filterMap
                }
                variables["page"] = page
                variables["limit"] = limit

                val response = GraphQLApiClient.execute(
                    query = query,
                    variables = variables,
                    responseType = JobSearchResponse::class.java
                )

                val data = response?.searchJobs
                if (data != null) {
                    NetworkResult.Success(data)
                } else {
                    NetworkResult.Error("Nenhum resultado encontrado para a busca")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao buscar vagas")
            }
        }
}
