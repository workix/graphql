package br.com.codecode.workix.android.ui.jobs

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.ApiClient
import br.com.codecode.workix.android.network.CreateJobRequest
import br.com.codecode.workix.android.network.JobsApiService
import kotlinx.coroutines.launch

/**
 * Activity nativa para publicação de novas vagas por empresas.
 */
class PostJobActivity : AppCompatActivity() {

    private val jobsService = ApiClient.createService(JobsApiService::class.java)

    private lateinit var etTitle: EditText
    private lateinit var etDescription: EditText
    private lateinit var etLocation: EditText
    private lateinit var etContractType: EditText
    private lateinit var etSalary: EditText
    private lateinit var btnSubmit: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupViews()
    }

    private fun setupViews() {
        etTitle = EditText(this).apply { hint = "Título da Vaga" }
        etDescription = EditText(this).apply { hint = "Descrição das Responsabilidades" }
        etLocation = EditText(this).apply { hint = "Localização (Cidade/UF ou Remoto)" }
        etContractType = EditText(this).apply { hint = "Tipo de Contrato (CLT/PJ)" }
        etSalary = EditText(this).apply { hint = "Faixa Salarial (Opcional)" }
        btnSubmit = Button(this).apply { text = "Publicar Vaga" }

        btnSubmit.setOnClickListener {
            val title = etTitle.text.toString().trim()
            val description = etDescription.text.toString().trim()

            if (title.isEmpty() || description.isEmpty()) {
                Toast.makeText(this, "Título e descrição são obrigatórios", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            postJob(
                title = title,
                description = description,
                location = etLocation.text.toString().trim(),
                contractType = etContractType.text.toString().trim(),
                salary = etSalary.text.toString().trim()
            )
        }
    }

    private fun postJob(title: String, description: String, location: String, contractType: String, salary: String) {
        lifecycleScope.launch {
            try {
                val request = CreateJobRequest(
                    title = title,
                    description = description,
                    location = location.ifEmpty { null },
                    contract_type = contractType.ifEmpty { null },
                    salary = salary.ifEmpty { null }
                )
                val response = jobsService.createJob(request)
                if (response.isSuccessful) {
                    Toast.makeText(this@PostJobActivity, "Vaga publicada com sucesso!", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@PostJobActivity, "Erro ao publicar vaga (${response.code()})", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@PostJobActivity, "Falha na publicação: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
