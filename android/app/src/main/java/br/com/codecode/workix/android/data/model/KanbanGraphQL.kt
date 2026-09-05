package br.com.codecode.workix.android.data.model

data class KanbanCardHistoryGraphQL(
    val id: String?,
    val cardId: String?,
    val fromStageId: String?,
    val toStageId: String?,
    val notes: String?,
    val createdAt: String?
)

data class KanbanCardGraphQL(
    val id: String?,
    val uuid: String?,
    val stageId: String?,
    val candidateId: String?,
    val jobId: String?,
    val orderPosition: Int? = 1,
    val rating: Int? = null,
    val notes: String? = null,
    val tags: List<String>? = emptyList(),
    val candidate: CandidateGraphQL? = null,
    val histories: List<KanbanCardHistoryGraphQL>? = emptyList(),
    val createdAt: String?
)

data class KanbanStageGraphQL(
    val id: String?,
    val uuid: String?,
    val companyId: String?,
    val jobId: String?,
    val name: String?,
    val color: String? = "#3B82F6",
    val orderPosition: Int? = 1,
    val isSystemStage: Boolean? = false,
    val cards: List<KanbanCardGraphQL>? = emptyList()
)

data class KanbanBoardGraphQL(
    val jobId: String?,
    val companyId: String?,
    val stages: List<KanbanStageGraphQL>? = emptyList()
)

data class KanbanBoardResponse(
    val getRecruitmentBoard: KanbanBoardGraphQL?
)

data class MoveKanbanCardInput(
    val cardId: String,
    val targetStageId: String,
    val targetPosition: Int? = null,
    val notes: String? = null
)
