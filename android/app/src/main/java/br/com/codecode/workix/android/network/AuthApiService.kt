package br.com.codecode.workix.android.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

data class LoginRequest(
    val email: String,
    val password_hash: String? = null,
    val password: String? = null
)

data class AuthResponse(
    val token: String,
    val user: UserDto? = null
)

data class UserDto(
    val id: Int,
    val email: String,
    val name: String? = null,
    val role: String? = null,
    val firebase_uuid: String? = null
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val name: String,
    val role: String // "CANDIDATE" ou "COMPANY"
)

interface AuthApiService {
    @POST("/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("/auth/login")
    suspend fun authLogin(@Body request: LoginRequest): Response<AuthResponse>

    @POST("/users/register")
    suspend fun registerUser(@Body request: RegisterRequest): Response<AuthResponse>
}
