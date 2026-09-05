package br.com.codecode.workix.android.data.repository

import br.com.codecode.workix.android.data.model.*
import br.com.codecode.workix.android.network.GraphQLApiClient
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class InterviewRepository {

    suspend fun listByCandidate(candidateId: String): NetworkResult<List<InterviewGraphQL>> = withContext(Dispatchers.IO) {
        try {
            val query = """
                query ListInterviewsByCandidate(${'$'}candidateId: ID!) {
                    listInterviewsByCandidate(candidateId: ${'$'}candidateId) {
                        id
                        uuid
                        title
                        description
                        scheduledAt
                        durationMinutes
                        format
                        meetingLink
                        locationAddress
                        status
                        rescheduleReason
                        company { id name }
                        job { id title }
                    }
                }
            """.trimIndent()

            val response = GraphQLApiClient.execute(
                query = query,
                variables = mapOf("candidateId" to candidateId),
                responseType = ListInterviewsResponse::class.java
            )

            val list = response?.listInterviewsByCandidate
            if (list != null) {
                NetworkResult.Success(list)
            } else {
                NetworkResult.Success(emptyList())
            }
        } catch (e: Exception) {
            NetworkResult.Error(e.message ?: "Erro ao carregar entrevistas")
        }
    }

    suspend fun respondInterview(
        interviewId: String,
        status: String,
        rescheduleReason: String? = null,
        candidateFeedback: String? = null
    ): NetworkResult<InterviewGraphQL> = withContext(Dispatchers.IO) {
        try {
            val mutation = """
                mutation RespondInterview(${'$'}id: ID!, ${'$'}input: RespondInterviewInput!) {
                    respondInterview(id: ${'$'}id, input: ${'$'}input) {
                        id
                        status
                        rescheduleReason
                        candidateFeedback
                    }
                }
            """.trimIndent()

            val input = mapOf(
                "status" to status,
                "rescheduleReason" to rescheduleReason,
                "candidateFeedback" to candidateFeedback
            )

            val response = GraphQLApiClient.execute(
                query = mutation,
                variables = mapOf("id" to interviewId, "input" to input),
                responseType = InterviewGraphQL::class.java
            )

            if (response != null) {
                NetworkResult.Success(response)
            } else {
                NetworkResult.Error("Falha ao responder entrevista")
            }
        } catch (e: Exception) {
            NetworkResult.Error(e.message ?: "Erro ao processar resposta")
        }
    }
}
