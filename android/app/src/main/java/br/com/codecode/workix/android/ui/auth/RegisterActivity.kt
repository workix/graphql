package br.com.codecode.workix.android.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.ui.main.MainActivity
import br.com.codecode.workix.android.viewmodel.AuthViewModel

/**
 * Activity nativa de Cadastro em Kotlin (Candidato vs Empresa).
 */
class RegisterActivity : AppCompatActivity() {

    private lateinit var authViewModel: AuthViewModel
    private lateinit var etName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var rgRole: RadioGroup
    private lateinit var rbCandidate: RadioButton
    private lateinit var rbCompany: RadioButton
    private lateinit var btnRegister: Button
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        authViewModel = ViewModelProvider(this)[AuthViewModel::class.java]

        setupViews()
        observeViewModel()
    }

    private fun setupViews() {
        etName = EditText(this).apply { hint = "Nome completo" }
        etEmail = EditText(this).apply { hint = "E-mail" }
        etPassword = EditText(this).apply { hint = "Senha" }
        
        rgRole = RadioGroup(this)
        rbCandidate = RadioButton(this).apply { text = "Candidato"; isChecked = true }
        rbCompany = RadioButton(this).apply { text = "Empresa" }
        rgRole.addView(rbCandidate)
        rgRole.addView(rbCompany)

        btnRegister = Button(this).apply { text = "Cadastrar" }
        progressBar = ProgressBar(this)

        btnRegister.setOnClickListener {
            val name = etName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            val role = if (rbCompany.isChecked) "COMPANY" else "CANDIDATE"

            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos obrigatórios", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            authViewModel.register(email, password, name, role)
        }
    }

    private fun observeViewModel() {
        authViewModel.registerState.observe(this) { result ->
            when (result) {
                is NetworkResult.Loading -> {
                    progressBar.visibility = View.VISIBLE
                    btnRegister.isEnabled = false
                }
                is NetworkResult.Success -> {
                    progressBar.visibility = View.GONE
                    btnRegister.isEnabled = true
                    Toast.makeText(this, "Conta criada com sucesso!", Toast.LENGTH_SHORT).show()
                    navigateToMain()
                }
                is NetworkResult.Error -> {
                    progressBar.visibility = View.GONE
                    btnRegister.isEnabled = true
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
