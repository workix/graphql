package br.com.codecode.workix.android.ui.profile

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.EndorsementsApiService
import br.com.codecode.workix.android.network.FeaturedItemDto
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.ProfilesApiService
import br.com.codecode.workix.android.network.RecommendationDto
import br.com.codecode.workix.android.network.UserProfileDto
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para visualização de perfil profissional, destaques, competências e recomendações.
 */
class ProfileActivity : AppCompatActivity() {

    private var targetUserId: String = "1"
    private lateinit var progressBar: ProgressBar
    private lateinit var contentLayout: LinearLayout
    private lateinit var tvName: TextView
    private lateinit var tvHeadline: TextView
    private lateinit var tvLocation: TextView
    private lateinit var tvOpenToWork: TextView
    private lateinit var tvAbout: TextView
    private lateinit var featuredContainer: LinearLayout
    private lateinit var skillsContainer: LinearLayout
    private lateinit var recommendationsContainer: LinearLayout
    private lateinit var btnEdit: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        targetUserId = intent.getStringExtra("USER_ID") ?: "1"

        setupViews()
        loadProfile()
    }

    override fun onResume() {
        super.onResume()
        loadProfile()
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

        contentLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        progressBar = ProgressBar(this)
        contentLayout.addView(progressBar)

        tvName = TextView(this).apply {
            textSize = 22f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 4)
        }
        contentLayout.addView(tvName)

        tvOpenToWork = TextView(this).apply {
            text = "#OpenToWork - Disponível para contratação"
            textSize = 12f
            setTextColor(0xFF15803D.toInt())
            setBackgroundColor(0xFFDCFCE7.toInt())
            setPadding(12, 4, 12, 4)
            visibility = View.GONE
        }
        contentLayout.addView(tvOpenToWork)

        tvHeadline = TextView(this).apply {
            textSize = 15f
            setTextColor(0xFF334155.toInt())
            setPadding(0, 8, 0, 4)
        }
        contentLayout.addView(tvHeadline)

        tvLocation = TextView(this).apply {
            textSize = 13f
            setTextColor(0xFF64748B.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(tvLocation)

        btnEdit = Button(this).apply {
            text = "Editar Perfil"
            setOnClickListener {
                val intent = Intent(this@ProfileActivity, EditProfileActivity::class.java).apply {
                    putExtra("USER_ID", targetUserId)
                }
                startActivity(intent)
            }
        }
        contentLayout.addView(btnEdit)

        val aboutHeader = TextView(this).apply {
            text = "Sobre"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 20, 0, 4)
        }
        contentLayout.addView(aboutHeader)

        tvAbout = TextView(this).apply {
            textSize = 14f
            setTextColor(0xFF334155.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(tvAbout)

        val featuredHeader = TextView(this).apply {
            text = "Destaques e Portfólio"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 8, 0, 8)
        }
        contentLayout.addView(featuredHeader)

        featuredContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(featuredContainer)

        val skillsHeader = TextView(this).apply {
            text = "Competências e Endossos"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 16, 0, 8)
        }
        contentLayout.addView(skillsHeader)

        skillsContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(skillsContainer)

        val recsHeader = TextView(this).apply {
            text = "Recomendações"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 16, 0, 8)
        }
        contentLayout.addView(recsHeader)

        recommendationsContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(recommendationsContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun loadProfile() {
        progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            val profileRes = ProfilesApiService.getProfile(targetUserId)
            val featuredRes = ProfilesApiService.getFeaturedItems(targetUserId)
            val recsRes = EndorsementsApiService.getUserRecommendations(targetUserId)

            progressBar.visibility = View.GONE

            if (profileRes is NetworkResult.Success) {
                renderProfile(profileRes.data)
            } else if (profileRes is NetworkResult.Error) {
                Toast.makeText(this@ProfileActivity, profileRes.message, Toast.LENGTH_SHORT).show()
            }

            if (featuredRes is NetworkResult.Success) {
                renderFeatured(featuredRes.data)
            }

            renderSkills()

            if (recsRes is NetworkResult.Success) {
                renderRecommendations(recsRes.data)
            }
        }
    }

    private fun renderProfile(profile: UserProfileDto) {
        tvName.text = "Profissional #$targetUserId"
        tvHeadline.text = profile.headline ?: "Nenhum cargo informado"
        tvLocation.text = "${profile.location ?: "Brasil"} • ${profile.industry ?: "Geral"}"
        tvAbout.text = profile.about ?: "Nenhum resumo profissional adicionado."

        if (profile.openToWork == true) {
            tvOpenToWork.visibility = View.VISIBLE
        } else {
            tvOpenToWork.visibility = View.GONE
        }
    }

    private fun renderFeatured(items: List<FeaturedItemDto>) {
        featuredContainer.removeAllViews()
        if (items.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "Nenhum destaque adicionado."
                textSize = 13f
                setTextColor(0xFF64748B.toInt())
            }
            featuredContainer.addView(emptyTv)
            return
        }

        for (item in items) {
            val itemBox = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(12, 10, 12, 10)
                setBackgroundColor(0xFFF1F5F9.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 8)
                }
            }

            val titleTv = TextView(this).apply {
                text = "${item.type}: ${item.title}"
                textSize = 14f
                setTextColor(0xFF0F172A.toInt())
            }
            itemBox.addView(titleTv)

            if (!item.url.isNullOrEmpty()) {
                val urlTv = TextView(this).apply {
                    text = item.url
                    textSize = 12f
                    setTextColor(0xFF0284C7.toInt())
                }
                itemBox.addView(urlTv)
            }

            featuredContainer.addView(itemBox)
        }
    }

    private fun renderSkills() {
        skillsContainer.removeAllViews()
        val skills = listOf("TypeScript / Vue.js", "GraphQL & Apollo", "Android Nativo / Kotlin", "Node.js / Express")

        for ((index, skill) in skills.withIndex()) {
            val skillBox = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                setPadding(12, 10, 12, 10)
                setBackgroundColor(0xFFF8FAFC.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 6)
                }
            }

            val nameTv = TextView(this).apply {
                text = "★ $skill"
                textSize = 14f
                setTextColor(0xFF0F172A.toInt())
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }
            skillBox.addView(nameTv)

            val btnEndorse = Button(this).apply {
                text = "+ Endossar"
                textSize = 11f
                setOnClickListener {
                    lifecycleScope.launch {
                        EndorsementsApiService.endorseSkill((index + 1).toString())
                        text = "✓ Endossado"
                        isEnabled = false
                    }
                }
            }
            skillBox.addView(btnEndorse)

            skillsContainer.addView(skillBox)
        }
    }

    private fun renderRecommendations(recs: List<RecommendationDto>) {
        recommendationsContainer.removeAllViews()
        if (recs.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "Nenhuma recomendação pública."
                textSize = 13f
                setTextColor(0xFF64748B.toInt())
            }
            recommendationsContainer.addView(emptyTv)
            return
        }

        for (rec in recs) {
            val recBox = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(12, 10, 12, 10)
                setBackgroundColor(0xFFF8FAFC.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 8)
                }
            }

            val textTv = TextView(this).apply {
                text = "\"${rec.content}\""
                textSize = 13f
                setTextColor(0xFF334155.toInt())
            }
            val authorTv = TextView(this).apply {
                text = "— Profissional #${rec.recommenderId}"
                textSize = 11f
                setTextColor(0xFF64748B.toInt())
                setPadding(0, 4, 0, 0)
            }

            recBox.addView(textTv)
            recBox.addView(authorTv)

            recommendationsContainer.addView(recBox)
        }
    }
}
