package br.com.codecode.workix.android.ui.analytics

import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.AnalyticsApiService
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.ProfileViewDto
import br.com.codecode.workix.android.network.SocialSellingScoreDto
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para exibição do índice de Social Selling (SSI) e visitantes do perfil.
 */
class ProfileAnalyticsActivity : AppCompatActivity() {

    private var userId: String = "1"
    private lateinit var progressBar: ProgressBar
    private lateinit var contentLayout: LinearLayout
    private lateinit var tvTotalScore: TextView
    private lateinit var tvBrandScore: TextView
    private lateinit var tvPeopleScore: TextView
    private lateinit var tvEngageScore: TextView
    private lateinit var tvRelScore: TextView
    private lateinit var btnRecalculate: Button
    private lateinit var viewersContainer: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        userId = intent.getStringExtra("USER_ID") ?: "1"

        setupViews()
        loadData()
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

        val headerText = TextView(this).apply {
            text = "Social Selling Index & Analytics"
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(headerText)

        progressBar = ProgressBar(this)
        contentLayout.addView(progressBar)

        val ssiCard = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 16, 16, 16)
            setBackgroundColor(0xFF0284C7.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 16)
            }
        }

        val ssiCardTitle = TextView(this).apply {
            text = "Seu Score SSI Atual"
            textSize = 14f
            setTextColor(0xFFE0F2FE.toInt())
        }
        ssiCard.addView(ssiCardTitle)

        tvTotalScore = TextView(this).apply {
            text = "0 / 100"
            textSize = 32f
            setTextColor(0xFFFFFFFF.toInt())
            setPadding(0, 4, 0, 12)
        }
        ssiCard.addView(tvTotalScore)

        tvBrandScore = TextView(this).apply { setTextColor(0xFFFFFFFF.toInt()); textSize = 13f }
        tvPeopleScore = TextView(this).apply { setTextColor(0xFFFFFFFF.toInt()); textSize = 13f }
        tvEngageScore = TextView(this).apply { setTextColor(0xFFFFFFFF.toInt()); textSize = 13f }
        tvRelScore = TextView(this).apply { setTextColor(0xFFFFFFFF.toInt()); textSize = 13f }

        ssiCard.addView(tvBrandScore)
        ssiCard.addView(tvPeopleScore)
        ssiCard.addView(tvEngageScore)
        ssiCard.addView(tvRelScore)

        contentLayout.addView(ssiCard)

        btnRecalculate = Button(this).apply {
            text = "Recalcular SSI"
            setOnClickListener { recalculate() }
        }
        contentLayout.addView(btnRecalculate)

        val viewersHeader = TextView(this).apply {
            text = "Quem Visualizou Seu Perfil"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 24, 0, 8)
        }
        contentLayout.addView(viewersHeader)

        viewersContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(viewersContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun loadData() {
        progressBar.visibility = ProgressBar.VISIBLE

        lifecycleScope.launch {
            val ssiRes = AnalyticsApiService.getMySocialSellingIndex(userId)
            val viewersRes = AnalyticsApiService.getWhoViewedMyProfile(userId)

            progressBar.visibility = ProgressBar.GONE

            if (ssiRes is NetworkResult.Success) {
                renderSSI(ssiRes.data)
            }

            if (viewersRes is NetworkResult.Success) {
                renderViewers(viewersRes.data)
            }
        }
    }

    private fun renderSSI(ssi: SocialSellingScoreDto) {
        tvTotalScore.text = "${ssi.score} / 100"
        tvBrandScore.text = "• Marca Profissional: ${ssi.postsScore} / 25"
        tvPeopleScore.text = "• Localizar Pessoas: ${ssi.networkScore} / 25"
        tvEngageScore.text = "• Engajamento: ${ssi.engagementScore} / 25"
        tvRelScore.text = "• Relacionamentos: ${ssi.relationshipsScore} / 25"
    }

    private fun renderViewers(viewers: List<ProfileViewDto>) {
        viewersContainer.removeAllViews()
        if (viewers.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "Nenhuma visita recente registrada."
                textSize = 13f
                setTextColor(0xFF64748B.toInt())
            }
            viewersContainer.addView(emptyTv)
            return
        }

        for (v in viewers) {
            val vBox = LinearLayout(this).apply {
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
                text = "Profissional #${v.viewerId} visualizou seu perfil"
                textSize = 13f
                setTextColor(0xFF0F172A.toInt())
            }
            vBox.addView(titleTv)
            viewersContainer.addView(vBox)
        }
    }

    private fun recalculate() {
        btnRecalculate.isEnabled = false
        btnRecalculate.text = "Recalculando..."

        lifecycleScope.launch {
            when (val res = AnalyticsApiService.recalculateSSI(userId)) {
                is NetworkResult.Success -> {
                    renderSSI(res.data)
                    Toast.makeText(this@ProfileAnalyticsActivity, "SSI recalculado com sucesso!", Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@ProfileAnalyticsActivity, res.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
            btnRecalculate.isEnabled = true
            btnRecalculate.text = "Recalcular SSI"
        }
    }
}
