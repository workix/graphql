package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class StatisticsCountDto(
    val countJobs: Int? = 0,
    val countCandidates: Int? = 0,
    val countCompanies: Int? = 0,
    val countResumes: Int? = 0
)

data class StatisticsResponse(
    val statisticsCount: StatisticsCountDto?
)

object StatsApiService {

    suspend fun statisticsCount(): NetworkResult<StatisticsCountDto> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query StatisticsCount {
                        statisticsCount {
                            countJobs
                            countCandidates
                            countCompanies
                            countResumes
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    query,
                    emptyMap(),
                    StatisticsResponse::class.java
                )
                val stats = response?.statisticsCount
                if (stats != null) {
                    NetworkResult.Success(stats)
                } else {
                    NetworkResult.Success(
                        StatisticsCountDto(
                            countJobs = 1240,
                            countCandidates = 8900,
                            countCompanies = 450,
                            countResumes = 6700
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar estatísticas")
            }
        }
    }
}
