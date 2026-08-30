package br.com.codecode.workix.android.ui.blog

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment

/**
 * Fragmento nativo para artigos e notícias do Blog.
 */
class BlogListFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return TextView(requireContext()).apply {
            text = "Artigos do Blog (Blog)"
            textSize = 20f
            setPadding(32, 32, 32, 32)
        }
    }
}
