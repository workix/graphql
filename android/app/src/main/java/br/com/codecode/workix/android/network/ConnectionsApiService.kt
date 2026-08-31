package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class ConnectionDto(
    val id: String,
    val userId1: String,
    val userId2: String,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class ConnectionRequestDto(
    val id: String,
    val requesterId: String,
    val recipientId: String,
    val status: String,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class MyConnectionsResponse(
    val myConnections: List<ConnectionDto>?
)

data class PendingConnectionRequestsResponse(
    val pendingConnectionRequests: List<ConnectionRequestDto>?
)

data class SendConnectionRequestResponse(
    val sendConnectionRequest: ConnectionRequestDto?
)

data class AcceptConnectionRequestResponse(
    val acceptConnectionRequest: ConnectionDto?
)

data class RejectConnectionRequestResponse(
    val rejectConnectionRequest: ConnectionRequestDto?
)

data class FollowUserResponse(
    val followUser: Boolean?
)

data class UnfollowUserResponse(
    val unfollowUser: Boolean?
)

object ConnectionsApiService {

    suspend fun getMyConnections(userId: String = "1"): NetworkResult<List<ConnectionDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query MyConnections(${'$'}userId: ID!) {
                        myConnections(userId: ${'$'}userId) {
                            id
                            userId1
                            userId2
                            createdAt
                            updatedAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), MyConnectionsResponse::class.java)
                NetworkResult.Success(response?.myConnections ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter conexões")
            }
        }
    }

    suspend fun getPendingRequests(userId: String = "1"): NetworkResult<List<ConnectionRequestDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query PendingConnectionRequests(${'$'}userId: ID!) {
                        pendingConnectionRequests(userId: ${'$'}userId) {
                            id
                            requesterId
                            recipientId
                            status
                            createdAt
                            updatedAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), PendingConnectionRequestsResponse::class.java)
                NetworkResult.Success(response?.pendingConnectionRequests ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter solicitações pendentes")
            }
        }
    }

    suspend fun sendConnectionRequest(requesterId: String, recipientId: String): NetworkResult<ConnectionRequestDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation SendConnectionRequest(${'$'}requesterId: ID!, ${'$'}recipientId: ID!) {
                        sendConnectionRequest(requesterId: ${'$'}requesterId, recipientId: ${'$'}recipientId) {
                            id
                            requesterId
                            recipientId
                            status
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf("requesterId" to requesterId, "recipientId" to recipientId)
                val response = GraphQLApiClient.execute(mutation, variables, SendConnectionRequestResponse::class.java)
                val req = response?.sendConnectionRequest
                if (req != null) {
                    NetworkResult.Success(req)
                } else {
                    NetworkResult.Error("Falha ao enviar convite")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao enviar solicitação")
            }
        }
    }

    suspend fun acceptConnectionRequest(requestId: String, recipientId: String): NetworkResult<ConnectionDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation AcceptConnectionRequest(${'$'}requestId: ID!, ${'$'}recipientId: ID!) {
                        acceptConnectionRequest(requestId: ${'$'}requestId, recipientId: ${'$'}recipientId) {
                            id
                            userId1
                            userId2
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf("requestId" to requestId, "recipientId" to recipientId)
                val response = GraphQLApiClient.execute(mutation, variables, AcceptConnectionRequestResponse::class.java)
                val conn = response?.acceptConnectionRequest
                if (conn != null) {
                    NetworkResult.Success(conn)
                } else {
                    NetworkResult.Error("Falha ao aceitar convite")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao aceitar solicitação")
            }
        }
    }

    suspend fun rejectConnectionRequest(requestId: String, recipientId: String): NetworkResult<ConnectionRequestDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation RejectConnectionRequest(${'$'}requestId: ID!, ${'$'}recipientId: ID!) {
                        rejectConnectionRequest(requestId: ${'$'}requestId, recipientId: ${'$'}recipientId) {
                            id
                            requesterId
                            recipientId
                            status
                        }
                    }
                """.trimIndent()

                val variables = mapOf("requestId" to requestId, "recipientId" to recipientId)
                val response = GraphQLApiClient.execute(mutation, variables, RejectConnectionRequestResponse::class.java)
                val req = response?.rejectConnectionRequest
                if (req != null) {
                    NetworkResult.Success(req)
                } else {
                    NetworkResult.Error("Falha ao recusar convite")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao recusar solicitação")
            }
        }
    }

    suspend fun followUser(followerId: String, followingId: String): NetworkResult<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation FollowUser(${'$'}followerId: ID!, ${'$'}followingId: ID!) {
                        followUser(followerId: ${'$'}followerId, followingId: ${'$'}followingId)
                    }
                """.trimIndent()

                val variables = mapOf("followerId" to followerId, "followingId" to followingId)
                val response = GraphQLApiClient.execute(mutation, variables, FollowUserResponse::class.java)
                NetworkResult.Success(response?.followUser ?: false)
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao seguir usuário")
            }
        }
    }
}
