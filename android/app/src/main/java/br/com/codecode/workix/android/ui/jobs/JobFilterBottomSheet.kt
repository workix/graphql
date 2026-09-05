package br.com.codecode.workix.android.ui.jobs

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

/**
 * BottomSheet nativo para filtragem de vagas por categorias e tipo de contratação.
 */
class JobFilterBottomSheet(
    private val selectedCategories: List<String> = emptyList(),
    private val selectedEmploymentType: String? = null,
    private val onApplyFilters: (categories: List<String>, employmentType: String?) -> Unit
) : BottomSheetDialogFragment() {

    private val categoriesList = listOf(
        "MEIO_PERIODO" to "Meio Período",
        "PRIMEIRA_OPORTUNIDADE" to "Primeira Oportunidade",
        "ESTAGIO" to "Estágio",
        "NOTURNO" to "Noturno",
        "TEMPORARIO" to "Temporário",
        "FREELANCE" to "Freelance",
        "PERICULOSIDADE" to "Periculosidade"
    )

    private val employmentTypesList = listOf(
        "TODOS" to "Todos os Tipos",
        "CLT" to "CLT",
        "PJ" to "PJ",
        "CONTRATO_TEMPORARIO" to "Contrato Temporário"
    )

    private val currentSelectedCategories = selectedCategories.toMutableSet()
    private var currentEmploymentType: String? = selectedEmploymentType

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val context = requireContext()
        val rootLayout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(48, 32, 48, 48)
        }

        val title = TextView(context).apply {
            text = "Filtrar Oportunidades"
            textSize = 20f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 0, 0, 24)
        }
        rootLayout.addView(title)

        // Seção: Categorias
        val categoriesTitle = TextView(context).apply {
            text = "Categorias de Vagas"
            textSize = 16f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 16, 0, 12)
        }
        rootLayout.addView(categoriesTitle)

        val categoryCheckboxes = mutableListOf<CheckBox>()
        for ((code, label) in categoriesList) {
            val cb = CheckBox(context).apply {
                text = label
                isChecked = currentSelectedCategories.contains(code)
                setOnCheckedChangeListener { _, isChecked ->
                    if (isChecked) {
                        currentSelectedCategories.add(code)
                    } else {
                        currentSelectedCategories.remove(code)
                    }
                }
            }
            categoryCheckboxes.add(cb)
            rootLayout.addView(cb)
        }

        // Seção: Tipo de Contratação
        val contractTitle = TextView(context).apply {
            text = "Tipo de Contratação"
            textSize = 16f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 24, 0, 12)
        }
        rootLayout.addView(contractTitle)

        val radioGroup = RadioGroup(context).apply {
            orientation = RadioGroup.VERTICAL
        }

        for ((code, label) in employmentTypesList) {
            val rb = RadioButton(context).apply {
                text = label
                id = View.generateViewId()
                isChecked = if (code == "TODOS") {
                    currentEmploymentType == null
                } else {
                    currentEmploymentType == code
                }
                setOnClickListener {
                    currentEmploymentType = if (code == "TODOS") null else code
                }
            }
            radioGroup.addView(rb)
        }
        rootLayout.addView(radioGroup)

        // Botões de ação
        val buttonLayout = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, 32, 0, 0)
        }

        val btnClear = Button(context).apply {
            text = "Limpar"
            setOnClickListener {
                currentSelectedCategories.clear()
                currentEmploymentType = null
                onApplyFilters(emptyList(), null)
                dismiss()
            }
        }

        val btnApply = Button(context).apply {
            text = "Aplicar Filtros"
            setOnClickListener {
                onApplyFilters(currentSelectedCategories.toList(), currentEmploymentType)
                dismiss()
            }
        }

        val params = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        buttonLayout.addView(btnClear, params)
        buttonLayout.addView(btnApply, params)
        rootLayout.addView(buttonLayout)

        val scrollView = ScrollView(context).apply {
            addView(rootLayout)
        }

        return scrollView
    }

    companion object {
        const val TAG = "JobFilterBottomSheet"
    }
}
