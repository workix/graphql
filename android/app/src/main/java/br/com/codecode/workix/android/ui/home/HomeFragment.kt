package br.com.codecode.workix.android.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import br.com.codecode.workix.android.R
import br.com.codecode.workix.android.ui.jobs.JobsListFragment

/**
 * Fragmento da Tela Inicial com Atalhos e Navegação por Categorias de Vagas.
 */
class HomeFragment : Fragment() {

    data class CategoryItem(
        val code: String,
        val title: String,
        val description: String,
        val iconText: String
    )

    private val categories = listOf(
        CategoryItem("MEIO_PERIODO", "Meio Período", "Jornadas parciais para conciliar estudos e projetos", "⏱️"),
        CategoryItem("PRIMEIRA_OPORTUNIDADE", "Primeira Oportunidade", "Vagas de entrada no mercado de trabalho sem exigência de experiência prévia", "🌱"),
        CategoryItem("ESTAGIO", "Estágio", "Oportunidades de aprendizado prático e desenvolvimento", "🎓"),
        CategoryItem("NOTURNO", "Noturno", "Vagas em turnos da noite com adicional noturno", "🌙"),
        CategoryItem("TEMPORARIO", "Emprego Temporário", "Vagas sazonais, projetos e substituições", "📅"),
        CategoryItem("FREELANCE", "Freelance", "Contratos autônomos por entrega ou demanda", "💼"),
        CategoryItem("PERICULOSIDADE", "Com Periculosidade", "Vagas em condições especiais com adicionais legais", "⚠️")
    )

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val context = requireContext()
        val scrollView = ScrollView(context)

        val rootLayout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(24, 24, 24, 24)
        }

        // Cabeçalho de Boas-vindas
        val tvHeader = TextView(context).apply {
            text = "Encontre a vaga ideal para o seu perfil"
            textSize = 22f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 8, 0, 8)
        }
        rootLayout.addView(tvHeader)

        val tvSubheader = TextView(context).apply {
            text = "Explore oportunidades por categorias especializadas:"
            textSize = 15f
            setPadding(0, 0, 0, 24)
        }
        rootLayout.addView(tvSubheader)

        // Seção de Categorias
        val tvSectionTitle = TextView(context).apply {
            text = "Categorias em Destaque"
            textSize = 18f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 8, 0, 16)
        }
        rootLayout.addView(tvSectionTitle)

        // Grid/Lista de Cards de Categorias
        for (category in categories) {
            val cardView = LinearLayout(context).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(24, 20, 24, 20)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 16)
                }
                setBackgroundResource(android.R.drawable.dialog_holo_light_frame)
                isClickable = true
                isFocusable = true
                setOnClickListener {
                    navigateToCategory(category.code)
                }
            }

            val topRow = LinearLayout(context).apply {
                orientation = LinearLayout.HORIZONTAL
            }

            val tvIcon = TextView(context).apply {
                text = category.iconText
                textSize = 20f
                setPadding(0, 0, 12, 0)
            }

            val tvTitle = TextView(context).apply {
                text = category.title
                textSize = 16f
                setTypeface(null, android.graphics.Typeface.BOLD)
            }

            topRow.addView(tvIcon)
            topRow.addView(tvTitle)
            cardView.addView(topRow)

            val tvDesc = TextView(context).apply {
                text = category.description
                textSize = 13f
                setPadding(0, 6, 0, 0)
            }
            cardView.addView(tvDesc)

            rootLayout.addView(cardView)
        }

        scrollView.addView(rootLayout)
        return scrollView
    }

    private fun navigateToCategory(categoryCode: String) {
        val fragment = JobsListFragment.newInstance(category = categoryCode)
        parentFragmentManager.beginTransaction()
            .replace(R.id.container, fragment)
            .addToBackStack(null)
            .commit()
    }
}
