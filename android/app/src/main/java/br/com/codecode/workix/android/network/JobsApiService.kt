package br.com.codecode.workix.android.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

data class JobDto(
    val id: Int,
    val title: String,
    val description: String? = null,
    val company_name: String? = null,
    val location: String? = null,
    val contract_type: String? = null,
    val salary: String? = null,
    val created_at: String? = null
)

data class PaginatedJobsResponse(
    val data: List<JobDto>,
    val total: Int,
    val page: Int,
    val totalPages: Int
)

data class CreateJobRequest(
    val title: String,
    val description: String,
    val location: String? = null,
    val contract_type: String? = null,
    val salary: String? = null
)

data class JobSubscriptionRequest(
    val job_id: Any
)

interface JobsApiService {
    @GET("/jobs/paginated")
    suspend fun getPaginatedJobs(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10,
        @Query("q") query: String? = null,
        @Query("location") location: String? = null,
        @Query("contract_type") contractType: String? = null
    ): Response<PaginatedJobsResponse>

    @GET("/jobs/{id}")
    suspend fun getJobById(@Path("id") id: String): Response<JobDto>

    @POST("/jobs")
    suspend fun createJob(@Body request: CreateJobRequest): Response<JobDto>

    @POST("/jobs/subscribe")
    suspend fun subscribeJob(@Body request: JobSubscriptionRequest): Response<Map<String, Any>>
}
