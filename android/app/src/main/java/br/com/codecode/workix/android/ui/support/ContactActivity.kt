package br.com.codecode.workix.android.ui.support

import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.SupportApiService
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para envio de mensagem de contato, suporte e ouvidoria.
 */
class ContactActivity : AppCompatActivity() {

    private lateinit var etName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etSubject: EditText
    private lateinit var etMessage: EditText
    private lateinit var btnSubmit: Button
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupViews()
    }

    private fun setupViews() {
        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val scrollView = ScrollView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }

        val contentLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        val titleTv = TextView(this).apply {
            text = "Fale Conosco"
            textSize = 22f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 4)
        }
        val subTitleTv = TextView(this).apply {
            text = "Envie suas dúvidas, sugestões ou solicitações de suporte diretamente à equipe Workix."
            textSize = 13f
            setTextColor(0xFF64748B.toInt())
            setPadding(0, 0, 0, 20)
        }

        contentLayout.addView(titleTv)
        contentLayout.addView(subTitleTv)

        etName = EditText(this).apply {
            hint = "Seu Nome Completo"
            setPadding(14, 14, 14, 14)
            setBackgroundColor(0xFFF8FAFC.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 0, 0, 12) }
        }

        etEmail = EditText(this).apply {
            hint = "Seu E-mail"
            setPadding(14, 14, 14, 14)
            setBackgroundColor(0xFFF8FAFC.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 0, 0, 12) }
        }

        etSubject = EditText(this).apply {
            hint = "Assunto da Mensagem"
            setPadding(14, 14, 14, 14)
            setBackgroundColor(0xFFF8FAFC.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 0, 0, 12) }
        }

        etMessage = EditText(this).apply {
            hint = "Mensagem detalhada..."
            minLines = 4
            setPadding(14, 14, 14, 14)
            setBackgroundColor(0xFFF8FAFC.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 0, 0, 16) }
        }

        btnSubmit = Button(this).apply {
            text = "Enviar Mensagem"
            setOnClickListener { submitForm() }
        }

        progressBar = ProgressBar(this).apply {
            visibility = ProgressBar.GONE
        }

        contentLayout.addView(etName)
        contentLayout.addView(etEmail)
        contentLayout.addView(etSubject)
        contentLayout.addView(etMessage)
        contentLayout.addView(btnSubmit)
        contentLayout.addView(progressBar)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun submitForm() {
        val name = etName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val subject = etSubject.text.toString().trim()
        val message = etMessage.text.toString().trim()

        if (name.isEmpty() || email.isEmpty() || subject.isEmpty() || message.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos.", Toast.LENGTH_SHORT).show()
            return
        }

        progressBar.visibility = ProgressBar.VISIBLE
        btnSubmit.isEnabled = false

        lifecycleScope.launch {
            when (val res = SupportApiService.createForm(name, email, subject, message)) {
                is NetworkResult.Success -> {
                    progressBar.visibility = ProgressBar.GONE
                    btnSubmit.isEnabled = true
                    Toast.makeText(this@ContactActivity, "Mensagem enviada com sucesso!", Toast.LENGTH_LONG).show()
                    finish()
                }
                is NetworkResult.Error -> {
                    progressBar.visibility = ProgressBar.GONE
                    btnSubmit.isEnabled = true
                    Toast.makeText(this@ContactActivity, res.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}
