package br.com.codecode.workix.android.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

data class ResumeDto(
    val id: Int,
    val candidate_name: String? = null,
    val title: String? = null,
    val summary: String? = null,
    val skills: String? = null,
    val experience: String? = null,
    val education: String? = null
)

data class PaginatedResumesResponse(
    val data: List<ResumeDto>,
    val total: Int,
    val page: Int,
    val totalPages: Int
)

data class SaveResumeRequest(
    val title: String,
    val summary: String? = null,
    val skills: String? = null,
    val experience: String? = null,
    val education: String? = null
)

interface ResumesApiService {
    @GET("/resumes/list_with_candidates_short_paginated")
    suspend fun getPaginatedResumes(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10,
        @Query("q") query: String? = null
    ): Response<PaginatedResumesResponse>

    @GET("/resumes/{id}")
    suspend fun getResumeById(@Path("id") id: String): Response<ResumeDto>

    @POST("/resumes")
    suspend fun saveResume(@Body request: SaveResumeRequest): Response<ResumeDto>
}
