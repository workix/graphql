package br.com.codecode.workix.android.data

import br.com.codecode.workix.android.data.model.CompanyGraphQL
import br.com.codecode.workix.android.data.model.JobGraphQL
import br.com.codecode.workix.android.data.model.PaginatedListJobData
import br.com.codecode.workix.android.network.NetworkResult
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Testes unitários para validar estruturas de dados e comportamento do módulo de Vagas.
 */
class JobRepositoryTest {

    @Test
    fun `modelo JobGraphQL instancia e mapeia relacionamentos corretamente`() {
        val company = CompanyGraphQL(
            id = "1",
            name = "Packsys Informática",
            description = "Empresa de Tecnologia",
            logo = "http://logo.png"
        )

        val job = JobGraphQL(
            id = "10",
            title = "Desenvolvedor Fullstack",
            description = "Vaga para atuar com Vue.js e GraphQL",
            benefits = "VR, VA, VT",
            requirement = "TypeScript, GraphQL, Node.js",
            jobCategory = "MANAGEMENT",
            jobType = "FULLTIME",
            minPayment = 5000.0,
            maxPayment = 10000.0,
            featured = true,
            activated = true,
            createdAt = "2026-08-30T10:00:00Z",
            company = company
        )

        assertEquals("10", job.id)
        assertEquals("Desenvolvedor Fullstack", job.title)
        assertEquals("Packsys Informática", job.company?.name)
        assertTrue(job.featured == true)
        assertEquals(5000.0, job.minPayment)
    }

    @Test
    fun `modelo PaginatedListJobData encapsula contagem e paginacao`() {
        val listData = PaginatedListJobData(
            jobs = listOf(),
            totalPages = 3,
            currentPage = 1,
            maxRows = 25
        )

        assertEquals(3, listData.totalPages)
        assertEquals(1, listData.currentPage)
        assertEquals(25, listData.maxRows)
        assertTrue(listData.jobs?.isEmpty() == true)
    }
}
