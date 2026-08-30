package br.com.codecode.workix.android.data.model

data class JobGraphQL(
    val id: String?,
    val title: String?,
    val description: String?,
    val benefits: String?,
    val requirement: String?,
    val jobCategory: String?,
    val jobType: String?,
    val minPayment: Double?,
    val maxPayment: Double?,
    val featured: Boolean?,
    val activated: Boolean?,
    val createdAt: String?,
    val company: CompanyGraphQL?
)

data class CompanyGraphQL(
    val id: String?,
    val name: String?,
    val description: String?,
    val logo: String?
)

data class PaginatedListJobResponse(
    val allJobsPaginated: PaginatedListJobData?
)

data class SingleJobResponse(
    val getJobById: JobGraphQL?
)

data class SubscribeInJobResponse(
    val subscribeInJob: Boolean?
)

data class PaginatedListJobData(
    val jobs: List<JobGraphQL>?,
    val totalPages: Int?,
    val currentPage: Int?,
    val maxRows: Int?
)
