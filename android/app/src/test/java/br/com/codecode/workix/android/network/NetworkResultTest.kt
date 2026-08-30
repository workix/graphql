package br.com.codecode.workix.android.network

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Testes unitários para validar a abstração NetworkResult.
 */
class NetworkResultTest {

    @Test
    fun `networkResult Success encapsula corretamente o dado do modelo`() {
        val testData = "Sucesso na Operação"
        val result = NetworkResult.Success(testData)

        assertTrue(result is NetworkResult.Success)
        assertEquals(testData, (result as NetworkResult.Success).data)
    }

    @Test
    fun `networkResult Error retorna mensagem e código de status`() {
        val errorMessage = "Erro de Autenticação"
        val statusCode = 401
        val result = NetworkResult.Error(message = errorMessage, statusCode = statusCode)

        assertTrue(result is NetworkResult.Error)
        val errorState = result as NetworkResult.Error
        assertEquals(errorMessage, errorState.message)
        assertEquals(statusCode, errorState.statusCode)
    }

    @Test
    fun `networkResult Loading representa o estado de carregamento`() {
        val result = NetworkResult.Loading
        assertTrue(result is NetworkResult.Loading)
    }
}
