package br.com.codecode.workix.android.ui.chat

import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.DirectMessageDto
import br.com.codecode.workix.android.network.MessagingApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para troca de mensagens diretas 1:1.
 */
class DirectChatActivity : AppCompatActivity() {

    private var contactId: String = ""
    private var contactName: String = ""
    private val myUserId: String = "1"

    private lateinit var tvTitle: TextView
    private lateinit var messagesContainer: LinearLayout
    private lateinit var scrollView: ScrollView
    private lateinit var etMessage: EditText
    private lateinit var btnSend: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        contactId = intent.getStringExtra("CONTACT_ID") ?: "2"
        contactName = intent.getStringExtra("CONTACT_NAME") ?: "Contato"

        setupViews()
        loadMessages()
    }

    private fun setupViews() {
        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 16, 16, 16)
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        tvTitle = TextView(this).apply {
            text = "Conversa com $contactName"
            textSize = 18f
            setPadding(0, 0, 0, 12)
        }
        rootLayout.addView(tvTitle)

        scrollView = ScrollView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }

        messagesContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        scrollView.addView(messagesContainer)
        rootLayout.addView(scrollView)

        val inputLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, 12, 0, 0)
        }

        etMessage = EditText(this).apply {
            hint = "Escreva uma mensagem..."
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        }
        inputLayout.addView(etMessage)

        btnSend = Button(this).apply {
            text = "Enviar"
            setOnClickListener { sendMessage() }
        }
        inputLayout.addView(btnSend)

        rootLayout.addView(inputLayout)

        setContentView(rootLayout)
    }

    private fun loadMessages() {
        lifecycleScope.launch {
            when (val result = MessagingApiService.getDirectMessages(myUserId, contactId)) {
                is NetworkResult.Success -> {
                    messagesContainer.removeAllViews()
                    renderMessages(result.data)
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@DirectChatActivity, result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }

    private fun renderMessages(messages: List<DirectMessageDto>) {
        if (messages.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "Nenhuma mensagem ainda. Inicie a conversa!"
                setPadding(0, 16, 0, 0)
            }
            messagesContainer.addView(emptyTv)
            return
        }

        for (msg in messages) {
            val isMe = msg.senderId == myUserId
            val bubble = TextView(this).apply {
                text = msg.content
                textSize = 14f
                setPadding(16, 12, 16, 12)
                if (isMe) {
                    setBackgroundColor(0xFF0284C7.toInt())
                    setTextColor(0xFFFFFFFF.toInt())
                } else {
                    setBackgroundColor(0xFFE2E8F0.toInt())
                    setTextColor(0xFF0F172A.toInt())
                }
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 4, 0, 4)
                }
            }
            messagesContainer.addView(bubble)
        }

        scrollView.post {
            scrollView.fullScroll(ScrollView.FOCUS_DOWN)
        }
    }

    private fun sendMessage() {
        val text = etMessage.text.toString().trim()
        if (text.isEmpty()) return

        lifecycleScope.launch {
            when (val result = MessagingApiService.sendDirectMessage(myUserId, contactId, text)) {
                is NetworkResult.Success -> {
                    etMessage.text.clear()
                    loadMessages()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@DirectChatActivity, result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}
