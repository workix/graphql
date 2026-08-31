package br.com.codecode.workix.android.ui.social

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
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.network.PostCommentDto
import br.com.codecode.workix.android.network.PostsApiService
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para leitura detalhada de postagens e comentários em tempo real.
 */
class PostDetailActivity : AppCompatActivity() {

    private var postId: String = ""
    private var postContent: String = ""
    private var authorId: String = ""

    private lateinit var tvAuthor: TextView
    private lateinit var tvContent: TextView
    private lateinit var btnReactLike: Button
    private lateinit var btnReactCelebrate: Button
    private lateinit var commentsContainer: LinearLayout
    private lateinit var etComment: EditText
    private lateinit var btnSendComment: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        postId = intent.getStringExtra("POST_ID") ?: "1"
        postContent = intent.getStringExtra("POST_CONTENT") ?: ""
        authorId = intent.getStringExtra("AUTHOR_ID") ?: "1"

        setupViews()
        loadComments()
    }

    private fun setupViews() {
        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(24, 24, 24, 24)
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val scroll = ScrollView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }

        val contentLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }

        tvAuthor = TextView(this).apply {
            text = "Publicado por Profissional #$authorId"
            textSize = 16f
            setTextColor(0xFF0284C7.toInt())
            setPadding(0, 0, 0, 8)
        }
        contentLayout.addView(tvAuthor)

        tvContent = TextView(this).apply {
            text = postContent
            textSize = 18f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(tvContent)

        // Reactions Row
        val reactionsRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, 0, 0, 16)
        }

        btnReactLike = Button(this).apply {
            text = "👍 Curtir"
            setOnClickListener { sendReaction("LIKE") }
        }
        reactionsRow.addView(btnReactLike)

        btnReactCelebrate = Button(this).apply {
            text = "👏 Parabéns"
            setOnClickListener { sendReaction("CELEBRATE") }
        }
        reactionsRow.addView(btnReactCelebrate)
        contentLayout.addView(reactionsRow)

        val commentsTitle = TextView(this).apply {
            text = "Comentários da Comunidade:"
            textSize = 16f
            setPadding(0, 12, 0, 8)
        }
        contentLayout.addView(commentsTitle)

        commentsContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(commentsContainer)

        scroll.addView(contentLayout)
        rootLayout.addView(scroll)

        // Comment Input Row
        val inputRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, 12, 0, 0)
        }

        etComment = EditText(this).apply {
            hint = "Escreva um comentário..."
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        }
        inputRow.addView(etComment)

        btnSendComment = Button(this).apply {
            text = "Enviar"
            setOnClickListener { submitComment() }
        }
        inputRow.addView(btnSendComment)

        rootLayout.addView(inputRow)

        setContentView(rootLayout)
    }

    private fun loadComments() {
        lifecycleScope.launch {
            when (val result = PostsApiService.getComments(postId)) {
                is NetworkResult.Success -> {
                    commentsContainer.removeAllViews()
                    renderComments(result.data)
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@PostDetailActivity, result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }

    private fun renderComments(comments: List<PostCommentDto>) {
        if (comments.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "Nenhum comentário ainda. Seja o primeiro!"
                setPadding(0, 8, 0, 8)
            }
            commentsContainer.addView(emptyTv)
            return
        }

        for (c in comments) {
            val commentTv = TextView(this).apply {
                text = "💬 Profissional #${c.authorId}: ${c.content}"
                textSize = 14f
                setPadding(8, 8, 8, 8)
            }
            commentsContainer.addView(commentTv)
        }
    }

    private fun sendReaction(type: String) {
        lifecycleScope.launch {
            when (val result = PostsApiService.reactToPost(postId, "1", type)) {
                is NetworkResult.Success -> {
                    Toast.makeText(this@PostDetailActivity, "Reação registrada: $type", Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@PostDetailActivity, result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }

    private fun submitComment() {
        val text = etComment.text.toString().trim()
        if (text.isEmpty()) return

        lifecycleScope.launch {
            when (val result = PostsApiService.addComment(postId, "1", text)) {
                is NetworkResult.Success -> {
                    etComment.text.clear()
                    Toast.makeText(this@PostDetailActivity, "Comentário enviado!", Toast.LENGTH_SHORT).show()
                    loadComments()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@PostDetailActivity, result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}
