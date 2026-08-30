package br.com.codecode.workix.android.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.ui.main.MainActivity
import br.com.codecode.workix.android.viewmodel.AuthViewModel

/**
 * Activity nativa de Login em Kotlin.
 */
class LoginActivity : AppCompatActivity() {

    private lateinit var authViewModel: AuthViewModel
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var btnRegister: Button
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        authViewModel = ViewModelProvider(this)[AuthViewModel::class.java]

        if (authViewModel.isLoggedIn()) {
            navigateToMain()
            return
        }

        setupViews()
        observeViewModel()
    }

    private fun setupViews() {
        // Exemplo básico de inicialização UI programática ou via layouts
        etEmail = EditText(this).apply { hint = "E-mail" }
        etPassword = EditText(this).apply { hint = "Senha" }
        btnLogin = Button(this).apply { text = "Entrar" }
        btnRegister = Button(this).apply { text = "Criar Conta" }
        progressBar = ProgressBar(this)

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            authViewModel.login(email, password)
        }

        btnRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun observeViewModel() {
        authViewModel.loginState.observe(this) { result ->
            when (result) {
                is NetworkResult.Loading -> {
                    progressBar.visibility = View.VISIBLE
                    btnLogin.isEnabled = false
                }
                is NetworkResult.Success -> {
                    progressBar.visibility = View.GONE
                    btnLogin.isEnabled = true
                    Toast.makeText(this, "Login realizado com sucesso!", Toast.LENGTH_SHORT).show()
                    navigateToMain()
                }
                is NetworkResult.Error -> {
                    progressBar.visibility = View.GONE
                    btnLogin.isEnabled = true
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}
