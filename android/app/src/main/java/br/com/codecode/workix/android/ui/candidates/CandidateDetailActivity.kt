package br.com.codecode.workix.android.ui.candidates

import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.ApiClient
import br.com.codecode.workix.android.network.ResumesApiService
import kotlinx.coroutines.launch

/**
 * Activity nativa para exibição do currículo e perfil do candidato.
 */
class CandidateDetailActivity : AppCompatActivity() {

    private val resumesService = ApiClient.createService(ResumesApiService::class.java)
    private var resumeId: String? = null

    private lateinit var tvCandidateName: TextView
    private lateinit var tvTitle: TextView
    private lateinit var tvSummary: TextView
    private lateinit var tvSkills: TextView
    private lateinit var tvExperience: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        resumeId = intent.getStringExtra(EXTRA_RESUME_ID)

        setupViews()
        if (resumeId != null) {
            loadResumeDetail(resumeId!!)
        }
    }

    private fun setupViews() {
        tvCandidateName = TextView(this).apply { textSize = 22f }
        tvTitle = TextView(this).apply { textSize = 18f }
        tvSummary = TextView(this).apply { textSize = 14f }
        tvSkills = TextView(this).apply { textSize = 14f }
        tvExperience = TextView(this).apply { textSize = 14f }
    }

    private fun loadResumeDetail(id: String) {
        lifecycleScope.launch {
            try {
                val response = resumesService.getResumeById(id)
                if (response.isSuccessful && response.body() != null) {
                    val resume = response.body()!!
                    tvCandidateName.text = resume.candidate_name ?: "Candidato"
                    tvTitle.text = resume.title ?: "Sem título"
                    tvSummary.text = resume.summary ?: "Sem resumo informado."
                    tvSkills.text = "Habilidades: ${resume.skills ?: "N/A"}"
                    tvExperience.text = "Experiência: ${resume.experience ?: "N/A"}"
                }
            } catch (e: Exception) {
                Toast.makeText(this@CandidateDetailActivity, "Erro ao carregar perfil: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    companion object {
        const val EXTRA_RESUME_ID = "extra_resume_id"
    }
}
