package br.com.codecode.workix.android.ui.network

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import br.com.codecode.workix.android.network.ConnectionDto
import br.com.codecode.workix.android.network.ConnectionRequestDto
import br.com.codecode.workix.android.network.ConnectionsApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Fragmento nativo Android para visualização de conexões ativas e gestão de convites.
 */
class ConnectionsFragment : Fragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var invitationsContainer: LinearLayout
    private lateinit var rvConnections: RecyclerView
    private val connectionsList = mutableListOf<ConnectionDto>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val rootLayout = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 16, 16, 16)
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val headerText = TextView(requireContext()).apply {
            text = "Minha Rede & Conexões"
            textSize = 22f
            setPadding(0, 0, 0, 16)
        }
        rootLayout.addView(headerText)

        progressBar = ProgressBar(requireContext()).apply {
            visibility = View.VISIBLE
        }
        rootLayout.addView(progressBar)

        val scroll = ScrollView(requireContext()).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }

        val scrollContent = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
        }

        val invTitle = TextView(requireContext()).apply {
            text = "Convites Pendentes:"
            textSize = 16f
            setPadding(0, 8, 0, 8)
        }
        scrollContent.addView(invTitle)

        invitationsContainer = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
        }
        scrollContent.addView(invitationsContainer)

        val connTitle = TextView(requireContext()).apply {
            text = "Suas Conexões:"
            textSize = 16f
            setPadding(0, 16, 0, 8)
        }
        scrollContent.addView(connTitle)

        rvConnections = RecyclerView(requireContext()).apply {
            layoutManager = LinearLayoutManager(requireContext())
        }
        scrollContent.addView(rvConnections)

        scroll.addView(scrollContent)
        rootLayout.addView(scroll)

        loadNetworkData()

        return rootLayout
    }

    private fun loadNetworkData() {
        progressBar.visibility = View.VISIBLE

        viewLifecycleOwner.lifecycleScope.launch {
            // Carrega convites pendentes
            when (val reqResult = ConnectionsApiService.getPendingRequests()) {
                is NetworkResult.Success -> {
                    renderInvitations(reqResult.data)
                }
                else -> {}
            }

            // Carrega conexões ativas
            when (val connResult = ConnectionsApiService.getMyConnections()) {
                is NetworkResult.Success -> {
                    progressBar.visibility = View.GONE
                    connectionsList.clear()
                    connectionsList.addAll(connResult.data)
                    rvConnections.adapter = ConnectionItemAdapter(connectionsList)
                }
                is NetworkResult.Error -> {
                    progressBar.visibility = View.GONE
                    Toast.makeText(requireContext(), connResult.message, Toast.LENGTH_SHORT).show()
                }
                else -> {
                    progressBar.visibility = View.GONE
                }
            }
        }
    }

    private fun renderInvitations(requests: List<ConnectionRequestDto>) {
        invitationsContainer.removeAllViews()

        if (requests.isEmpty()) {
            val emptyTv = TextView(requireContext()).apply {
                text = "Nenhum convite pendente."
                setPadding(0, 4, 0, 8)
            }
            invitationsContainer.addView(emptyTv)
            return
        }

        for (req in requests) {
            val itemLayout = LinearLayout(requireContext()).apply {
                orientation = LinearLayout.HORIZONTAL
                setPadding(12, 12, 12, 12)
                setBackgroundColor(0xFFF1F5F9.toInt())
            }

            val infoTv = TextView(requireContext()).apply {
                text = "Profissional #${req.requesterId} quer se conectar"
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }
            itemLayout.addView(infoTv)

            val btnAccept = Button(requireContext()).apply {
                text = "Aceitar"
                setOnClickListener {
                    acceptInvite(req.id)
                }
            }
            itemLayout.addView(btnAccept)

            val btnReject = Button(requireContext()).apply {
                text = "Recusar"
                setOnClickListener {
                    rejectInvite(req.id)
                }
            }
            itemLayout.addView(btnReject)

            invitationsContainer.addView(itemLayout)
        }
    }

    private fun acceptInvite(requestId: String) {
        viewLifecycleOwner.lifecycleScope.launch {
            when (val result = ConnectionsApiService.acceptConnectionRequest(requestId, "1")) {
                is NetworkResult.Success -> {
                    Toast.makeText(requireContext(), "Conexão aceita!", Toast.LENGTH_SHORT).show()
                    loadNetworkData()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(requireContext(), result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }

    private fun rejectInvite(requestId: String) {
        viewLifecycleOwner.lifecycleScope.launch {
            when (val result = ConnectionsApiService.rejectConnectionRequest(requestId, "1")) {
                is NetworkResult.Success -> {
                    Toast.makeText(requireContext(), "Convite recusado.", Toast.LENGTH_SHORT).show()
                    loadNetworkData()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(requireContext(), result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}

class ConnectionItemAdapter(
    private val connections: List<ConnectionDto>
) : RecyclerView.Adapter<ConnectionItemAdapter.ViewHolder>() {

    class ViewHolder(val view: LinearLayout) : RecyclerView.ViewHolder(view) {
        val titleView: TextView = view.getChildAt(0) as TextView
        val subtitleView: TextView = view.getChildAt(1) as TextView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val layout = LinearLayout(parent.context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 12, 16, 12)
            layoutParams = RecyclerView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        }
        val tv1 = TextView(parent.context).apply {
            textSize = 15f
            setTextColor(0xFF0F172A.toInt())
        }
        val tv2 = TextView(parent.context).apply {
            textSize = 12f
            setTextColor(0xFF64748B.toInt())
        }
        layout.addView(tv1)
        layout.addView(tv2)
        return ViewHolder(layout)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val conn = connections[position]
        holder.titleView.text = "Profissional #${if (conn.userId1 == "1") conn.userId2 else conn.userId1}"
        holder.subtitleView.text = "Conectado via Workix • 1º grau"
    }

    override fun getItemCount(): Int = connections.size
}
