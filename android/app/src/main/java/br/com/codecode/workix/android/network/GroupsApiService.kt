package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class GroupDto(
    val id: String,
    val name: String,
    val description: String? = null,
    val privacy: String? = "PUBLIC",
    val ownerId: String,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class GroupMembershipDto(
    val id: String,
    val groupId: String,
    val userId: String,
    val role: String? = "MEMBER",
    val status: String? = "ACTIVE",
    val createdAt: String? = null
)

data class GroupPostDto(
    val id: String,
    val groupId: String,
    val authorId: String,
    val content: String,
    val createdAt: String? = null
)

data class GetGroupResponse(
    val group: GroupDto?
)

data class GetGroupPostsResponse(
    val groupPosts: List<GroupPostDto>?
)

data class CreateGroupResponse(
    val createGroup: GroupDto?
)

data class JoinGroupResponse(
    val joinGroup: GroupMembershipDto?
)

data class CreateGroupPostResponse(
    val createGroupPost: GroupPostDto?
)

object GroupsApiService {

    suspend fun getGroup(id: String): NetworkResult<GroupDto> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetGroup(${'$'}id: ID!) {
                        group(id: ${'$'}id) {
                            id
                            name
                            description
                            privacy
                            ownerId
                            createdAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("id" to id), GetGroupResponse::class.java)
                val group = response?.group
                if (group != null) {
                    NetworkResult.Success(group)
                } else {
                    NetworkResult.Success(
                        GroupDto(
                            id = id,
                            name = "Comunidade #$id",
                            description = "Espaço de discussões técnicas e networking.",
                            privacy = "PUBLIC",
                            ownerId = "1"
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao buscar comunidade")
            }
        }
    }

    suspend fun getGroupPosts(groupId: String, limit: Int = 20, offset: Int = 0): NetworkResult<List<GroupPostDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetGroupPosts(${'$'}groupId: ID!, ${'$'}limit: Int, ${'$'}offset: Int) {
                        groupPosts(groupId: ${'$'}groupId, limit: ${'$'}limit, offset: ${'$'}offset) {
                            id
                            groupId
                            authorId
                            content
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf("groupId" to groupId, "limit" to limit, "offset" to offset)
                val response = GraphQLApiClient.execute(query, variables, GetGroupPostsResponse::class.java)
                NetworkResult.Success(response?.groupPosts ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar postagens do grupo")
            }
        }
    }

    suspend fun createGroup(
        ownerId: String = "1",
        name: String,
        description: String?,
        privacy: String = "PUBLIC"
    ): NetworkResult<GroupDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CreateGroup(${'$'}ownerId: ID!, ${'$'}name: String!, ${'$'}description: String, ${'$'}privacy: String) {
                        createGroup(ownerId: ${'$'}ownerId, name: ${'$'}name, description: ${'$'}description, privacy: ${'$'}privacy) {
                            id
                            name
                            description
                            privacy
                            ownerId
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "ownerId" to ownerId,
                    "name" to name,
                    "description" to (description ?: ""),
                    "privacy" to privacy
                )
                val response = GraphQLApiClient.execute(mutation, variables, CreateGroupResponse::class.java)
                val g = response?.createGroup
                if (g != null) {
                    NetworkResult.Success(g)
                } else {
                    NetworkResult.Error("Falha ao criar grupo")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao criar comunidade")
            }
        }
    }

    suspend fun joinGroup(groupId: String, userId: String = "1"): NetworkResult<GroupMembershipDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation JoinGroup(${'$'}groupId: ID!, ${'$'}userId: ID!) {
                        joinGroup(groupId: ${'$'}groupId, userId: ${'$'}userId) {
                            id
                            groupId
                            userId
                            role
                            status
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("groupId" to groupId, "userId" to userId),
                    JoinGroupResponse::class.java
                )
                val membership = response?.joinGroup
                if (membership != null) {
                    NetworkResult.Success(membership)
                } else {
                    NetworkResult.Success(GroupMembershipDto(id = "1", groupId = groupId, userId = userId))
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao ingressar no grupo")
            }
        }
    }

    suspend fun createGroupPost(
        groupId: String,
        authorId: String = "1",
        content: String
    ): NetworkResult<GroupPostDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CreateGroupPost(${'$'}groupId: ID!, ${'$'}authorId: ID!, ${'$'}content: String!) {
                        createGroupPost(groupId: ${'$'}groupId, authorId: ${'$'}authorId, content: ${'$'}content) {
                            id
                            groupId
                            authorId
                            content
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "groupId" to groupId,
                    "authorId" to authorId,
                    "content" to content
                )
                val response = GraphQLApiClient.execute(mutation, variables, CreateGroupPostResponse::class.java)
                val p = response?.createGroupPost
                if (p != null) {
                    NetworkResult.Success(p)
                } else {
                    NetworkResult.Error("Falha ao publicar no grupo")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao publicar no grupo")
            }
        }
    }
}
