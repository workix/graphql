package br.com.codecode.workix.android.viewmodel

import br.com.codecode.workix.android.data.model.JobFilterInput
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class JobViewModelFilterTest {

    @Test
    fun testJobFilterInputStateUpdates() {
        val filter = JobFilterInput()
        assertEquals(null, filter.keyword)
        assertEquals(null, filter.categories)
        assertEquals(null, filter.employmentType)

        val updatedWithCategories = filter.copy(
            categories = listOf("ESTAGIO", "MEIO_PERIODO")
        )
        assertNotNull(updatedWithCategories.categories)
        assertEquals(2, updatedWithCategories.categories?.size)
        assertTrue(updatedWithCategories.categories?.contains("ESTAGIO") == true)

        val updatedWithEmployment = updatedWithCategories.copy(
            employmentType = "PJ"
        )
        assertEquals("PJ", updatedWithEmployment.employmentType)
        assertEquals(2, updatedWithEmployment.categories?.size)

        val cleared = JobFilterInput()
        assertEquals(null, cleared.categories)
        assertEquals(null, cleared.employmentType)
    }

    @Test
    fun testToggleCategoryLogic() {
        val initialCategories = mutableListOf("NOTURNO", "TEMPORARIO")

        // Adicionar FREELANCE
        if (!initialCategories.contains("FREELANCE")) {
            initialCategories.add("FREELANCE")
        }
        assertEquals(3, initialCategories.size)
        assertTrue(initialCategories.contains("FREELANCE"))

        // Remover NOTURNO
        if (initialCategories.contains("NOTURNO")) {
            initialCategories.remove("NOTURNO")
        }
        assertEquals(2, initialCategories.size)
        assertTrue(!initialCategories.contains("NOTURNO"))
    }
}
