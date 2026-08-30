package br.com.codecode.workix.android.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import br.com.codecode.workix.android.data.SessionManager
import br.com.codecode.workix.android.network.ApiClient
import br.com.codecode.workix.android.network.AuthApiService
import br.com.codecode.workix.android.network.AuthResponse
import br.com.codecode.workix.android.network.LoginRequest
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.RegisterRequest
import kotlinx.coroutines.launch

/**
 * ViewModel em Kotlin para gerenciamento do fluxo e estado de autenticação (Login e Cadastro).
 */
class AuthViewModel(application: Application) : AndroidViewModel(application) {
    private val sessionManager = SessionManager.getInstance(application)
    private val authService = ApiClient.createService(AuthApiService::class.java)

    private val _loginState = MutableLiveData<NetworkResult<AuthResponse>>()
    val loginState: LiveData<NetworkResult<AuthResponse>> = _loginState

    private val _registerState = MutableLiveData<NetworkResult<AuthResponse>>()
    val registerState: LiveData<NetworkResult<AuthResponse>> = _registerState

    fun login(email: String, password: String) {
        _loginState.value = NetworkResult.Loading
        viewModelScope.launch {
            try {
                val request = LoginRequest(email = email, password = password, password_hash = password)
                val response = authService.login(request)
                if (response.isSuccessful && response.body() != null) {
                    val authData = response.body()!!
                    sessionManager.saveAuthToken(authData.token)
                    authData.user?.let { sessionManager.saveUser(it) }
                    _loginState.postValue(NetworkResult.Success(authData))
                } else {
                    _loginState.postValue(NetworkResult.Error("Credenciais inválidas ou erro no servidor (${response.code()})"))
                }
            } catch (e: Exception) {
                _loginState.postValue(NetworkResult.Error("Falha de conexão: ${e.localizedMessage}", throwable = e))
            }
        }
    }

    fun register(email: String, password: String, name: String, role: String) {
        _registerState.value = NetworkResult.Loading
        viewModelScope.launch {
            try {
                val request = RegisterRequest(email = email, password = password, name = name, role = role)
                val response = authService.registerUser(request)
                if (response.isSuccessful && response.body() != null) {
                    val authData = response.body()!!
                    sessionManager.saveAuthToken(authData.token)
                    authData.user?.let { sessionManager.saveUser(it) }
                    _registerState.postValue(NetworkResult.Success(authData))
                } else {
                    _registerState.postValue(NetworkResult.Error("Erro ao cadastrar usuário (${response.code()})"))
                }
            } catch (e: Exception) {
                _registerState.postValue(NetworkResult.Error("Falha na requisição de cadastro: ${e.localizedMessage}", throwable = e))
            }
        }
    }

    fun isLoggedIn(): Boolean = sessionManager.isLoggedIn()

    fun logout() {
        sessionManager.logout()
    }
}
