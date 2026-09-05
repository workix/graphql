package br.com.codecode.workix.android.network

import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

data class UploadUrlResponseDto(
    val uploadUrl: String? = null,
    val mediaId: String? = null
)

data class DirectUploadResponseDto(
    val success: Boolean = false,
    val message: String? = null,
    val url: String? = null,
    val mediaId: String? = null,
    val asset: MediaAssetDto? = null
)

data class MediaAssetDto(
    val id: String? = null,
    val originalName: String? = null,
    val mimeType: String? = null,
    val size: Long = 0,
    val status: String? = null,
    val url: String? = null
)

data class RequestUploadUrlResponse(
    val requestUploadUrl: UploadUrlResponseDto?
)

data class ConfirmUploadResponse(
    val confirmUpload: Boolean?
)

object MediaApiService {

    private val gson = Gson()

    /**
     * Requisita uma URL de upload pré-assinada ou local via GraphQL.
     */
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
                if (data != null && !data.uploadUrl.isNullOrBlank()) {
                    NetworkResult.Success(data)
                } else {
                    NetworkResult.Error("Falha ao obter URL de upload do servidor")
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro ao solicitar URL de upload")
            }
        }
    }

    /**
     * Envia o arquivo binário para a URL retornada por requestUploadUrl.
     */
    suspend fun uploadBinaryFile(targetUrl: String, fileBytes: ByteArray, contentType: String): NetworkResult<String> {
        return withContext(Dispatchers.IO) {
            try {
                val fullUrl = if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
                    targetUrl
                } else {
                    val baseUrl = ApiClient.getBaseUrl().trimEnd('/')
                    val path = if (targetUrl.startsWith("/")) targetUrl else "/$targetUrl"
                    "$baseUrl$path"
                }

                val mediaType = contentType.toMediaTypeOrNull()
                val requestBody = fileBytes.toRequestBody(mediaType)

                val request = Request.Builder()
                    .url(fullUrl)
                    .put(requestBody)
                    .build()

                ApiClient.client.newCall(request).execute().use { response ->
                    if (response.isSuccessful) {
                        val responseBody = response.body?.string()
                        val finalUrl = try {
                            val json = gson.fromJson(responseBody, JsonObject::class.java)
                            if (json != null && json.has("url")) json.get("url").asString else fullUrl
                        } catch (_: Exception) {
                            fullUrl
                        }
                        NetworkResult.Success(finalUrl)
                    } else {
                        NetworkResult.Error("Falha no upload do arquivo (HTTP ${response.code}): ${response.message}")
                    }
                }
            } catch (e: IOException) {
                NetworkResult.Error("Erro de conexão no upload: ${e.message}")
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro desconhecido durante o upload")
            }
        }
    }

    /**
     * Realiza o upload direto para o endpoint REST do backend.
     */
    suspend fun directUpload(fileBytes: ByteArray, fileName: String, contentType: String, context: String = "general"): NetworkResult<DirectUploadResponseDto> {
        return withContext(Dispatchers.IO) {
            try {
                val baseUrl = ApiClient.getBaseUrl().trimEnd('/')
                val url = "$baseUrl/api/v1/media/direct-upload?context=$context&fileName=$fileName"

                val mediaType = contentType.toMediaTypeOrNull()
                val requestBody = fileBytes.toRequestBody(mediaType)

                val request = Request.Builder()
                    .url(url)
                    .post(requestBody)
                    .build()

                ApiClient.client.newCall(request).execute().use { response ->
                    val responseBody = response.body?.string() ?: ""
                    if (response.isSuccessful) {
                        val dto = gson.fromJson(responseBody, DirectUploadResponseDto::class.java)
                        NetworkResult.Success(dto)
                    } else {
                        NetworkResult.Error("Falha no upload direto (HTTP ${response.code}): $responseBody")
                    }
                }
            } catch (e: IOException) {
                NetworkResult.Error("Erro de conexão no upload direto: ${e.message}")
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Erro desconhecido no upload direto")
            }
        }
    }

    /**
     * Confirma a persistência do upload via GraphQL.
     */
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
