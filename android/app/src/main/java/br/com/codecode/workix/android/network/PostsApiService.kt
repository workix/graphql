package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class PostDto(
    val id: String,
    val authorId: String,
    val content: String,
    val mediaIds: List<String>? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    var reactionsCount: Int = 0,
    var commentsCount: Int = 0,
    var userReaction: String? = null
)

data class PostReactionDto(
    val id: String,
    val postId: String,
    val userId: String,
    val type: String,
    val createdAt: String? = null
)

data class PostCommentDto(
    val id: String,
    val postId: String,
    val authorId: String,
    val content: String,
    val createdAt: String? = null
)

data class SocialFeedResponse(
    val socialFeed: List<PostDto>?
)

data class PostReactionsResponse(
    val postReactions: List<PostReactionDto>?
)

data class PostCommentsResponse(
    val postComments: List<PostCommentDto>?
)

data class CreatePostResponse(
    val createPost: PostDto?
)

data class ReactToPostResponse(
    val reactToPost: PostReactionDto?
)

data class CommentOnPostResponse(
    val commentOnPost: PostCommentDto?
)

object PostsApiService {

    suspend fun getSocialFeed(userId: String = "1", limit: Int = 20, offset: Int = 0): NetworkResult<List<PostDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query SocialFeed(${'$'}userId: ID!, ${'$'}limit: Int, ${'$'}offset: Int) {
                        socialFeed(userId: ${'$'}userId, limit: ${'$'}limit, offset: ${'$'}offset) {
                            id
                            authorId
                            content
                            mediaIds
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

                val response = GraphQLApiClient.execute(query, variables, SocialFeedResponse::class.java)
                NetworkResult.Success(response?.socialFeed ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao obter feed social")
            }
        }
    }

    suspend fun createPost(authorId: String, content: String): NetworkResult<PostDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CreatePost(${'$'}authorId: ID!, ${'$'}content: String!) {
                        createPost(authorId: ${'$'}authorId, content: ${'$'}content) {
                            id
                            authorId
                            content
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "authorId" to authorId,
                    "content" to content
                )

                val response = GraphQLApiClient.execute(mutation, variables, CreatePostResponse::class.java)
                val post = response?.createPost
                if (post != null) {
                    NetworkResult.Success(post)
                } else {
                    NetworkResult.Error("Falha ao criar postagem")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao publicar")
            }
        }
    }

    suspend fun reactToPost(postId: String, userId: String, type: String): NetworkResult<PostReactionDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation ReactToPost(${'$'}postId: ID!, ${'$'}userId: ID!, ${'$'}type: String!) {
                        reactToPost(postId: ${'$'}postId, userId: ${'$'}userId, type: ${'$'}type) {
                            id
                            postId
                            userId
                            type
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "postId" to postId,
                    "userId" to userId,
                    "type" to type
                )

                val response = GraphQLApiClient.execute(mutation, variables, ReactToPostResponse::class.java)
                val reaction = response?.reactToPost
                if (reaction != null) {
                    NetworkResult.Success(reaction)
                } else {
                    NetworkResult.Error("Falha ao reagir")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao enviar reação")
            }
        }
    }

    suspend fun getComments(postId: String): NetworkResult<List<PostCommentDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query PostComments(${'$'}postId: ID!) {
                        postComments(postId: ${'$'}postId) {
                            id
                            postId
                            authorId
                            content
                            createdAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("postId" to postId), PostCommentsResponse::class.java)
                NetworkResult.Success(response?.postComments ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar comentários")
            }
        }
    }

    suspend fun addComment(postId: String, authorId: String, content: String): NetworkResult<PostCommentDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CommentOnPost(${'$'}postId: ID!, ${'$'}authorId: ID!, ${'$'}content: String!) {
                        commentOnPost(postId: ${'$'}postId, authorId: ${'$'}authorId, content: ${'$'}content) {
                            id
                            postId
                            authorId
                            content
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "postId" to postId,
                    "authorId" to authorId,
                    "content" to content
                )

                val response = GraphQLApiClient.execute(mutation, variables, CommentOnPostResponse::class.java)
                val comment = response?.commentOnPost
                if (comment != null) {
                    NetworkResult.Success(comment)
                } else {
                    NetworkResult.Error("Falha ao enviar comentário")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao comentar")
            }
        }
    }
}
