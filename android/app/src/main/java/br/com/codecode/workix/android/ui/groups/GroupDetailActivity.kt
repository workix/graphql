package br.com.codecode.workix.android.ui.groups

import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.GroupDto
import br.com.codecode.workix.android.network.GroupPostDto
import br.com.codecode.workix.android.network.GroupsApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para exibição de detalhes da comunidade e feed de posts do grupo.
 */
class GroupDetailActivity : AppCompatActivity() {

    private var groupId: String = "1"
    private lateinit var progressBar: ProgressBar
    private lateinit var contentLayout: LinearLayout
    private lateinit var tvGroupName: TextView
    private lateinit var tvGroupDesc: TextView
    private lateinit var tvPrivacy: TextView
    private lateinit var btnJoin: Button
    private lateinit var etPostContent: EditText
    private lateinit var btnPost: Button
    private lateinit var postsContainer: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        groupId = intent.getStringExtra("GROUP_ID") ?: "1"

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

        progressBar = ProgressBar(this)
        contentLayout.addView(progressBar)

        tvGroupName = TextView(this).apply {
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 4)
        }
        contentLayout.addView(tvGroupName)

        tvPrivacy = TextView(this).apply {
            textSize = 12f
            setTextColor(0xFF0284C7.toInt())
            setPadding(0, 0, 0, 8)
        }
        contentLayout.addView(tvPrivacy)

        tvGroupDesc = TextView(this).apply {
            textSize = 14f
            setTextColor(0xFF475569.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(tvGroupDesc)

        btnJoin = Button(this).apply {
            text = "Participar do Grupo"
            setOnClickListener { joinGroup() }
        }
        contentLayout.addView(btnJoin)

        val createPostHeader = TextView(this).apply {
            text = "Publicar na Comunidade"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 24, 0, 8)
        }
        contentLayout.addView(createPostHeader)

        etPostContent = EditText(this).apply {
            hint = "Escreva uma mensagem ou insight..."
            setPadding(12, 12, 12, 12)
            setBackgroundColor(0xFFF8FAFC.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 8)
            }
        }
        contentLayout.addView(etPostContent)

        btnPost = Button(this).apply {
            text = "Publicar no Grupo"
            setOnClickListener { createPost() }
        }
        contentLayout.addView(btnPost)

        val postsHeader = TextView(this).apply {
            text = "Discussões Recentes"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 24, 0, 8)
        }
        contentLayout.addView(postsHeader)

        postsContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(postsContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun loadData() {
        progressBar.visibility = ProgressBar.VISIBLE

        lifecycleScope.launch {
            val groupRes = GroupsApiService.getGroup(groupId)
            val postsRes = GroupsApiService.getGroupPosts(groupId)

            progressBar.visibility = ProgressBar.GONE

            if (groupRes is NetworkResult.Success) {
                renderGroup(groupRes.data)
            }

            if (postsRes is NetworkResult.Success) {
                renderPosts(postsRes.data)
            }
        }
    }

    private fun renderGroup(group: GroupDto) {
        tvGroupName.text = group.name
        tvPrivacy.text = "Privacidade: ${group.privacy ?: "PUBLIC"}"
        tvGroupDesc.text = group.description ?: "Comunidade profissional de tecnologia e conexões."
    }

    private fun renderPosts(posts: List<GroupPostDto>) {
        postsContainer.removeAllViews()
        if (posts.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "Nenhuma discussão iniciada neste grupo."
                textSize = 13f
                setTextColor(0xFF64748B.toInt())
            }
            postsContainer.addView(emptyTv)
            return
        }

        for (post in posts) {
            val postBox = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(14, 12, 14, 12)
                setBackgroundColor(0xFFF1F5F9.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 10)
                }
            }

            val authorTv = TextView(this).apply {
                text = "Membro #${post.authorId}"
                textSize = 12f
                setTextColor(0xFF0284C7.toInt())
                setPadding(0, 0, 0, 4)
            }
            val contentTv = TextView(this).apply {
                text = post.content
                textSize = 14f
                setTextColor(0xFF0F172A.toInt())
            }

            postBox.addView(authorTv)
            postBox.addView(contentTv)
            postsContainer.addView(postBox)
        }
    }

    private fun joinGroup() {
        btnJoin.isEnabled = false
        btnJoin.text = "Ingressando..."

        lifecycleScope.launch {
            when (val res = GroupsApiService.joinGroup(groupId)) {
                is NetworkResult.Success -> {
                    btnJoin.text = "✓ Membro Ativo"
                    Toast.makeText(this@GroupDetailActivity, "Você agora é membro deste grupo!", Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Error -> {
                    btnJoin.isEnabled = true
                    btnJoin.text = "Participar do Grupo"
                    Toast.makeText(this@GroupDetailActivity, res.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }

    private fun createPost() {
        val text = etPostContent.text.toString().trim()
        if (text.isEmpty()) {
            Toast.makeText(this, "Digite o conteúdo da publicação", Toast.LENGTH_SHORT).show()
            return
        }

        btnPost.isEnabled = false
        btnPost.text = "Publicando..."

        lifecycleScope.launch {
            when (val res = GroupsApiService.createGroupPost(groupId, "1", text)) {
                is NetworkResult.Success -> {
                    etPostContent.setText("")
                    Toast.makeText(this@GroupDetailActivity, "Publicado com sucesso no grupo!", Toast.LENGTH_SHORT).show()
                    loadData()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this@GroupDetailActivity, res.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
            btnPost.isEnabled = true
            btnPost.text = "Publicar no Grupo"
        }
    }
}
