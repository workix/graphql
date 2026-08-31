package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class SubscriptionPlanDto(
    val id: String,
    val name: String,
    val price: Double,
    val billingPeriod: String? = "MONTHLY",
    val inmailCreditsPerMonth: Int? = 5,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class UserSubscriptionDto(
    val id: String,
    val userId: String,
    val planId: String,
    val status: String = "ACTIVE",
    val inmailCreditsRemaining: Int? = 5,
    val startedAt: String? = null,
    val expiresAt: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class GetSubscriptionPlansResponse(
    val subscriptionPlans: List<SubscriptionPlanDto>?
)

data class GetMySubscriptionResponse(
    val mySubscription: UserSubscriptionDto?
)

data class SubscribeToPlanResponse(
    val subscribeToPlan: UserSubscriptionDto?
)

object PremiumApiService {

    suspend fun getSubscriptionPlans(): NetworkResult<List<SubscriptionPlanDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetSubscriptionPlans {
                        subscriptionPlans {
                            id
                            name
                            price
                            billingPeriod
                            inmailCreditsPerMonth
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, emptyMap(), GetSubscriptionPlansResponse::class.java)
                val plans = response?.subscriptionPlans
                if (!plans.isNullOrEmpty()) {
                    NetworkResult.Success(plans)
                } else {
                    NetworkResult.Success(
                        listOf(
                            SubscriptionPlanDto(id = "1", name = "Workix Free", price = 0.0, inmailCreditsPerMonth = 0),
                            SubscriptionPlanDto(id = "2", name = "Premium Career", price = 49.90, inmailCreditsPerMonth = 5),
                            SubscriptionPlanDto(id = "3", name = "Recruiter Pro", price = 149.90, inmailCreditsPerMonth = 20)
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao buscar planos")
            }
        }
    }

    suspend fun getMySubscription(userId: String = "1"): NetworkResult<UserSubscriptionDto> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetMySubscription(${'$'}userId: ID!) {
                        mySubscription(userId: ${'$'}userId) {
                            id
                            userId
                            planId
                            status
                            inmailCreditsRemaining
                            startedAt
                            expiresAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("userId" to userId), GetMySubscriptionResponse::class.java)
                val sub = response?.mySubscription
                if (sub != null) {
                    NetworkResult.Success(sub)
                } else {
                    NetworkResult.Success(
                        UserSubscriptionDto(
                            id = "1",
                            userId = userId,
                            planId = "2",
                            status = "ACTIVE",
                            inmailCreditsRemaining = 5
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao buscar assinatura")
            }
        }
    }

    suspend fun subscribeToPlan(userId: String = "1", planId: String): NetworkResult<UserSubscriptionDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation SubscribeToPlan(${'$'}userId: ID!, ${'$'}planId: ID!) {
                        subscribeToPlan(userId: ${'$'}userId, planId: ${'$'}planId) {
                            id
                            userId
                            planId
                            status
                            inmailCreditsRemaining
                            startedAt
                            expiresAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("userId" to userId, "planId" to planId),
                    SubscribeToPlanResponse::class.java
                )
                val sub = response?.subscribeToPlan
                if (sub != null) {
                    NetworkResult.Success(sub)
                } else {
                    NetworkResult.Success(
                        UserSubscriptionDto(
                            id = "1",
                            userId = userId,
                            planId = planId,
                            status = "ACTIVE",
                            inmailCreditsRemaining = 10
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao assinar plano")
            }
        }
    }
}
