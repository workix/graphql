package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class NotificationDto(
    val id: String,
    val userId: String,
    val type: String,
    val title: String,
    val body: String,
    val read: Boolean = false,
    val data: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class MyNotificationsResponse(
    val myNotifications: List<NotificationDto>?
)

data class UnreadNotificationsCountResponse(
    val unreadNotificationsCount: Int?
)

data class MarkNotificationAsReadResponse(
    val markNotificationAsRead: NotificationDto?
)

object NotificationsApiService {

    suspend fun getMyNotifications(
        userId: String = "1",
        limit: Int = 50,
        offset: Int = 0
    ): NetworkResult<List<NotificationDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query MyNotifications(${'$'}userId: ID!, ${'$'}limit: Int, ${'$'}offset: Int) {
                        myNotifications(userId: ${'$'}userId, limit: ${'$'}limit, offset: ${'$'}offset) {
                            id
                            userId
                            type
                            title
                            body
                            read
                            data
                            createdAt
                            updatedAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "userId" to userId,
                    "limit" to limit,
                    "offset" to offset
                )

                val response = GraphQLApiClient.execute(query, variables, MyNotificationsResponse::class.java)
                NetworkResult.Success(response?.myNotifications ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter notificações")
            }
        }
    }

    suspend fun getUnreadCount(userId: String = "1"): NetworkResult<Int> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query UnreadNotificationsCount(${'$'}userId: ID!) {
                        unreadNotificationsCount(userId: ${'$'}userId)
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), UnreadNotificationsCountResponse::class.java)
                NetworkResult.Success(response?.unreadNotificationsCount ?: 0)
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter contagem de não lidas")
            }
        }
    }

    suspend fun markAsRead(id: String, userId: String = "1"): NetworkResult<NotificationDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation MarkNotificationAsRead(${'$'}id: ID!, ${'$'}userId: ID!) {
                        markNotificationAsRead(id: ${'$'}id, userId: ${'$'}userId) {
                            id
                            read
                            updatedAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf("id" to id, "userId" to userId)
                val response = GraphQLApiClient.execute(mutation, variables, MarkNotificationAsReadResponse::class.java)
                val notif = response?.markNotificationAsRead
                if (notif != null) {
                    NetworkResult.Success(notif)
                } else {
                    NetworkResult.Error("Falha ao marcar notificação como lida")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao marcar como lida")
            }
        }
    }
}
