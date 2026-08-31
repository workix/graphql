package br.com.codecode.workix.android.ui.support

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.MemberDto
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.SupportApiService
import kotlinx.coroutines.launch

/**
 * Fragment nativo Android para apresentação da equipe institucional e fundadores do Workix.
 */
class TeamFragment : Fragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var teamContainer: LinearLayout

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val context = requireContext()

        val rootLayout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val scrollView = ScrollView(context).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }

        val contentLayout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        val headerText = TextView(context).apply {
            text = "Nossa Equipe & Liderança"
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 4)
        }
        val subText = TextView(context).apply {
            text = "Conheça quem constrói o ecossistema Workix diariamente."
            textSize = 13f
            setTextColor(0xFF64748B.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(headerText)
        contentLayout.addView(subText)

        progressBar = ProgressBar(context)
        contentLayout.addView(progressBar)

        teamContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(teamContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)

        loadTeam()

        return rootLayout
    }

    private fun loadTeam() {
        progressBar.visibility = View.VISIBLE

        viewLifecycleOwner.lifecycleScope.launch {
            val res = SupportApiService.allMembers(0, 20)
            progressBar.visibility = View.GONE

            if (res is NetworkResult.Success) {
                renderTeam(res.data)
            }
        }
    }

    private fun renderTeam(members: List<MemberDto>) {
        teamContainer.removeAllViews()
        val context = requireContext()

        for (member in members) {
            val card = LinearLayout(context).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(16, 16, 16, 16)
                setBackgroundColor(0xFFF8FAFC.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 12)
                }
            }

            val nameTv = TextView(context).apply {
                text = member.name
                textSize = 16f
                setTextColor(0xFF0F172A.toInt())
            }
            val roleTv = TextView(context).apply {
                text = member.occupation
                textSize = 13f
                setTextColor(0xFF0284C7.toInt())
                setPadding(0, 2, 0, 6)
            }
            val bioTv = TextView(context).apply {
                text = member.shortText ?: "Especialista em tecnologia e soluções de alta escala."
                textSize = 12f
                setTextColor(0xFF475569.toInt())
            }

            card.addView(nameTv)
            card.addView(roleTv)
            card.addView(bioTv)
            teamContainer.addView(card)
        }
    }
}
