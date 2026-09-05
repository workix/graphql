package br.com.codecode.workix.android.data.model

import com.google.gson.Gson
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class JobSearchTest {

    private val gson = Gson()

    @Test
    fun testJobFilterInputSerialization() {
        val filter = JobFilterInput(
            keyword = "Engenheiro",
            categories = listOf("FREELANCE", "MEIO_PERIODO"),
            employmentType = "PJ",
            isPcd = false,
            isRemote = true
        )

        val map = filter.toMap()
        assertEquals("Engenheiro", map["keyword"])
        assertEquals(listOf("FREELANCE", "MEIO_PERIODO"), map["categories"])
        assertEquals("PJ", map["employmentType"])
        assertEquals(false, map["isPcd"])
        assertEquals(true, map["isRemote"])
    }

    @Test
    fun testJobSearchResponseDeserialization() {
        val rawJson = """
            {
                "searchJobs": {
                    "jobs": [
                        {
                            "id": "10",
                            "title": "Desenvolvedor Backend Node.js",
                            "description": "API GraphQL e microsserviços",
                            "categories": ["FREELANCE", "NOTURNO"],
                            "employmentType": "PJ",
                            "isPcd": false,
                            "isRemote": true
                        }
                    ],
                    "totalCount": 1,
                    "page": 1,
                    "totalPages": 1,
                    "facets": {
                        "categories": {
                            "FREELANCE": 1,
                            "NOTURNO": 1
                        },
                        "employmentTypes": {
                            "PJ": 1
                        }
                    }
                }
            }
        """.trimIndent()

        val response = gson.fromJson(rawJson, JobSearchResponse::class.java)
        assertNotNull(response)
        assertNotNull(response.searchJobs)
        assertEquals(1, response.searchJobs?.totalCount)
        assertEquals(1, response.searchJobs?.jobs?.size)

        val job = response.searchJobs?.jobs?.first()
        assertEquals("10", job?.id)
        assertEquals("Desenvolvedor Backend Node.js", job?.title)
        assertEquals(listOf("FREELANCE", "NOTURNO"), job?.categories)
        assertEquals("PJ", job?.employmentType)
        assertTrue(job?.isRemote == true)

        val facets = response.searchJobs?.facets
        assertNotNull(facets)
        assertEquals(1, facets?.categories?.get("FREELANCE"))
        assertEquals(1, facets?.employmentTypes?.get("PJ"))
    }
}
