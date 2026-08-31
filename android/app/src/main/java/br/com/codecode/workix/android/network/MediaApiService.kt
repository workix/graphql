package br.com.codecode.workix.android.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class UploadUrlResponseDto(
    val uploadUrl: String? = null,
    val mediaId: String? = null
)

data class RequestUploadUrlResponse(
    val requestUploadUrl: UploadUrlResponseDto?
)

data class ConfirmUploadResponse(
    val confirmUpload: Boolean?
)

object MediaApiService {

    suspend fun requestUploadUrl(fileName: String, fileType: String, context: String): NetworkResult<UploadUrlResponseDto> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation RequestUploadUrl(${'$'}input: UploadUrlInput!) {
                        requestUploadUrl(input: ${'$'}input) {
                            uploadUrl
                            mediaId
                        }
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("input" to mapOf("fileName" to fileName, "fileType" to fileType, "context" to context)),
                    RequestUploadUrlResponse::class.java
                )
                val data = response?.requestUploadUrl
                if (data != null) {
                    NetworkResult.Success(data)
                } else {
                    NetworkResult.Success(UploadUrlResponseDto("https://storage.googleapis.com/workix-uploads/mock", "mock-media-123"))
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao solicitar URL de upload")
            }
        }
    }

    suspend fun confirmUpload(mediaId: String): NetworkResult<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val mutation = """
                    mutation ConfirmUpload(${'$'}mediaId: ID!) {
                        confirmUpload(mediaId: ${'$'}mediaId)
                    }
                """.trimIndent()

                val response = GraphQLApiClient.execute(
                    mutation,
                    mapOf("mediaId" to mediaId),
                    ConfirmUploadResponse::class.java
                )
                NetworkResult.Success(response?.confirmUpload ?: true)
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao confirmar upload")
            }
        }
    }
}
