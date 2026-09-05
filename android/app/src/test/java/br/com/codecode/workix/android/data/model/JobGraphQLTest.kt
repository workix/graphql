package br.com.codecode.workix.android.data.model

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

class JobGraphQLTest {

    @Test
    fun testJobGraphQLModelWithCategoriesAndEmploymentType() {
        val categories = listOf("ESTAGIO", "MEIO_PERIODO", "NOTURNO")
        val job = JobGraphQL(
            id = "1",
            title = "Desenvolvedor Android Kotlin",
            description = "Vaga para desenvolvimento mobile",
            benefits = "VR + VT",
            requirement = "Kotlin, Coroutines, Jetpack",
            jobCategory = "OPERATOR",
            jobType = "PARTTIME",
            categories = categories,
            employmentType = "PJ",
            minPayment = 4000.0,
            maxPayment = 7000.0,
            featured = true,
            activated = true,
            createdAt = "2026-09-05T12:00:00Z",
            company = CompanyGraphQL(id = "1", name = "Tech Corp", description = "TI", logo = null)
        )

        assertEquals("1", job.id)
        assertEquals("Desenvolvedor Android Kotlin", job.title)
        assertEquals(3, job.categories?.size)
        assertEquals("ESTAGIO", job.categories?.get(0))
        assertEquals("PJ", job.employmentType)
    }

    @Test
    fun testJobGraphQLDefaultValues() {
        val job = JobGraphQL(
            id = "2",
            title = "Vaga Legada",
            description = null,
            benefits = null,
            requirement = null,
            jobCategory = null,
            jobType = null,
            minPayment = null,
            maxPayment = null,
            featured = null,
            activated = null,
            createdAt = null,
            company = null
        )

        assertEquals("2", job.id)
        assertNotNull(job.categories)
        assertEquals(0, job.categories?.size)
        assertEquals("CLT", job.employmentType)
    }
}
