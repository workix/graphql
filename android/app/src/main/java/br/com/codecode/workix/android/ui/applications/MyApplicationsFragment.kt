package br.com.codecode.workix.android.ui.applications

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
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.SelectiveProcessDto
import br.com.codecode.workix.android.network.SelectiveProcessesApiService
import kotlinx.coroutines.launch

/**
 * Fragment nativo Android para acompanhamento de candidaturas e processos seletivos inscritos.
 */
class MyApplicationsFragment : Fragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var listContainer: LinearLayout

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

        val headerTitle = TextView(context).apply {
            text = "Minhas Candidaturas"
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 4)
        }

        val headerSub = TextView(context).apply {
            text = "Acompanhe o status e prazos dos processos seletivos que você está participando."
            textSize = 13f
            setTextColor(0xFF64748B.toInt())
            setPadding(0, 0, 0, 16)
        }

        contentLayout.addView(headerTitle)
        contentLayout.addView(headerSub)

        progressBar = ProgressBar(context)
        contentLayout.addView(progressBar)

        listContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(listContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)

        loadApplications()

        return rootLayout
    }

    private fun loadApplications() {
        progressBar.visibility = View.VISIBLE

        viewLifecycleOwner.lifecycleScope.launch {
            val res = SelectiveProcessesApiService.mySelectiveProcessesSubscribed()
            progressBar.visibility = View.GONE

            if (res is NetworkResult.Success) {
                renderList(res.data)
            }
        }
    }

    private fun renderList(processes: List<SelectiveProcessDto>) {
        listContainer.removeAllViews()
        val context = requireContext()

        if (processes.isEmpty()) {
            val emptyTv = TextView(context).apply {
                text = "Você ainda não se candidatou a nenhum processo seletivo."
                textSize = 14f
                setTextColor(0xFF64748B.toInt())
                setPadding(0, 20, 0, 0)
            }
            listContainer.addView(emptyTv)
            return
        }

        for (sp in processes) {
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

            val jobTitle = TextView(context).apply {
                text = sp.job?.title ?: "Processo Seletivo #${sp.id}"
                textSize = 16f
                setTextColor(0xFF0F172A.toInt())
                setPadding(0, 0, 0, 4)
            }

            val statusTv = TextView(context).apply {
                text = if (sp.activated) "● Em andamento" else "● Encerrado"
                textSize = 12f
                setTextColor(if (sp.activated) 0xFF16A34A.toInt() else 0xFFDC2626.toInt())
                setPadding(0, 0, 0, 6)
            }

            val detailsTv = TextView(context).apply {
                text = "Início: ${sp.startsIn ?: '-'} | Expira: ${sp.expiresIn ?: '-'}"
                textSize = 12f
                setTextColor(0xFF64748B.toInt())
            }

            card.addView(jobTitle)
            card.addView(statusTv)
            card.addView(detailsTv)
            listContainer.addView(card)
        }
    }
}
