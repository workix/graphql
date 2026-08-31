package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class DirectMessageDto(
    val id: String,
    val senderId: String,
    val recipientId: String,
    val content: String,
    val read: Boolean = false,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class DirectMessagesResponse(
    val directMessages: List<DirectMessageDto>?
)

data class SendDirectMessageResponse(
    val sendDirectMessage: DirectMessageDto?
)

data class MarkDirectMessageAsReadResponse(
    val markDirectMessageAsRead: DirectMessageDto?
)

object MessagingApiService {

    suspend fun getDirectMessages(
        userId1: String,
        userId2: String,
        limit: Int = 50,
        offset: Int = 0
    ): NetworkResult<List<DirectMessageDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query DirectMessages(${'$'}userId1: ID!, ${'$'}userId2: ID!, ${'$'}limit: Int, ${'$'}offset: Int) {
                        directMessages(userId1: ${'$'}userId1, userId2: ${'$'}userId2, limit: ${'$'}limit, offset: ${'$'}offset) {
                            id
                            senderId
                            recipientId
                            content
                            read
                            createdAt
                            updatedAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "userId1" to userId1,
                    "userId2" to userId2,
                    "limit" to limit,
                    "offset" to offset
                )

                val response = GraphQLApiClient.execute(query, variables, DirectMessagesResponse::class.java)
                NetworkResult.Success(response?.directMessages ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar mensagens")
            }
        }
    }

    suspend fun sendDirectMessage(
        senderId: String,
        recipientId: String,
        content: String
    ): NetworkResult<DirectMessageDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation SendDirectMessage(${'$'}senderId: ID!, ${'$'}recipientId: ID!, ${'$'}content: String!) {
                        sendDirectMessage(senderId: ${'$'}senderId, recipientId: ${'$'}recipientId, content: ${'$'}content) {
                            id
                            senderId
                            recipientId
                            content
                            read
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "senderId" to senderId,
                    "recipientId" to recipientId,
                    "content" to content
                )

                val response = GraphQLApiClient.execute(mutation, variables, SendDirectMessageResponse::class.java)
                val msg = response?.sendDirectMessage
                if (msg != null) {
                    NetworkResult.Success(msg)
                } else {
                    NetworkResult.Error("Falha ao enviar mensagem")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao enviar mensagem")
            }
        }
    }

    suspend fun markAsRead(messageId: String, recipientId: String): NetworkResult<DirectMessageDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation MarkDirectMessageAsRead(${'$'}messageId: ID!, ${'$'}recipientId: ID!) {
                        markDirectMessageAsRead(messageId: ${'$'}messageId, recipientId: ${'$'}recipientId) {
                            id
                            read
                        }
                    }
                """.trimIndent()

                val variables = mapOf("messageId" to messageId, "recipientId" to recipientId)
                val response = GraphQLApiClient.execute(mutation, variables, MarkDirectMessageAsReadResponse::class.java)
                val msg = response?.markDirectMessageAsRead
                if (msg != null) {
                    NetworkResult.Success(msg)
                } else {
                    NetworkResult.Error("Falha ao marcar como lida")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao atualizar status de leitura")
            }
        }
    }
}
