package br.com.codecode.workix.android.ui.candidates

import android.os.Bundle
import android.text.Html
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import br.com.codecode.workix.android.data.model.CandidateGraphQL

class CandidateResumeMarkdownFragment : Fragment() {

    private var candidate: CandidateGraphQL? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = TextView(requireContext()).apply {
            setPadding(32, 32, 32, 32)
            textSize = 15f
            setTextColor(0xFF1E293B.toInt())
            movementMethod = android.text.method.LinkMovementMethod.getInstance()
        }

        renderMarkdownContent(view)
        return view
    }

    fun setCandidateData(data: CandidateGraphQL) {
        this.candidate = data
        view?.let {
            if (it is TextView) {
                renderMarkdownContent(it)
            }
        }
    }

    private fun renderMarkdownContent(textView: TextView) {
        val rawMarkdown = candidate?.normalizedResume?.rawMarkdown
        if (rawMarkdown.isNullOrBlank()) {
            textView.text = "Nenhum currículo normalizado cadastrado."
            return
        }

        // Conversor básico de Markdown para Spanned HTML
        var html = rawMarkdown
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace(Regex("^### (.*$)", RegexOption.MULTILINE), "<h3>$1</h3>")
            .replace(Regex("^## (.*$)", RegexOption.MULTILINE), "<h2>$1</h2>")
            .replace(Regex("^# (.*$)", RegexOption.MULTILINE), "<h1>$1</h1>")
            .replace(Regex("\\*\\*(.*?)\\*\\*"), "<b>$1</b>")
            .replace(Regex("\\*(.*?)\\*"), "<i>$1</i>")
            .replace(Regex("\\[(.*?)\\]\\((.*?)\\)"), "<a href=\"$2\">$1</a>")
            .replace(Regex("^- (.*$)", RegexOption.MULTILINE), "• $1<br/>")
            .replace("\n\n", "<br/><br/>")
            .replace("\n", "<br/>")

        textView.text = Html.fromHtml(html, Html.FROM_HTML_MODE_LEGACY)
    }

    companion object {
        fun newInstance(candidate: CandidateGraphQL): CandidateResumeMarkdownFragment {
            return CandidateResumeMarkdownFragment().apply {
                setCandidateData(candidate)
            }
        }
    }
}
