package br.com.codecode.workix.util

import android.annotation.TargetApi
import android.content.Context
import android.content.SharedPreferences
import android.content.res.Configuration
import android.content.res.Resources
import android.os.Build
import java.util.Locale

/**
 * Utilitário para gerenciamento de localização e idioma dinâmico no Android
 * Suporta pt-BR, en-US e es-ES com persistência em SharedPreferences.
 */
object LocaleHelper {

    private const val SELECTED_LANGUAGE = "Locale.Helper.Selected.Language"
    private const val DEFAULT_LANGUAGE = "pt"
    private const val DEFAULT_COUNTRY = "BR"

    fun onAttach(context: Context): Context {
        val lang = getPersistedData(context, DEFAULT_LANGUAGE)
        return setLocale(context, lang)
    }

    fun onAttach(context: Context, defaultLanguage: String): Context {
        val lang = getPersistedData(context, defaultLanguage)
        return setLocale(context, lang)
    }

    fun getLanguage(context: Context): String {
        return getPersistedData(context, DEFAULT_LANGUAGE)
    }

    fun setLocale(context: Context, language: String): Context {
        persist(context, language)

        val locale = when (language.lowercase()) {
            "en", "en-us", "en_us" -> Locale("en", "US")
            "es", "es-es", "es_es" -> Locale("es", "ES")
            else -> Locale("pt", "BR")
        }

        Locale.setDefault(locale)

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            updateResources(context, locale)
        } else {
            updateResourcesLegacy(context, locale)
        }
    }

    private fun getPersistedData(context: Context, defaultLanguage: String): String {
        val preferences: SharedPreferences = context.getSharedPreferences("workix_prefs", Context.MODE_PRIVATE)
        return preferences.getString(SELECTED_LANGUAGE, defaultLanguage) ?: defaultLanguage
    }

    private fun persist(context: Context, language: String) {
        val preferences: SharedPreferences = context.getSharedPreferences("workix_prefs", Context.MODE_PRIVATE)
        preferences.edit().putString(SELECTED_LANGUAGE, language).apply()
    }

    @TargetApi(Build.VERSION_CODES.N)
    private fun updateResources(context: Context, locale: Locale): Context {
        val configuration: Configuration = context.resources.configuration
        configuration.setLocale(locale)
        configuration.setLayoutDirection(locale)
        return context.createConfigurationContext(configuration)
    }

    @Suppress("DEPRECATION")
    private fun updateResourcesLegacy(context: Context, locale: Locale): Context {
        val resources: Resources = context.resources
        val configuration: Configuration = resources.configuration
        configuration.locale = locale
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            configuration.setLayoutDirection(locale)
        }
        resources.updateConfiguration(configuration, resources.displayMetrics)
        return context
    }
}
