package br.com.codecode.workix.android.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

data class BlogDto(
    val id: Int,
    val title: String,
    val content: String,
    val author: String? = null,
    val created_at: String? = null
)

data class PaginatedBlogsResponse(
    val data: List<BlogDto>,
    val total: Int,
    val page: Int,
    val totalPages: Int
)

data class CreateBlogCommentRequest(
    val blog_id: Any,
    val comment: String
)

interface BlogsApiService {
    @GET("/blogs/paginated")
    suspend fun getPaginatedBlogs(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10
    ): Response<PaginatedBlogsResponse>

    @GET("/blogs/{id}")
    suspend fun getBlogById(@Path("id") id: String): Response<BlogDto>

    @POST("/comments/blog")
    suspend fun createComment(@Body request: CreateBlogCommentRequest): Response<Map<String, Any>>
}
