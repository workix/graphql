package br.com.codecode.workix.android.ui.home

import br.com.codecode.workix.android.ui.jobs.JobsListFragment
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

class CategoryNavigationTest {

    @Test
    fun testJobsListFragmentFactoryWithCategory() {
        val fragment = JobsListFragment.newInstance(category = "ESTAGIO")
        assertNotNull(fragment)
        assertEquals("arg_initial_category", JobsListFragment.ARG_INITIAL_CATEGORY)
    }

    @Test
    fun testJobsListFragmentFactoryWithoutCategory() {
        val fragment = JobsListFragment.newInstance(category = null)
        assertNotNull(fragment)
    }

    @Test
    fun testCategoryListCompleteness() {
        val expectedCodes = setOf(
            "MEIO_PERIODO",
            "PRIMEIRA_OPORTUNIDADE",
            "ESTAGIO",
            "NOTURNO",
            "TEMPORARIO",
            "FREELANCE",
            "PERICULOSIDADE"
        )

        assertEquals(7, expectedCodes.size)
    }
}
