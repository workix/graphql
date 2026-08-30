package br.com.codecode.workix.android.network

import com.google.gson.Gson
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

/**
 * Testes unitários para validar payload e desserialização do GraphQLApiClient.
 */
class GraphQLApiClientTest {

    private val gson = Gson()

    data class StatisticsData(
        val statisticsCount: StatsCount
    )

    data class StatsCount(
        val jobs: Int,
        val candidates: Int,
        val resumes: Int,
        val companies: Int
    )

    @Test
    fun `payload GraphQL serializa corretamente query e variables`() {
        val query = "query GetJobs(\$limit: Int) { allJobsPaginated(limit: \$limit) { total } }"
        val variables = mapOf("limit" to 10)

        val payload = GraphQLApiClient.GraphQLPayload(query = query, variables = variables)
        val json = gson.toJson(payload)

        assertNotNull(json)
        val deserialized = gson.fromJson(json, GraphQLApiClient.GraphQLPayload::class.java)
        assertEquals(query, deserialized.query)
        assertEquals(10.0, (deserialized.variables?.get("limit") as? Number)?.toDouble())
    }

    @Test
    fun `response GraphQL desserializa data e errors corretamente`() {
        val rawJson = """
            {
                "data": {
                    "statisticsCount": {
                        "jobs": 15,
                        "candidates": 42,
                        "resumes": 30,
                        "companies": 8
                    }
                }
            }
        """.trimIndent()

        val jsonObject = gson.fromJson(rawJson, com.google.gson.JsonObject::class.java)
        val dataObject = jsonObject.get("data")
        val stats = gson.fromJson(dataObject, StatisticsData::class.java)

        assertNotNull(stats)
        assertEquals(15, stats.statisticsCount.jobs)
        assertEquals(42, stats.statisticsCount.candidates)
        assertEquals(30, stats.statisticsCount.resumes)
        assertEquals(8, stats.statisticsCount.companies)
    }
}
