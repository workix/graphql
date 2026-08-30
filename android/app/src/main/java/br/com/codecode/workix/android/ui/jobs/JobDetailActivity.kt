package br.com.codecode.workix.android.ui.jobs

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.ApiClient
import br.com.codecode.workix.android.network.JobSubscriptionRequest
import br.com.codecode.workix.android.network.JobsApiService
import kotlinx.coroutines.launch

/**
 * Activity nativa para detalhamento da vaga e candidatura (subscribe).
 */
class JobDetailActivity : AppCompatActivity() {

    private val jobsService = ApiClient.createService(JobsApiService::class.java)
    private var jobId: String? = null

    private lateinit var tvTitle: TextView
    private lateinit var tvCompany: TextView
    private lateinit var tvDescription: TextView
    private lateinit var btnSubscribe: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        jobId = intent.getStringExtra(EXTRA_JOB_ID)

        setupViews()
        if (jobId != null) {
            loadJobDetail(jobId!!)
        }
    }

    private fun setupViews() {
        tvTitle = TextView(this).apply { textSize = 22f }
        tvCompany = TextView(this).apply { textSize = 16f }
        tvDescription = TextView(this).apply { textSize = 14f }
        btnSubscribe = Button(this).apply { text = "Candidatar-se à Vaga" }

        btnSubscribe.setOnClickListener {
            if (jobId != null) {
                subscribeToJob(jobId!!)
            }
        }
    }

    private fun loadJobDetail(id: String) {
        lifecycleScope.launch {
            try {
                val response = jobsService.getJobById(id)
                if (response.isSuccessful && response.body() != null) {
                    val job = response.body()!!
                    tvTitle.text = job.title
                    tvCompany.text = job.company_name ?: "Empresa confidencial"
                    tvDescription.text = job.description ?: "Sem descrição informada."
                }
            } catch (e: Exception) {
                Toast.makeText(this@JobDetailActivity, "Erro ao carregar vaga: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun subscribeToJob(id: String) {
        lifecycleScope.launch {
            try {
                val response = jobsService.subscribeJob(JobSubscriptionRequest(job_id = id))
                if (response.isSuccessful) {
                    Toast.makeText(this@JobDetailActivity, "Candidatura enviada com sucesso!", Toast.LENGTH_LONG).show()
                    btnSubscribe.isEnabled = false
                    btnSubscribe.text = "Candidatura Enviada"
                } else {
                    Toast.makeText(this@JobDetailActivity, "Erro ao se candidatar (${response.code()})", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@JobDetailActivity, "Falha de conexão: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    companion object {
        const val EXTRA_JOB_ID = "extra_job_id"
    }
}
