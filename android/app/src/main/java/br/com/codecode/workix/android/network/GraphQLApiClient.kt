package br.com.codecode.workix.android.network

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.reflect.TypeToken
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.logging.HttpLoggingInterceptor
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * Cliente HTTP para execução de operações GraphQL no Android.
 * Conecta nativamente em http://10.0.2.2:4000/graphql (emulador) ou host customizado.
 */
object GraphQLApiClient {
    private const val DEFAULT_ENDPOINT = "http://10.0.2.2:4000/graphql"

    private var endpointUrl: String = DEFAULT_ENDPOINT
    private var authTokenProvider: (() -> String?)? = null
    private val gson = Gson()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    fun setEndpointUrl(url: String) {
        endpointUrl = url
    }

    fun setAuthTokenProvider(provider: () -> String?) {
        authTokenProvider = provider
    }

    private val loggingInterceptor by lazy {
        HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
    }

    private val okHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor { authTokenProvider?.invoke() })
            .addInterceptor(loggingInterceptor)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .build()
    }

    data class GraphQLPayload(
        val query: String,
        val variables: Map<String, Any?>? = null
    )

    data class GraphQLResponse<T>(
        val data: T?,
        val errors: List<GraphQLErrorItem>?
    )

    data class GraphQLErrorItem(
        val message: String?
    )

    /**
     * Executa uma requisição GraphQL síncrona retornando o objeto desserializado do campo 'data'.
     */
    @Throws(IOException::class, GraphQLException::class)
    fun <T> execute(query: String, variables: Map<String, Any?>? = null, responseType: Class<T>): T? {
        val payload = GraphQLPayload(query = query.trim(), variables = variables)
        val jsonPayload = gson.toJson(payload)
        val body = jsonPayload.toRequestBody(jsonMediaType)

        val request = Request.Builder()
            .url(endpointUrl)
            .post(body)
            .build()

        okHttpClient.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw IOException("Erro HTTP ${response.code}: ${response.message}")
            }

            val responseBody = response.body?.string() ?: throw IOException("Corpo da resposta vazio")
            val jsonObject = gson.fromJson(responseBody, JsonObject::class.java)

            if (jsonObject.has("errors") && !jsonObject.get("errors").isJsonNull) {
                val errorsArray = jsonObject.getAsJsonArray("errors")
                if (errorsArray.size() > 0) {
                    val messages = (0 until errorsArray.size()).mapNotNull { i ->
                        errorsArray.get(i).asJsonObject.get("message")?.asString
                    }.joinToString("; ")
                    throw GraphQLException("GraphQL Error: $messages")
                }
            }

            if (jsonObject.has("data") && !jsonObject.get("data").isJsonNull) {
                val dataObject = jsonObject.get("data")
                return gson.fromJson(dataObject, responseType)
            }

            return null
        }
    }
}

class GraphQLException(message: String) : Exception(message)
