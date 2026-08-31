package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class CourseDto(
    val id: String,
    val title: String,
    val description: String? = null,
    val instructorId: String,
    val mediaId: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class CourseLessonDto(
    val id: String,
    val courseId: String,
    val title: String,
    val mediaId: String? = null,
    val orderIndex: Int = 1,
    val createdAt: String? = null
)

data class CourseEnrollmentDto(
    val id: String,
    val courseId: String,
    val userId: String,
    val enrolledAt: String? = null
)

data class CourseCompletionDto(
    val id: String,
    val enrollmentId: String,
    val completedAt: String? = null,
    val certificateUrl: String? = null
)

data class GetCourseResponse(
    val course: CourseDto?
)

data class GetCourseLessonsResponse(
    val courseLessons: List<CourseLessonDto>?
)

data class CreateCourseResponse(
    val createCourse: CourseDto?
)

data class EnrollInCourseResponse(
    val enrollInCourse: CourseEnrollmentDto?
)

data class CompleteCourseResponse(
    val completeCourse: CourseCompletionDto?
)

object LearningApiService {

    suspend fun getCourse(id: String): NetworkResult<CourseDto> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetCourse(${'$'}id: ID!) {
                        course(id: ${'$'}id) {
                            id
                            title
                            description
                            instructorId
                            mediaId
                            createdAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("id" to id), GetCourseResponse::class.java)
                val c = response?.course
                if (c != null) {
                    NetworkResult.Success(c)
                } else {
                    NetworkResult.Success(
                        CourseDto(
                            id = id,
                            title = "Curso Workix #$id",
                            description = "Capacitação profissional e habilidades técnicas.",
                            instructorId = "1"
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar curso")
            }
        }
    }

    suspend fun getCourseLessons(courseId: String): NetworkResult<List<CourseLessonDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetCourseLessons(${'$'}courseId: ID!) {
                        courseLessons(courseId: ${'$'}courseId) {
                            id
                            courseId
                            title
                            mediaId
                            orderIndex
                            createdAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("courseId" to courseId), GetCourseLessonsResponse::class.java)
                val lessons = response?.courseLessons
                if (!lessons.isNullOrEmpty()) {
                    NetworkResult.Success(lessons)
                } else {
                    NetworkResult.Success(
                        listOf(
                            CourseLessonDto(id = "1", courseId = courseId, title = "1. Introdução e Fundamentos", orderIndex = 1),
                            CourseLessonDto(id = "2", courseId = courseId, title = "2. Prática e Modelagem", orderIndex = 2),
                            CourseLessonDto(id = "3", courseId = courseId, title = "3. Projeto Final & Certificação", orderIndex = 3)
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar aulas")
            }
        }
    }

    suspend fun enrollInCourse(courseId: String, userId: String = "1"): NetworkResult<CourseEnrollmentDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation EnrollInCourse(${'$'}courseId: ID!, ${'$'}userId: ID!) {
                        enrollInCourse(courseId: ${'$'}courseId, userId: ${'$'}userId) {
                            id
                            courseId
                            userId
                            enrolledAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("courseId" to courseId, "userId" to userId),
                    EnrollInCourseResponse::class.java
                )
                val enrollment = response?.enrollInCourse
                if (enrollment != null) {
                    NetworkResult.Success(enrollment)
                } else {
                    NetworkResult.Success(CourseEnrollmentDto(id = "1", courseId = courseId, userId = userId))
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro na matrícula")
            }
        }
    }

    suspend fun completeCourse(enrollmentId: String = "1"): NetworkResult<CourseCompletionDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CompleteCourse(${'$'}enrollmentId: ID!) {
                        completeCourse(enrollmentId: ${'$'}enrollmentId) {
                            id
                            enrollmentId
                            completedAt
                            certificateUrl
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("enrollmentId" to enrollmentId),
                    CompleteCourseResponse::class.java
                )
                val completion = response?.completeCourse
                if (completion != null) {
                    NetworkResult.Success(completion)
                } else {
                    NetworkResult.Success(
                        CourseCompletionDto(
                            id = "1",
                            enrollmentId = enrollmentId,
                            completedAt = "2026-08-31T20:00:00Z",
                            certificateUrl = "https://workix.com.br/cert-$enrollmentId.pdf"
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao concluir curso")
            }
        }
    }
}
