package br.com.codecode.workix.android.network

import com.apollographql.apollo3.ApolloClient
import com.apollographql.apollo3.network.okHttpClient
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import java.util.concurrent.TimeUnit

object ApolloClientProvider {
    private const val GRAPHQL_ENDPOINT = "http://10.0.2.2:4000/graphql"

    private var authTokenProvider: (() -> String?)? = null

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

    val apolloClient: ApolloClient by lazy {
        ApolloClient.Builder()
            .serverUrl(GRAPHQL_ENDPOINT)
            .okHttpClient(okHttpClient)
            .build()
    }
}
