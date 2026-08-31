package br.com.codecode.workix.android.ui.groups

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.GroupDto
import br.com.codecode.workix.android.network.GroupsApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Fragment nativo Android para listagem de comunidades e navegação para grupos.
 */
class GroupsFragment : Fragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var groupsContainer: LinearLayout

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
            text = "Grupos e Comunidades"
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(headerText)

        progressBar = ProgressBar(context)
        contentLayout.addView(progressBar)

        groupsContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(groupsContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)

        loadGroups()

        return rootLayout
    }

    private fun loadGroups() {
        progressBar.visibility = View.VISIBLE

        viewLifecycleOwner.lifecycleScope.launch {
            val list = mutableListOf<GroupDto>()
            for (id in 1..3) {
                val res = GroupsApiService.getGroup(id.toString())
                if (res is NetworkResult.Success) {
                    list.add(res.data)
                }
            }

            progressBar.visibility = View.GONE
            renderGroups(list)
        }
    }

    private fun renderGroups(groups: List<GroupDto>) {
        groupsContainer.removeAllViews()
        val context = requireContext()

        for (group in groups) {
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

            val titleTv = TextView(context).apply {
                text = group.name
                textSize = 15f
                setTextColor(0xFF0F172A.toInt())
            }
            val descTv = TextView(context).apply {
                text = group.description ?: "Comunidade profissional."
                textSize = 13f
                setTextColor(0xFF64748B.toInt())
                setPadding(0, 4, 0, 12)
            }
            val btnView = Button(context).apply {
                text = "Acessar Comunidade"
                setOnClickListener {
                    val intent = Intent(context, GroupDetailActivity::class.java).apply {
                        putExtra("GROUP_ID", group.id)
                    }
                    startActivity(intent)
                }
            }

            card.addView(titleTv)
            card.addView(descTv)
            card.addView(btnView)
            groupsContainer.addView(card)
        }
    }
}
