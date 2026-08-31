package br.com.codecode.workix.android.ui.premium

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
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.PremiumApiService
import br.com.codecode.workix.android.network.SubscriptionPlanDto
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para visualização de planos e contratação de assinatura Workix Premium.
 */
class PremiumPlansActivity : AppCompatActivity() {

    private lateinit var progressBar: ProgressBar
    private lateinit var contentLayout: LinearLayout
    private lateinit var activeSubContainer: LinearLayout
    private lateinit var plansContainer: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
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

        val titleTv = TextView(this).apply {
            text = "★ Workix Premium"
            textSize = 22f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 4)
        }
        val subTitleTv = TextView(this).apply {
            text = "Desbloqueie mensagens InMail, quem viu seu perfil e impulsione sua carreira."
            textSize = 13f
            setTextColor(0xFF64748B.toInt())
            setPadding(0, 0, 0, 16)
        }

        contentLayout.addView(titleTv)
        contentLayout.addView(subTitleTv)

        activeSubContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(14, 14, 14, 14)
            setBackgroundColor(0xFFF0FDF4.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 16)
            }
        }
        contentLayout.addView(activeSubContainer)

        progressBar = ProgressBar(this)
        contentLayout.addView(progressBar)

        plansContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(plansContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun loadData() {
        progressBar.visibility = ProgressBar.VISIBLE

        lifecycleScope.launch {
            val subRes = PremiumApiService.getMySubscription("1")
            val plansRes = PremiumApiService.getSubscriptionPlans()

            progressBar.visibility = ProgressBar.GONE

            if (subRes is NetworkResult.Success) {
                val sub = subRes.data
                activeSubContainer.removeAllViews()
                val statusTv = TextView(this@PremiumPlansActivity).apply {
                    text = "✓ Assinatura Ativa: ${sub.status}"
                    textSize = 14f
                    setTextColor(0xFF16A34A.toInt())
                }
                val inmailTv = TextView(this@PremiumPlansActivity).apply {
                    text = "Créditos InMail Restantes: ${sub.inmailCreditsRemaining ?: 0}"
                    textSize = 12f
                    setTextColor(0xFF334155.toInt())
                }
                activeSubContainer.addView(statusTv)
                activeSubContainer.addView(inmailTv)
            }

            if (plansRes is NetworkResult.Success) {
                renderPlans(plansRes.data)
            }
        }
    }

    private fun renderPlans(plans: List<SubscriptionPlanDto>) {
        plansContainer.removeAllViews()

        for (plan in plans) {
            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(16, 16, 16, 16)
                setBackgroundColor(0xFFF8FAFC.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 14)
                }
            }

            val nameTv = TextView(this).apply {
                text = plan.name
                textSize = 16f
                setTextColor(0xFF0F172A.toInt())
            }

            val priceTv = TextView(this).apply {
                text = if (plan.price == 0.0) "Gratuito" else "R$ ${String.format("%.2f", plan.price)} / mês"
                textSize = 18f
                setTextColor(0xFF0284C7.toInt())
                setPadding(0, 4, 0, 8)
            }

            val inmailTv = TextView(this).apply {
                text = "• ${plan.inmailCreditsPerMonth ?: 0} InMails por mês inclusos\n• Quem viu seu perfil desbloqueado\n• Selo Dourado de destaque"
                textSize = 12f
                setTextColor(0xFF475569.toInt())
                setPadding(0, 0, 0, 12)
            }

            val btnSubscribe = Button(this).apply {
                text = if (plan.price == 0.0) "Plano Básico" else "Assinar ${plan.name}"
                isEnabled = plan.price > 0.0
                setOnClickListener {
                    subscribe(plan)
                }
            }

            card.addView(nameTv)
            card.addView(priceTv)
            card.addView(inmailTv)
            card.addView(btnSubscribe)
            plansContainer.addView(card)
        }
    }

    private fun subscribe(plan: SubscriptionPlanDto) {
        lifecycleScope.launch {
            progressBar.visibility = ProgressBar.VISIBLE
            when (val res = PremiumApiService.subscribeToPlan("1", plan.id)) {
                is NetworkResult.Success -> {
                    progressBar.visibility = ProgressBar.GONE
                    Toast.makeText(this@PremiumPlansActivity, "Plano ${plan.name} ativado com sucesso!", Toast.LENGTH_LONG).show()
                    loadData()
                }
                is NetworkResult.Error -> {
                    progressBar.visibility = ProgressBar.GONE
                    Toast.makeText(this@PremiumPlansActivity, res.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}
