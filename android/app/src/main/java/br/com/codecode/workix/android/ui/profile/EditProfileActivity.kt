package br.com.codecode.workix.android.ui.profile

import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.ProfilesApiService
import br.com.codecode.workix.android.network.UserProfileDto
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para edição de perfil profissional e selo Open To Work.
 */
class EditProfileActivity : AppCompatActivity() {

    private var userId: String = "1"
    private lateinit var etHeadline: EditText
    private lateinit var etAbout: EditText
    private lateinit var etLocation: EditText
    private lateinit var etIndustry: EditText
    private lateinit var cbOpenToWork: CheckBox
    private lateinit var btnSave: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        userId = intent.getStringExtra("USER_ID") ?: "1"

        setupViews()
        loadCurrentProfile()
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

        val formLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        val headerText = TextView(this).apply {
            text = "Editar Perfil"
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 16)
        }
        formLayout.addView(headerText)

        val lblHeadline = TextView(this).apply { text = "Título / Headline *" }
        etHeadline = EditText(this).apply { hint = "Ex: Engenheiro de Software Senior" }
        formLayout.addView(lblHeadline)
        formLayout.addView(etHeadline)

        val lblIndustry = TextView(this).apply { text = "Setor / Indústria" }
        etIndustry = EditText(this).apply { hint = "Ex: Tecnologia da Informação" }
        formLayout.addView(lblIndustry)
        formLayout.addView(etIndustry)

        val lblLocation = TextView(this).apply { text = "Localização" }
        etLocation = EditText(this).apply { hint = "Ex: São Paulo, Brasil" }
        formLayout.addView(lblLocation)
        formLayout.addView(etLocation)

        val lblAbout = TextView(this).apply { text = "Sobre (Resumo Profissional)" }
        etAbout = EditText(this).apply {
            hint = "Descreva sua experiência..."
            minLines = 4
        }
        formLayout.addView(lblAbout)
        formLayout.addView(etAbout)

        cbOpenToWork = CheckBox(this).apply {
            text = "Ativar selo #OpenToWork (Disponível para vagas)"
            setPadding(0, 10, 0, 16)
        }
        formLayout.addView(cbOpenToWork)

        btnSave = Button(this).apply {
            text = "Salvar Alterações"
            setOnClickListener { saveProfile() }
        }
        formLayout.addView(btnSave)

        scrollView.addView(formLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun loadCurrentProfile() {
        lifecycleScope.launch {
            when (val res = ProfilesApiService.getProfile(userId)) {
                is NetworkResult.Success -> {
                    val p = res.data
                    etHeadline.setText(p.headline ?: "")
                    etAbout.setText(p.about ?: "")
                    etLocation.setText(p.location ?: "")
                    etIndustry.setText(p.industry ?: "")
                    cbOpenToWork.isChecked = p.openToWork == true
                }
                else -> {}
            }
        }
    }

    private fun saveProfile() {
        val headline = etHeadline.text.toString().trim()
        val about = etAbout.text.toString().trim()
        val location = etLocation.text.toString().trim()
        val industry = etIndustry.text.toString().trim()
        val openToWork = cbOpenToWork.isChecked

        if (headline.isEmpty()) {
            Toast.makeText(this, "Por favor, preencha o título profissional", Toast.LENGTH_SHORT).show()
            return
        }

        btnSave.isEnabled = false
        btnSave.text = "Salvando..."

        lifecycleScope.launch {
            val result = ProfilesApiService.updateProfile(
                userId = userId,
                headline = headline,
                about = about,
                location = location,
                industry = industry,
                openToWork = openToWork
            )

            btnSave.isEnabled = true
            btnSave.text = "Salvar Alterações"

            when (result) {
                is NetworkResult.Success -> {
                    Toast.makeText(this@EditProfileActivity, "Perfil atualizado com sucesso!", Toast.LENGTH_SHORT).show()
                    finish()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@EditProfileActivity, result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}
