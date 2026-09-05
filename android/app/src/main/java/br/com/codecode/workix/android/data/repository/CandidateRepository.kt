package br.com.codecode.workix.android.data.repository

import br.com.codecode.workix.android.data.model.*
import br.com.codecode.workix.android.network.GraphQLApiClient
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CandidateRepository {

    suspend fun searchCandidates(
        queryText: String? = null,
        filter: CandidateSearchFilterInput? = null,
        page: Int = 1,
        limit: Int = 20
    ): NetworkResult<CandidateSearchData> = withContext(Dispatchers.IO) {
        try {
            val query = """
                query SearchCandidates(${'$'}query: String, ${'$'}filter: CandidateSearchFilterInput, ${'$'}page: Int, ${'$'}limit: Int) {
                    searchCandidates(query: ${'$'}query, filter: ${'$'}filter, page: ${'$'}page, limit: ${'$'}limit) {
                        candidates {
                            id
                            uuid
                            name
                            city
                            state
                            lookingForJob
                            inCareerTransition
                            careerTransitionTarget
                            acceptsEntryLevel
                            normalizedResume {
                                rawMarkdown
                                completenessScore
                                skills
                            }
                            createdAt
                        }
                        totalCount
                        page
                        totalPages
                        facets {
                            lookingForJobCount
                            inCareerTransitionCount
                            acceptsEntryLevelCount
                            states { key count }
                            skills { key count }
                            careerTransitionTargets { key count }
                        }
                    }
                }
            """.trimIndent()

            val variables = mutableMapOf<String, Any?>("page" to page, "limit" to limit)
            queryText?.let { variables["query"] = it }
            filter?.let { variables["filter"] = it }

            val response = GraphQLApiClient.execute(
                query = query,
                variables = variables,
                responseType = CandidateSearchResponse::class.java
            )

            val data = response?.searchCandidates
            if (data != null) {
                NetworkResult.Success(data)
            } else {
                NetworkResult.Error("Nenhum talento retornado")
            }
        } catch (e: Exception) {
            NetworkResult.Error(e.message ?: "Erro ao buscar candidatos")
        }
    }

    suspend fun updateCareerStatus(
        candidateId: String,
        lookingForJob: Boolean,
        inCareerTransition: Boolean,
        careerTransitionTarget: String?,
        acceptsEntryLevel: Boolean
    ): NetworkResult<CandidateGraphQL> = withContext(Dispatchers.IO) {
        try {
            val mutation = """
                mutation UpdateCandidateCareerStatus(${'$'}candidateId: ID!, ${'$'}input: CandidateCareerStatusInput!) {
                    updateCandidateCareerStatus(candidateId: ${'$'}candidateId, input: ${'$'}input) {
                        id
                        lookingForJob
                        inCareerTransition
                        careerTransitionTarget
                        acceptsEntryLevel
                    }
                }
            """.trimIndent()

            val input = mapOf(
                "lookingForJob" to lookingForJob,
                "inCareerTransition" to inCareerTransition,
                "careerTransitionTarget" to careerTransitionTarget,
                "acceptsEntryLevel" to acceptsEntryLevel
            )

            val response = GraphQLApiClient.execute(
                query = mutation,
                variables = mapOf("candidateId" to candidateId, "input" to input),
                responseType = CandidateGraphQL::class.java
            )

            if (response != null) {
                NetworkResult.Success(response)
            } else {
                NetworkResult.Error("Falha ao atualizar status de carreira")
            }
        } catch (e: Exception) {
            NetworkResult.Error(e.message ?: "Erro na requisição")
        }
    }
}
