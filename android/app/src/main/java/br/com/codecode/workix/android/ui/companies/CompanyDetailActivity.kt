package br.com.codecode.workix.android.ui.companies

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

/**
 * Activity nativa para perfil institucional da empresa.
 */
class CompanyDetailActivity : AppCompatActivity() {

    private var companyId: String? = null
    private lateinit var tvName: TextView
    private lateinit var tvWebsite: TextView
    private lateinit var tvDescription: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        companyId = intent.getStringExtra(EXTRA_COMPANY_ID)

        setupViews()
        loadCompanyDetail()
    }

    private fun setupViews() {
        tvName = TextView(this).apply { text = "Empresa Parceira"; textSize = 22f }
        tvWebsite = TextView(this).apply { text = "https://empresa.com.br"; textSize = 16f }
        tvDescription = TextView(this).apply { text = "Empresa inovadora no setor buscando novos talentos."; textSize = 14f }
    }

    private fun loadCompanyDetail() {
        // Carrega detalhes da empresa se necessário
    }

    companion object {
        const val EXTRA_COMPANY_ID = "extra_company_id"
    }
}
