package br.com.codecode.workix.android.ui.jobs

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import br.com.codecode.workix.android.data.model.JobGraphQL
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.viewmodel.JobViewModel
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

/**
 * Fragmento nativo para listagem, busca e filtragem de vagas com categorias e tipo de contratação.
 */
class JobsListFragment : Fragment() {

    private val viewModel: JobViewModel by viewModels()

    private lateinit var etSearch: EditText
    private lateinit var btnFilter: Button
    private lateinit var tvActiveFilters: TextView
    private lateinit var progressBar: ProgressBar
    private lateinit var tvEmpty: TextView
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: NativeJobAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val context = requireContext()
        val root = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 16, 16, 16)
        }

        // Barra de busca e botão de filtros
        val searchBar = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
        }

        etSearch = EditText(context).apply {
            hint = "Buscar vagas por título, habilidade..."
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }

        val btnSearch = Button(context).apply {
            text = "Buscar"
            setOnClickListener {
                viewModel.updateKeyword(etSearch.text.toString().trim())
            }
        }

        btnFilter = Button(context).apply {
            text = "Filtros"
            setOnClickListener {
                openFilterDialog()
            }
        }

        searchBar.addView(etSearch)
        searchBar.addView(btnSearch)
        searchBar.addView(btnFilter)
        root.addView(searchBar)

        // Resumo de filtros ativos
        tvActiveFilters = TextView(context).apply {
            textSize = 13f
            setPadding(8, 8, 8, 8)
            visibility = View.GONE
        }
        root.addView(tvActiveFilters)

        // Progress bar
        progressBar = ProgressBar(context).apply {
            visibility = View.GONE
        }
        root.addView(progressBar)

        // Mensagem de lista vazia
        tvEmpty = TextView(context).apply {
            text = "Nenhuma vaga encontrada para os filtros selecionados."
            textSize = 16f
            setPadding(16, 32, 16, 32)
            visibility = View.GONE
        }
        root.addView(tvEmpty)

        // RecyclerView
        recyclerView = RecyclerView(context).apply {
            layoutManager = LinearLayoutManager(context)
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }
        adapter = NativeJobAdapter { job ->
            job.id?.let { openJobDetail(it) }
        }
        recyclerView.adapter = adapter
        root.addView(recyclerView)

        setupObservers()

        // Carrega as vagas iniciais via busca
        viewModel.searchJobs()

        return root
    }

    private fun openFilterDialog() {
        val currentFilter = viewModel.filterState.value
        val dialog = JobFilterBottomSheet(
            selectedCategories = currentFilter.categories ?: emptyList(),
            selectedEmploymentType = currentFilter.employmentType
        ) { categories, employmentType ->
            viewModel.searchJobs(
                filter = currentFilter.copy(
                    categories = if (categories.isEmpty()) null else categories,
                    employmentType = employmentType
                )
            )
        }
        dialog.show(childFragmentManager, JobFilterBottomSheet.TAG)
    }

    private fun openJobDetail(jobId: String) {
        val intent = Intent(requireContext(), JobDetailActivity::class.java).apply {
            putExtra(JobDetailActivity.EXTRA_JOB_ID, jobId)
        }
        startActivity(intent)
    }

    private fun setupObservers() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.searchState.collectLatest { result ->
                when (result) {
                    is NetworkResult.Loading -> {
                        progressBar.visibility = View.VISIBLE
                        tvEmpty.visibility = View.GONE
                    }
                    is NetworkResult.Success -> {
                        progressBar.visibility = View.GONE
                        val jobs = result.data.jobs ?: emptyList()
                        adapter.submitList(jobs)
                        tvEmpty.visibility = if (jobs.isEmpty()) View.VISIBLE else View.GONE
                    }
                    is NetworkResult.Error -> {
                        progressBar.visibility = View.GONE
                        Toast.makeText(requireContext(), result.message, Toast.LENGTH_SHORT).show()
                    }
                    null -> {
                        progressBar.visibility = View.GONE
                    }
                }
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.filterState.collectLatest { filter ->
                val activeFilters = mutableListOf<String>()
                filter.categories?.takeIf { it.isNotEmpty() }?.let {
                    activeFilters.add("Categorias (${it.size})")
                }
                filter.employmentType?.let {
                    activeFilters.add("Tipo: $it")
                }
                if (activeFilters.isNotEmpty()) {
                    tvActiveFilters.visibility = View.VISIBLE
                    tvActiveFilters.text = "Filtros ativos: ${activeFilters.joinToString(", ")}"
                } else {
                    tvActiveFilters.visibility = View.GONE
                }
            }
        }
    }

    class NativeJobAdapter(
        private val onJobClicked: (JobGraphQL) -> Unit
    ) : RecyclerView.Adapter<NativeJobAdapter.ViewHolder>() {

        private val items = mutableListOf<JobGraphQL>()

        fun submitList(newItems: List<JobGraphQL>) {
            items.clear()
            items.addAll(newItems)
            notifyDataSetChanged()
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val context = parent.context
            val layout = LinearLayout(context).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(24, 24, 24, 24)
                layoutParams = ViewGroup.MarginLayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 16)
                }
                setBackgroundResource(android.R.drawable.dialog_holo_light_frame)
            }
            return ViewHolder(layout)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val job = items[position]
            holder.bind(job, onJobClicked)
        }

        override fun getItemCount(): Int = items.size

        class ViewHolder(val view: View) : RecyclerView.ViewHolder(view) {
            fun bind(job: JobGraphQL, onClick: (JobGraphQL) -> Unit) {
                val layout = view as LinearLayout
                layout.removeAllViews()

                val context = layout.context

                // Título
                val tvTitle = TextView(context).apply {
                    text = job.title ?: "Sem título"
                    textSize = 18f
                    setTypeface(null, android.graphics.Typeface.BOLD)
                }
                layout.addView(tvTitle)

                // Empresa
                val tvCompany = TextView(context).apply {
                    text = job.company?.name ?: "Empresa confidencial"
                    textSize = 14f
                    setPadding(0, 4, 0, 8)
                }
                layout.addView(tvCompany)

                // Badges: Categorias e Tipo de Contratação
                val badgesLayout = LinearLayout(context).apply {
                    orientation = LinearLayout.HORIZONTAL
                }

                // Badge Tipo de Contratação
                val employmentType = job.employmentType ?: "CLT"
                val tvEmployment = TextView(context).apply {
                    text = "[$employmentType]"
                    textSize = 12f
                    setPadding(0, 0, 12, 0)
                }
                badgesLayout.addView(tvEmployment)

                // Badges Categorias
                val categories = job.categories ?: emptyList()
                if (categories.isNotEmpty()) {
                    val tvCategories = TextView(context).apply {
                        text = "Tags: " + categories.joinToString(", ")
                        textSize = 12f
                    }
                    badgesLayout.addView(tvCategories)
                }

                layout.addView(badgesLayout)

                layout.setOnClickListener {
                    onClick(job)
                }
            }
        }
    }
}
