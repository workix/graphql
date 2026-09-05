package br.com.codecode.workix.android.data.model

data class NormalizedResumeGraphQL(
    val id: String?,
    val candidateId: String?,
    val rawMarkdown: String?,
    val summary: String?,
    val skills: List<String>? = emptyList(),
    val careerGoals: String?,
    val completenessScore: Int? = 0,
    val createdAt: String?,
    val updatedAt: String?
)

data class CandidateGraphQL(
    val id: String?,
    val uuid: String?,
    val name: String?,
    val birthDate: String?,
    val city: String?,
    val state: String?,
    val lookingForJob: Boolean? = false,
    val inCareerTransition: Boolean? = false,
    val careerTransitionTarget: String? = null,
    val acceptsEntryLevel: Boolean? = false,
    val normalizedResume: NormalizedResumeGraphQL? = null,
    val createdAt: String?,
    val updatedAt: String?
)

data class CandidateSearchFilterInput(
    val lookingForJob: Boolean? = null,
    val inCareerTransition: Boolean? = null,
    val careerTransitionTarget: String? = null,
    val acceptsEntryLevel: Boolean? = null,
    val state: String? = null,
    val city: String? = null,
    val skills: List<String>? = null,
    val keywords: String? = null
)

data class CandidateFacetItemData(
    val key: String,
    val count: Int
)

data class CandidateSearchFacetsData(
    val lookingForJobCount: Int = 0,
    val inCareerTransitionCount: Int = 0,
    val acceptsEntryLevelCount: Int = 0,
    val states: List<CandidateFacetItemData> = emptyList(),
    val skills: List<CandidateFacetItemData> = emptyList(),
    val careerTransitionTargets: List<CandidateFacetItemData> = emptyList()
)

data class CandidateSearchData(
    val candidates: List<CandidateGraphQL>?,
    val totalCount: Int?,
    val page: Int?,
    val totalPages: Int?,
    val facets: CandidateSearchFacetsData? = null
)

data class CandidateSearchResponse(
    val searchCandidates: CandidateSearchData?
)
