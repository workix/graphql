package br.com.codecode.workix.android.ui.social

import android.content.Intent
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
import br.com.codecode.workix.android.network.PostDto
import br.com.codecode.workix.android.network.PostsApiService
import kotlinx.coroutines.launch

/**
 * Fragmento nativo Android para exibição e interação com o Feed Social.
 */
class SocialFeedFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var emptyTextView: TextView
    private val postsList = mutableListOf<PostDto>()

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
            text = "Feed Social da Comunidade"
            textSize = 22f
            setPadding(0, 0, 0, 16)
        }
        rootLayout.addView(headerText)

        progressBar = ProgressBar(requireContext()).apply {
            visibility = View.VISIBLE
        }
        rootLayout.addView(progressBar)

        emptyTextView = TextView(requireContext()).apply {
            text = "Nenhuma publicação no feed."
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

        loadFeed()

        return rootLayout
    }

    private fun loadFeed() {
        progressBar.visibility = View.VISIBLE
        emptyTextView.visibility = View.GONE

        viewLifecycleOwner.lifecycleScope.launch {
            when (val result = PostsApiService.getSocialFeed()) {
                is NetworkResult.Success -> {
                    progressBar.visibility = View.GONE
                    postsList.clear()
                    postsList.addAll(result.data)

                    if (postsList.isEmpty()) {
                        emptyTextView.visibility = View.VISIBLE
                    } else {
                        recyclerView.adapter = PostAdapter(postsList) { post ->
                            val intent = Intent(requireContext(), PostDetailActivity::class.java).apply {
                                putExtra("POST_ID", post.id)
                                putExtra("POST_CONTENT", post.content)
                                putExtra("AUTHOR_ID", post.authorId)
                            }
                            startActivity(intent)
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
}

/**
 * Adapter nativo para listagem de postagens no RecyclerView.
 */
class PostAdapter(
    private val posts: List<PostDto>,
    private val onPostClicked: (PostDto) -> Unit
) : RecyclerView.Adapter<PostAdapter.PostViewHolder>() {

    class PostViewHolder(val view: LinearLayout) : RecyclerView.ViewHolder(view) {
        val authorView: TextView = view.getChildAt(0) as TextView
        val contentView: TextView = view.getChildAt(1) as TextView
        val footerActions: TextView = view.getChildAt(2) as TextView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostViewHolder {
        val itemLayout = LinearLayout(parent.context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(24, 20, 24, 20)
            layoutParams = RecyclerView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 16)
            }
            setBackgroundColor(0xFFFFFFFF.toInt())
        }

        val authorTv = TextView(parent.context).apply {
            textSize = 15f
            setTextColor(0xFF0F172A.toInt())
        }
        val contentTv = TextView(parent.context).apply {
            textSize = 14f
            setTextColor(0xFF334155.toInt())
            setPadding(0, 8, 0, 12)
        }
        val footerTv = TextView(parent.context).apply {
            textSize = 12f
            setTextColor(0xFF0284C7.toInt())
            text = "👍 Curtir  💬 Comentar"
        }

        itemLayout.addView(authorTv)
        itemLayout.addView(contentTv)
        itemLayout.addView(footerTv)

        return PostViewHolder(itemLayout)
    }

    override fun onBindViewHolder(holder: PostViewHolder, position: Int) {
        val post = posts[position]
        holder.authorView.text = "Profissional #${post.authorId}"
        holder.contentView.text = post.content
        holder.view.setOnClickListener { onPostClicked(post) }
    }

    override fun getItemCount(): Int = posts.size
}
