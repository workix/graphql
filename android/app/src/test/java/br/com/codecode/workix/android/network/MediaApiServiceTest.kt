package br.com.codecode.workix.android.network

import com.google.gson.Gson
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Testes unitários para MediaApiService e DTOs de upload de mídia no Android.
 */
class MediaApiServiceTest {

    private val gson = Gson()

    @Test
    fun `desserializacao de UploadUrlResponseDto e RequestUploadUrlResponse`() {
        val json = """
            {
                "requestUploadUrl": {
                    "uploadUrl": "http://10.0.2.2:4000/api/v1/media/upload/asset-999",
                    "mediaId": "asset-999"
                }
            }
        """.trimIndent()

        val response = gson.fromJson(json, RequestUploadUrlResponse::class.java)
        assertNotNull(response.requestUploadUrl)
        assertEquals("http://10.0.2.2:4000/api/v1/media/upload/asset-999", response.requestUploadUrl?.uploadUrl)
        assertEquals("asset-999", response.requestUploadUrl?.mediaId)
    }

    @Test
    fun `desserializacao de DirectUploadResponseDto`() {
        val json = """
            {
                "success": true,
                "message": "Upload direto realizado com sucesso",
                "url": "http://10.0.2.2:4000/uploads/media/profile-123.jpg",
                "mediaId": "media-123",
                "asset": {
                    "id": "media-123",
                    "originalName": "avatar.jpg",
                    "mimeType": "image/jpeg",
                    "size": 102400,
                    "status": "READY",
                    "url": "http://10.0.2.2:4000/uploads/media/profile-123.jpg"
                }
            }
        """.trimIndent()

        val dto = gson.fromJson(json, DirectUploadResponseDto::class.java)
        assertTrue(dto.success)
        assertEquals("media-123", dto.mediaId)
        assertEquals("http://10.0.2.2:4000/uploads/media/profile-123.jpg", dto.url)
        assertNotNull(dto.asset)
        assertEquals("READY", dto.asset?.status)
        assertEquals("image/jpeg", dto.asset?.mimeType)
        assertEquals(102400L, dto.asset?.size)
    }

    @Test
    fun `desserializacao de ConfirmUploadResponse`() {
        val json = """
            {
                "confirmUpload": true
            }
        """.trimIndent()

        val response = gson.fromJson(json, ConfirmUploadResponse::class.java)
        assertEquals(true, response.confirmUpload)
    }

    @Test
    fun `MediaApiService lida com falha de conexao sem quebrar aplicacao`() = runBlocking {
        // Tentar enviar para host inexistente deve retornar NetworkResult.Error de forma controlada
        val result = MediaApiService.uploadBinaryFile("http://localhost:59999/invalid", byteArrayOf(1, 2, 3), "image/png")
        assertTrue(result is NetworkResult.Error)
    }
}
