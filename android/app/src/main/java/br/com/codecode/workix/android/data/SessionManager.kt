package br.com.codecode.workix.android.data

import android.content.Context
import android.content.SharedPreferences
import br.com.codecode.workix.android.network.UserDto
import com.google.gson.Gson

class SessionManager private constructor(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val gson = Gson()

    companion object {
        private const val PREF_NAME = "workix_prefs"
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_USER = "user_data"

        @Volatile
        private var instance: SessionManager? = null

        fun getInstance(context: Context): SessionManager {
            return instance ?: synchronized(this) {
                instance ?: SessionManager(context.applicationContext).also { instance = it }
            }
        }
    }

    fun saveAuthToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
    }

    fun getAuthToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun saveUser(user: UserDto) {
        val userJson = gson.toJson(user)
        prefs.edit().putString(KEY_USER, userJson).apply()
    }

    fun getUser(): UserDto? {
        val userJson = prefs.getString(KEY_USER, null)
        return if (userJson != null) {
            gson.fromJson(userJson, UserDto::class.java)
        } else {
            null
        }
    }

    fun isLoggedIn(): Boolean {
        return getAuthToken() != null
    }

    fun logout() {
        prefs.edit().clear().apply()
    }
}
