package br.com.codecode.workix.android.ui.blog

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.ApiClient
import br.com.codecode.workix.android.network.BlogsApiService
import br.com.codecode.workix.android.network.CreateBlogCommentRequest
import kotlinx.coroutines.launch

/**
 * Activity nativa para leitura completa de artigos do blog e inserção de comentários.
 */
class BlogPostActivity : AppCompatActivity() {

    private val blogsService = ApiClient.createService(BlogsApiService::class.java)
    private var blogId: String? = null

    private lateinit var tvTitle: TextView
    private lateinit var tvAuthor: TextView
    private lateinit var tvContent: TextView
    private lateinit var etComment: EditText
    private lateinit var btnSendComment: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        blogId = intent.getStringExtra(EXTRA_BLOG_ID)

        setupViews()
        if (blogId != null) {
            loadBlogPost(blogId!!)
        }
    }

    private fun setupViews() {
        tvTitle = TextView(this).apply { textSize = 22f }
        tvAuthor = TextView(this).apply { textSize = 14f }
        tvContent = TextView(this).apply { textSize = 16f }
        etComment = EditText(this).apply { hint = "Escreva um comentário..." }
        btnSendComment = Button(this).apply { text = "Enviar Comentário" }

        btnSendComment.setOnClickListener {
            val commentText = etComment.text.toString().trim()
            if (commentText.isEmpty()) {
                Toast.makeText(this, "Digite um comentário antes de enviar", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (blogId != null) {
                sendComment(blogId!!, commentText)
            }
        }
    }

    private fun loadBlogPost(id: String) {
        lifecycleScope.launch {
            try {
                val response = blogsService.getBlogById(id)
                if (response.isSuccessful && response.body() != null) {
                    val blog = response.body()!!
                    tvTitle.text = blog.title
                    tvAuthor.text = "Por: ${blog.author ?: "Redação Workix"}"
                    tvContent.text = blog.content
                }
            } catch (e: Exception) {
                Toast.makeText(this@BlogPostActivity, "Erro ao carregar post: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun sendComment(id: String, comment: String) {
        lifecycleScope.launch {
            try {
                val request = CreateBlogCommentRequest(blog_id = id, comment = comment)
                val response = blogsService.createComment(request)
                if (response.isSuccessful) {
                    Toast.makeText(this@BlogPostActivity, "Comentário enviado com sucesso!", Toast.LENGTH_SHORT).show()
                    etComment.text.clear()
                } else {
                    Toast.makeText(this@BlogPostActivity, "Erro ao enviar comentário (${response.code()})", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@BlogPostActivity, "Falha de conexão: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    companion object {
        const val EXTRA_BLOG_ID = "extra_blog_id"
    }
}
