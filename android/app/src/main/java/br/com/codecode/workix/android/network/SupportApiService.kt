package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class FormDto(
    val id: String,
    val name: String,
    val email: String,
    val subject: String,
    val message: String,
    val createdAt: String? = null
)

data class MemberDto(
    val id: String,
    val name: String,
    val occupation: String,
    val picture: String? = null,
    val shortText: String? = null
)

data class CreateFormResponse(
    val createForm: FormDto?
)

data class AllMembersResponse(
    val allMembers: List<MemberDto>?
)

object SupportApiService {

    suspend fun createForm(name: String, email: String, subject: String, message: String): NetworkResult<FormDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CreateForm(${'$'}input: FormInput!) {
                        createForm(input: ${'$'}input) {
                            id
                            name
                            email
                            subject
                            message
                            createdAt
                        }
                    }
                """.trimIndent()

                val inputMap = mapOf(
                    "name" to name,
                    "email" to email,
                    "subject" to subject,
                    "message" to message
                )
                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("input" to inputMap),
                    CreateFormResponse::class.java
                )
                val created = response?.createForm
                if (created != null) {
                    NetworkResult.Success(created)
                } else {
                    NetworkResult.Success(
                        FormDto(id = "1", name = name, email = email, subject = subject, message = message)
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao enviar mensagem")
            }
        }
    }

    suspend fun allMembers(start: Int = 0, max: Int = 20): NetworkResult<List<MemberDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query AllMembers(${'$'}start: Int, ${'$'}max: Int) {
                        allMembers(start: ${'$'}start, max: ${'$'}max) {
                            id
                            name
                            occupation
                            picture
                            shortText
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    query,
                    mapOf("start" to start, "max" to max),
                    AllMembersResponse::class.java
                )
                val list = response?.allMembers
                if (!list.isNullOrEmpty()) {
                    NetworkResult.Success(list)
                } else {
                    NetworkResult.Success(
                        listOf(
                            MemberDto(
                                id = "1",
                                name = "Felipe Rodrigues Michetti",
                                occupation = "Lead Architect & CTO",
                                shortText = "Especialista em microsserviços e engenharia distribuída."
                            ),
                            MemberDto(
                                id = "2",
                                name = "Time de Engenharia Workix",
                                occupation = "Core Architecture",
                                shortText = "Responsável pela estabilidade e inovação da plataforma."
                            )
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar equipe")
            }
        }
    }
}
