package br.com.codecode.workix.android

import br.com.codecode.workix.android.data.model.*
import org.junit.Assert.*
import org.junit.Test

class RecruitmentCapabilitiesTest {

    @Test
    fun testJobConfidentialModel() {
        val job = JobGraphQL(
            id = "1",
            title = "Diretor de Tecnologia",
            description = "Oportunidade confidencial",
            benefits = "Saúde, Bônus",
            requirement = "Experiência Executiva",
            jobCategory = "MANAGEMENT",
            jobType = "FULLTIME",
            isConfidential = true,
            createdAt = "2026-09-05",
            company = CompanyGraphQL(id = "10", name = "Empresa Confidencial", description = null, logo = null)
        )

        assertTrue(job.isConfidential == true)
        assertEquals("Empresa Confidencial", job.company?.name)
    }

    @Test
    fun testCandidateCareerStatusAndResume() {
        val resume = NormalizedResumeGraphQL(
            id = "100",
            candidateId = "5",
            rawMarkdown = "# Desenvolvedor Kotlin\n## Habilidades\n- Kotlin, Coroutines, Jetpack Compose",
            summary = "Especialista Android",
            skills = listOf("Kotlin", "Coroutines", "Compose"),
            careerGoals = "Liderança Técnica Mobile",
            completenessScore = 90,
            createdAt = "2026-09-05",
            updatedAt = "2026-09-05"
        )

        val candidate = CandidateGraphQL(
            id = "5",
            uuid = "uuid-555",
            name = "Carlos Souza",
            birthDate = "1995-04-10",
            city = "Belo Horizonte",
            state = "MG",
            lookingForJob = true,
            inCareerTransition = true,
            careerTransitionTarget = "Tech Lead Android",
            acceptsEntryLevel = false,
            normalizedResume = resume,
            createdAt = "2026-09-05",
            updatedAt = "2026-09-05"
        )

        assertTrue(candidate.lookingForJob == true)
        assertTrue(candidate.inCareerTransition == true)
        assertEquals("Tech Lead Android", candidate.careerTransitionTarget)
        assertEquals(90, candidate.normalizedResume?.completenessScore)
        assertEquals(3, candidate.normalizedResume?.skills?.size)
    }

    @Test
    fun testInterviewModel() {
        val interview = InterviewGraphQL(
            id = "20",
            uuid = "uuid-int-20",
            companyId = "10",
            candidateId = "5",
            jobId = "1",
            title = "Entrevista Técnica Android",
            description = "Arquitetura MVVM e Coroutines",
            scheduledAt = "2026-09-12T14:00:00Z",
            durationMinutes = 60,
            format = "ONLINE",
            meetingLink = "https://meet.google.com/xyz-test",
            locationAddress = null,
            status = "CONFIRMED",
            rescheduleReason = null,
            feedbackNotes = null,
            candidateFeedback = "Confirmado!",
            createdAt = "2026-09-05"
        )

        assertEquals("ONLINE", interview.format)
        assertEquals("CONFIRMED", interview.status)
        assertEquals("https://meet.google.com/xyz-test", interview.meetingLink)
    }

    @Test
    fun testKanbanBoardModel() {
        val card = KanbanCardGraphQL(
            id = "300",
            uuid = "uuid-card-300",
            stageId = "1",
            candidateId = "5",
            jobId = "1",
            orderPosition = 1,
            rating = 5,
            notes = "Excelente aderência técnica",
            tags = listOf("Kotlin", "Senior"),
            createdAt = "2026-09-05"
        )

        val stage = KanbanStageGraphQL(
            id = "1",
            uuid = "uuid-stage-1",
            companyId = "10",
            jobId = "1",
            name = "Triagem",
            color = "#3B82F6",
            orderPosition = 1,
            cards = listOf(card)
        )

        val board = KanbanBoardGraphQL(
            jobId = "1",
            companyId = "10",
            stages = listOf(stage)
        )

        assertEquals(1, board.stages?.size)
        assertEquals("Triagem", board.stages?.first()?.name)
        assertEquals(1, board.stages?.first()?.cards?.size)
        assertEquals(5, board.stages?.first()?.cards?.first()?.rating)
    }
}
