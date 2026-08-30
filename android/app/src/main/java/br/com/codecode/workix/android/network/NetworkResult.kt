package br.com.codecode.workix.android.network

/**
 * Sealed class genérica para encapsular o estado de requisições de rede.
 */
sealed class NetworkResult<out T> {
    data class Success<out T>(val data: T) : NetworkResult<T>()
    data class Error(val message: String, val statusCode: Int? = null, val throwable: Throwable? = null) : NetworkResult<Nothing>()
    object Loading : NetworkResult<Nothing>()
}
