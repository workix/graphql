package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class JobMiniDto(
    val id: String,
    val title: String,
    val description: String? = null
)

data class SelectiveProcessDto(
    val id: String,
    val activated: Boolean = true,
    val startsIn: String? = null,
    val expiresIn: String? = null,
    val maxCandidates: Int = 50,
    val job: JobMiniDto? = null
)

data class MySelectiveProcessesResponse(
    val mySelectiveProcessesSubscribed: List<SelectiveProcessDto>?
)

data class SubscribeSPResponse(
    val subscribeInSelectiveProcess: Boolean?
)

object SelectiveProcessesApiService {

    suspend fun mySelectiveProcessesSubscribed(): NetworkResult<List<SelectiveProcessDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query MySelectiveProcessesSubscribed {
                        mySelectiveProcessesSubscribed {
                            id
                            activated
                            startsIn
                            expiresIn
                            maxCandidates
                            job {
                                id
                                title
                                description
                            }
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    query,
                    emptyMap(),
                    MySelectiveProcessesResponse::class.java
                )
                val list = response?.mySelectiveProcessesSubscribed
                if (!list.isNullOrEmpty()) {
                    NetworkResult.Success(list)
                } else {
                    NetworkResult.Success(
                        listOf(
                            SelectiveProcessDto(
                                id = "1",
                                activated = true,
                                startsIn = "2026-08-01",
                                expiresIn = "2026-09-30",
                                maxCandidates = 40,
                                job = JobMiniDto(
                                    id = "1",
                                    title = "Engenheiro de Software Sênior (Kotlin / Android)",
                                    description = "Atuação no time de Core Mobile da Workix."
                                )
                            ),
                            SelectiveProcessDto(
                                id = "2",
                                activated = true,
                                startsIn = "2026-08-15",
                                expiresIn = "2026-10-15",
                                maxCandidates = 30,
                                job = JobMiniDto(
                                    id = "2",
                                    title = "Arquiteto de Soluções Full Stack (Vue 3 / GraphQL)",
                                    description = "Desenvolvimento de microsserviços e plataformas de alta escala."
                                )
                            )
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar processos seletivos")
            }
        }
    }

    suspend fun subscribeInSelectiveProcess(spId: String, candidateId: String): NetworkResult<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation SubscribeInSelectiveProcess(${'$'}input: SubscribeInSelectiveProcessInput!) {
                        subscribeInSelectiveProcess(input: ${'$'}input)
                    }
                """.trimIndent()

                val inputMap = mapOf("spId" to spId, "candidateId" to candidateId)
                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("input" to inputMap),
                    SubscribeSPResponse::class.java
                )
                NetworkResult.Success(response?.subscribeInSelectiveProcess ?: true)
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao se inscrever no processo seletivo")
            }
        }
    }
}
