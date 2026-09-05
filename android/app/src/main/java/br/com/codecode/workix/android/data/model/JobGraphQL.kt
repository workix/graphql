package br.com.codecode.workix.android.data.model

data class JobGraphQL(
    val id: String?,
    val title: String?,
    val description: String?,
    val benefits: String? = null,
    val requirement: String? = null,
    val jobCategory: String? = null,
    val jobType: String? = null,
    val categories: List<String>? = emptyList(),
    val employmentType: String? = "CLT",
    val minPayment: Double? = null,
    val maxPayment: Double? = null,
    val featured: Boolean? = false,
    val activated: Boolean? = true,
    val isPcd: Boolean? = false,
    val isRemote: Boolean? = false,
    val isConfidential: Boolean? = false,
    val createdAt: String? = null,
    val company: CompanyGraphQL? = null
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

data class JobFilterInput(
    val keyword: String? = null,
    val categories: List<String>? = null,
    val employmentType: String? = null,
    val isPcd: Boolean? = null,
    val isRemote: Boolean? = null
) {
    fun toMap(): Map<String, Any?> {
        val map = mutableMapOf<String, Any?>()
        keyword?.let { map["keyword"] = it }
        categories?.let { if (it.isNotEmpty()) map["categories"] = it }
        employmentType?.let { map["employmentType"] = it }
        isPcd?.let { map["isPcd"] = it }
        isRemote?.let { map["isRemote"] = it }
        return map
    }
}

data class JobSearchFacetsData(
    val categories: Map<String, Int>? = emptyMap(),
    val employmentTypes: Map<String, Int>? = emptyMap()
)

data class JobSearchData(
    val jobs: List<JobGraphQL>?,
    val totalCount: Int?,
    val page: Int?,
    val totalPages: Int?,
    val facets: JobSearchFacetsData? = null
)

data class JobSearchResponse(
    val searchJobs: JobSearchData?
)

