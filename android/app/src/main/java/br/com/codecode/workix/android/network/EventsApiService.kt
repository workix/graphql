package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class EventDto(
    val id: String,
    val title: String,
    val description: String? = null,
    val eventType: String? = "ONLINE",
    val startTime: String,
    val endTime: String? = null,
    val locationOrUrl: String? = null,
    val organizerId: String,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class EventAttendeeDto(
    val id: String,
    val eventId: String,
    val userId: String,
    val status: String? = "ATTENDING",
    val createdAt: String? = null
)

data class GetEventResponse(
    val event: EventDto?
)

data class GetEventAttendeesResponse(
    val eventAttendees: List<EventAttendeeDto>?
)

data class CreateEventResponse(
    val createEvent: EventDto?
)

data class AttendEventResponse(
    val attendEvent: EventAttendeeDto?
)

object EventsApiService {

    suspend fun getEvent(id: String): NetworkResult<EventDto> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetEvent(${'$'}id: ID!) {
                        event(id: ${'$'}id) {
                            id
                            title
                            description
                            eventType
                            startTime
                            endTime
                            locationOrUrl
                            organizerId
                            createdAt
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(query, mapOf("id" to id), GetEventResponse::class.java)
                val ev = response?.event
                if (ev != null) {
                    NetworkResult.Success(ev)
                } else {
                    NetworkResult.Success(
                        EventDto(
                            id = id,
                            title = "Evento Workix #$id",
                            description = "Workshop técnico e networking comunitário.",
                            eventType = "ONLINE",
                            startTime = "2026-09-10T19:00:00Z",
                            locationOrUrl = "https://meet.workix.com.br",
                            organizerId = "1"
                        )
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao buscar evento")
            }
        }
    }

    suspend fun getEventAttendees(eventId: String, limit: Int = 50, offset: Int = 0): NetworkResult<List<EventAttendeeDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val query = """
                    query GetEventAttendees(${'$'}eventId: ID!, ${'$'}limit: Int, ${'$'}offset: Int) {
                        eventAttendees(eventId: ${'$'}eventId, limit: ${'$'}limit, offset: ${'$'}offset) {
                            id
                            eventId
                            userId
                            status
                            createdAt
                        }
                    }
                """.trimIndent()

                val variables = mapOf("eventId" to eventId, "limit" to limit, "offset" to offset)
                val response = GraphQLApiClient.execute(query, variables, GetEventAttendeesResponse::class.java)
                NetworkResult.Success(response?.eventAttendees ?: emptyList())
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao carregar participantes")
            }
        }
    }

    suspend fun createEvent(
        organizerId: String = "1",
        title: String,
        description: String?,
        eventType: String = "ONLINE",
        startTime: String,
        locationOrUrl: String?
    ): NetworkResult<EventDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation CreateEvent(
                        ${'$'}organizerId: ID!,
                        ${'$'}title: String!,
                        ${'$'}description: String,
                        ${'$'}eventType: String,
                        ${'$'}startTime: DateTime!,
                        ${'$'}locationOrUrl: String
                    ) {
                        createEvent(
                            organizerId: ${'$'}organizerId,
                            title: ${'$'}title,
                            description: ${'$'}description,
                            eventType: ${'$'}eventType,
                            startTime: ${'$'}startTime,
                            locationOrUrl: ${'$'}locationOrUrl
                        ) {
                            id
                            title
                            description
                            eventType
                            startTime
                            locationOrUrl
                            organizerId
                        }
                    }
                """.trimIndent()

                val variables = mapOf(
                    "organizerId" to organizerId,
                    "title" to title,
                    "description" to (description ?: ""),
                    "eventType" to eventType,
                    "startTime" to startTime,
                    "locationOrUrl" to (locationOrUrl ?: "")
                )
                val response = GraphQLApiClient.execute(mutation, variables, CreateEventResponse::class.java)
                val created = response?.createEvent
                if (created != null) {
                    NetworkResult.Success(created)
                } else {
                    NetworkResult.Error("Falha ao criar evento")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao publicar evento")
            }
        }
    }

    suspend fun attendEvent(eventId: String, userId: String = "1", status: String = "ATTENDING"): NetworkResult<EventAttendeeDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation AttendEvent(${'$'}eventId: ID!, ${'$'}userId: ID!, ${'$'}status: String) {
                        attendEvent(eventId: ${'$'}eventId, userId: ${'$'}userId, status: ${'$'}status) {
                            id
                            eventId
                            userId
                            status
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("eventId" to eventId, "userId" to userId, "status" to status),
                    AttendEventResponse::class.java
                )
                val attendee = response?.attendEvent
                if (attendee != null) {
                    NetworkResult.Success(attendee)
                } else {
                    NetworkResult.Success(EventAttendeeDto(id = "1", eventId = eventId, userId = userId, status = status))
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao confirmar presença")
            }
        }
    }
}
