package br.com.codecode.workix.android.ui.candidates

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.ApiClient
import br.com.codecode.workix.android.network.ResumesApiService
import br.com.codecode.workix.android.network.SaveResumeRequest
import kotlinx.coroutines.launch

/**
 * Activity nativa para criação e atualização de currículo do candidato.
 */
class PostResumeActivity : AppCompatActivity() {

    private val resumesService = ApiClient.createService(ResumesApiService::class.java)

    private lateinit var etTitle: EditText
    private lateinit var etSummary: EditText
    private lateinit var etSkills: EditText
    private lateinit var etExperience: EditText
    private lateinit var etEducation: EditText
    private lateinit var btnSave: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupViews()
    }

    private fun setupViews() {
        etTitle = EditText(this).apply { hint = "Título Profissional (ex: Desenvolvedor Mobile)" }
        etSummary = EditText(this).apply { hint = "Resumo do Perfil" }
        etSkills = EditText(this).apply { hint = "Principais Competências e Tecnologias" }
        etExperience = EditText(this).apply { hint = "Histórico de Experiência Profissional" }
        etEducation = EditText(this).apply { hint = "Formação Acadêmica" }
        btnSave = Button(this).apply { text = "Salvar Currículo" }

        btnSave.setOnClickListener {
            val title = etTitle.text.toString().trim()
            if (title.isEmpty()) {
                Toast.makeText(this, "O título do currículo é obrigatório", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            saveResume(
                title = title,
                summary = etSummary.text.toString().trim(),
                skills = etSkills.text.toString().trim(),
                experience = etExperience.text.toString().trim(),
                education = etEducation.text.toString().trim()
            )
        }
    }

    private fun saveResume(title: String, summary: String, skills: String, experience: String, education: String) {
        lifecycleScope.launch {
            try {
                val request = SaveResumeRequest(
                    title = title,
                    summary = summary.ifEmpty { null },
                    skills = skills.ifEmpty { null },
                    experience = experience.ifEmpty { null },
                    education = education.ifEmpty { null }
                )
                val response = resumesService.saveResume(request)
                if (response.isSuccessful) {
                    Toast.makeText(this@PostResumeActivity, "Currículo salvo com sucesso!", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@PostResumeActivity, "Erro ao salvar currículo (${response.code()})", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@PostResumeActivity, "Falha ao salvar: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
