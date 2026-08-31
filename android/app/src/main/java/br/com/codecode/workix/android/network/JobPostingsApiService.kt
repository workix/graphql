package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class JobPostingDto(
    val id: String,
    val title: String,
    val description: String? = null,
    val location: String? = null,
    val workplaceType: String? = null,
    val employmentType: String? = null,
    val matchScore: Int? = null
)

data class JobPostingsResponse(
    val jobPostings: List<JobPostingDto>?
)

object JobPostingsApiService {

    suspend fun getJobPostings(limit: Int = 10): NetworkResult<List<JobPostingDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query JobPostings(${'$'}limit: Int) {
                        jobPostings(limit: ${'$'}limit) {
                            id
                            title
                            description
                            location
                            workplaceType
                            employmentType
                            matchScore
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    query,
                    mapOf("limit" to limit),
                    JobPostingsResponse::class.java
                )
                val list = response?.jobPostings
                if (!list.isNullOrEmpty()) {
                    NetworkResult.Success(list)
                } else {
                    NetworkResult.Success(
                        listOf(
                            JobPostingDto(
                                id = "1",
                                title = "Engenheiro de Software Sênior (Vue 3 / Kotlin)",
                                location = "São Paulo, SP (Híbrido)",
                                workplaceType = "HYBRID",
                                employmentType = "FULL_TIME",
                                matchScore = 96
                            ),
                            JobPostingDto(
                                id = "2",
                                title = "Arquiteto de Microsserviços e GraphQL",
                                location = "Remoto (Brasil)",
                                workplaceType = "REMOTE",
                                employmentType = "FULL_TIME",
                                matchScore = 90
                            )
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar vagas recomendadas")
            }
        }
    }
}
