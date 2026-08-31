package br.com.codecode.workix.android.ui.notifications

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.NotificationDto
import br.com.codecode.workix.android.network.NotificationsApiService
import kotlinx.coroutines.launch

/**
 * Fragmento nativo Android para central de notificações e alertas.
 */
class NotificationsFragment : Fragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var emptyTextView: TextView
    private lateinit var recyclerView: RecyclerView
    private val notificationsList = mutableListOf<NotificationDto>()

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
            text = "Central de Notificações"
            textSize = 22f
            setPadding(0, 0, 0, 16)
        }
        rootLayout.addView(headerText)

        progressBar = ProgressBar(requireContext()).apply {
            visibility = View.VISIBLE
        }
        rootLayout.addView(progressBar)

        emptyTextView = TextView(requireContext()).apply {
            text = "Nenhuma notificação encontrada."
            textSize = 16f
            visibility = View.GONE
        }
        rootLayout.addView(emptyTextView)

        recyclerView = RecyclerView(requireContext()).apply {
            layoutManager = LinearLayoutManager(requireContext())
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }
        rootLayout.addView(recyclerView)

        loadNotifications()

        return rootLayout
    }

    private fun loadNotifications() {
        progressBar.visibility = View.VISIBLE
        emptyTextView.visibility = View.GONE

        viewLifecycleOwner.lifecycleScope.launch {
            when (val result = NotificationsApiService.getMyNotifications()) {
                is NetworkResult.Success -> {
                    progressBar.visibility = View.GONE
                    notificationsList.clear()
                    notificationsList.addAll(result.data)

                    if (notificationsList.isEmpty()) {
                        emptyTextView.visibility = View.VISIBLE
                    } else {
                        recyclerView.adapter = NotificationItemAdapter(notificationsList) { notif ->
                            if (!notif.read) {
                                markAsRead(notif.id)
                            }
                        }
                    }
                }
                is NetworkResult.Error -> {
                    progressBar.visibility = View.GONE
                    emptyTextView.visibility = View.VISIBLE
                    emptyTextView.text = result.message
                    Toast.makeText(requireContext(), result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }

    private fun markAsRead(id: String) {
        viewLifecycleOwner.lifecycleScope.launch {
            NotificationsApiService.markAsRead(id)
            val item = notificationsList.find { it.id == id }
            if (item != null) {
                // Atualiza local
                loadNotifications()
            }
        }
    }
}

class NotificationItemAdapter(
    private val notifications: List<NotificationDto>,
    private val onClick: (NotificationDto) -> Unit
) : RecyclerView.Adapter<NotificationItemAdapter.ViewHolder>() {

    class ViewHolder(val view: LinearLayout) : RecyclerView.ViewHolder(view) {
        val titleView: TextView = view.getChildAt(0) as TextView
        val bodyView: TextView = view.getChildAt(1) as TextView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val layout = LinearLayout(parent.context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 14, 16, 14)
            layoutParams = RecyclerView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 8)
            }
        }

        val titleTv = TextView(parent.context).apply {
            textSize = 15f
            setTextColor(0xFF0F172A.toInt())
        }
        val bodyTv = TextView(parent.context).apply {
            textSize = 13f
            setTextColor(0xFF475569.toInt())
            setPadding(0, 4, 0, 0)
        }

        layout.addView(titleTv)
        layout.addView(bodyTv)

        return ViewHolder(layout)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val notif = notifications[position]
        holder.titleView.text = if (!notif.read) "🔵 ${notif.title}" else notif.title
        holder.bodyView.text = notif.body

        if (!notif.read) {
            holder.view.setBackgroundColor(0xFFE0F2FE.toInt())
        } else {
            holder.view.setBackgroundColor(0xFFFFFFFF.toInt())
        }

        holder.view.setOnClickListener { onClick(notif) }
    }

    override fun getItemCount(): Int = notifications.size
}
