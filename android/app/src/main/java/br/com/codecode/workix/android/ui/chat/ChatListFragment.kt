package br.com.codecode.workix.android.ui.chat

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

data class ChatConversationItem(
    val contactId: String,
    val contactName: String,
    val lastMessage: String,
    val time: String
)

/**
 * Fragmento nativo Android para listagem de conversas e mensagens recentes.
 */
class ChatListFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private val conversations = listOf(
        ChatConversationItem("2", "Lucas Andrade (Engenheiro Sênior)", "Olá! Vi seu perfil no Workix...", "10:45"),
        ChatConversationItem("3", "Juliana Costa (Tech Recruiter)", "Temos uma vaga que combina com você.", "Ontem"),
        ChatConversationItem("4", "Mariana Lima (Product Manager)", "Obrigado por conectar!", "28/08")
    )

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
            text = "Mensagens Diretas"
            textSize = 22f
            setPadding(0, 0, 0, 16)
        }
        rootLayout.addView(headerText)

        recyclerView = RecyclerView(requireContext()).apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = ChatConversationAdapter(conversations) { conv ->
                val intent = Intent(requireContext(), DirectChatActivity::class.java).apply {
                    putExtra("CONTACT_ID", conv.contactId)
                    putExtra("CONTACT_NAME", conv.contactName)
                }
                startActivity(intent)
            }
        }
        rootLayout.addView(recyclerView)

        return rootLayout
    }
}

class ChatConversationAdapter(
    private val items: List<ChatConversationItem>,
    private val onClick: (ChatConversationItem) -> Unit
) : RecyclerView.Adapter<ChatConversationAdapter.ViewHolder>() {

    class ViewHolder(val view: LinearLayout) : RecyclerView.ViewHolder(view) {
        val nameView: TextView = view.getChildAt(0) as TextView
        val msgView: TextView = view.getChildAt(1) as TextView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val layout = LinearLayout(parent.context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 16, 16, 16)
            layoutParams = RecyclerView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setBackgroundColor(0xFFFFFFFF.toInt())
        }

        val nameTv = TextView(parent.context).apply {
            textSize = 15f
            setTextColor(0xFF0F172A.toInt())
        }
        val msgTv = TextView(parent.context).apply {
            textSize = 13f
            setTextColor(0xFF64748B.toInt())
            setPadding(0, 4, 0, 0)
        }

        layout.addView(nameTv)
        layout.addView(msgTv)

        return ViewHolder(layout)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.nameView.text = "${item.contactName} (${item.time})"
        holder.msgView.text = item.lastMessage
        holder.view.setOnClickListener { onClick(item) }
    }

    override fun getItemCount(): Int = items.size
}
