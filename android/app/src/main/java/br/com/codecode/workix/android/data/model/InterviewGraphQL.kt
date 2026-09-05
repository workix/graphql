package br.com.codecode.workix.android.data.model

enum class InterviewStatus {
    SCHEDULED,
    CONFIRMED,
    REJECTED,
    RESCHEDULE_REQUESTED,
    COMPLETED,
    CANCELLED
}

enum class InterviewFormat {
    ONLINE,
    IN_PERSON,
    PHONE
}

data class InterviewGraphQL(
    val id: String?,
    val uuid: String?,
    val companyId: String?,
    val candidateId: String?,
    val jobId: String?,
    val title: String?,
    val description: String?,
    val scheduledAt: String?,
    val durationMinutes: Int? = 45,
    val format: String? = "ONLINE",
    val meetingLink: String?,
    val locationAddress: String?,
    val status: String? = "SCHEDULED",
    val rescheduleReason: String?,
    val feedbackNotes: String?,
    val candidateFeedback: String?,
    val createdAt: String?,
    val company: CompanyGraphQL? = null,
    val candidate: CandidateGraphQL? = null,
    val job: JobGraphQL? = null
)

data class SingleInterviewResponse(
    val getInterviewById: InterviewGraphQL?
)

data class ListInterviewsResponse(
    val listInterviewsByCompany: List<InterviewGraphQL>?,
    val listInterviewsByCandidate: List<InterviewGraphQL>?
)

data class RespondInterviewInput(
    val status: String,
    val rescheduleReason: String? = null,
    val candidateFeedback: String? = null
)

data class CreateInterviewInput(
    val companyId: String,
    val candidateId: String,
    val jobId: String? = null,
    val title: String,
    val description: String? = null,
    val scheduledAt: String,
    val durationMinutes: Int = 45,
    val format: String = "ONLINE",
    val meetingLink: String? = null,
    val locationAddress: String? = null
)
