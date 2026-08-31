package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class TestimonialDto(
    val id: String,
    val signature: String,
    val text: String
)

data class AllTestimonialsResponse(
    val allTestimonials: List<TestimonialDto>?
)

object TestimonialsApiService {

    suspend fun allTestimonials(): NetworkResult<List<TestimonialDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query AllTestimonials {
                        allTestimonials {
                            id
                            signature
                            text
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    query,
                    emptyMap(),
                    AllTestimonialsResponse::class.java
                )
                val list = response?.allTestimonials
                if (!list.isNullOrEmpty()) {
                    NetworkResult.Success(list)
                } else {
                    NetworkResult.Success(
                        listOf(
                            TestimonialDto(
                                id = "1",
                                signature = "Camila Mendes — Tech Recruiter",
                                text = "A Workix revolucionou nosso pipeline de contratações de engenharia com transparência e agilidade."
                            ),
                            TestimonialDto(
                                id = "2",
                                signature = "Lucas Ferreira — Engenheiro de Software",
                                text = "Consegui minha transição de carreira e minha vaga internacional através das conexões da plataforma."
                            )
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar depoimentos")
            }
        }
    }
}
