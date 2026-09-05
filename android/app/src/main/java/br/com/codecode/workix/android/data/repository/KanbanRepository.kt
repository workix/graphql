package br.com.codecode.workix.android.data.repository

import br.com.codecode.workix.android.data.model.*
import br.com.codecode.workix.android.network.GraphQLApiClient
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class KanbanRepository {

    suspend fun getBoard(jobId: String, companyId: String): NetworkResult<KanbanBoardGraphQL> = withContext(Dispatchers.IO) {
        try {
            val query = """
                query GetRecruitmentBoard(${'$'}jobId: ID!, ${'$'}companyId: ID!) {
                    getRecruitmentBoard(jobId: ${'$'}jobId, companyId: ${'$'}companyId) {
                        jobId
                        companyId
                        stages {
                            id
                            uuid
                            name
                            color
                            orderPosition
                            isSystemStage
                            cards {
                                id
                                uuid
                                stageId
                                candidateId
                                orderPosition
                                rating
                                notes
                                tags
                                candidate { id name }
                                histories { id fromStageId toStageId notes createdAt }
                            }
                        }
                    }
                }
            """.trimIndent()

            val response = GraphQLApiClient.execute(
                query = query,
                variables = mapOf("jobId" to jobId, "companyId" to companyId),
                responseType = KanbanBoardResponse::class.java
            )

            val board = response?.getRecruitmentBoard
            if (board != null) {
                NetworkResult.Success(board)
            } else {
                NetworkResult.Error("Quadro Kanban não encontrado")
            }
        } catch (e: Exception) {
            NetworkResult.Error(e.message ?: "Erro ao carregar pipeline")
        }
    }

    suspend fun moveCard(
        cardId: String,
        targetStageId: String,
        notes: String? = null
    ): NetworkResult<KanbanCardGraphQL> = withContext(Dispatchers.IO) {
        try {
            val mutation = """
                mutation MoveKanbanCard(${'$'}input: MoveKanbanCardInput!) {
                    moveKanbanCard(input: ${'$'}input) {
                        id
                        stageId
                        orderPosition
                    }
                }
            """.trimIndent()

            val input = mapOf(
                "cardId" to cardId,
                "targetStageId" to targetStageId,
                "notes" to notes
            )

            val response = GraphQLApiClient.execute(
                query = mutation,
                variables = mapOf("input" to input),
                responseType = KanbanCardGraphQL::class.java
            )

            if (response != null) {
                NetworkResult.Success(response)
            } else {
                NetworkResult.Error("Falha ao mover card")
            }
        } catch (e: Exception) {
            NetworkResult.Error(e.message ?: "Erro na transição de etapa")
        }
    }
}
