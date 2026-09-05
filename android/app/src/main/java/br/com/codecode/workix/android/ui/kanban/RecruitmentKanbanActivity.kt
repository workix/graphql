package br.com.codecode.workix.android.ui.kanban

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.data.model.KanbanBoardGraphQL
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.viewmodel.KanbanViewModel
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class RecruitmentKanbanActivity : AppCompatActivity() {

    private val viewModel: KanbanViewModel by viewModels()
    private var jobId: String = "1"
    private var companyId: String = "1"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        jobId = intent.getStringExtra("EXTRA_JOB_ID") ?: "1"
        companyId = intent.getStringExtra("EXTRA_COMPANY_ID") ?: "1"

        viewModel.loadBoard(jobId, companyId)

        lifecycleScope.launch {
            viewModel.boardState.collectLatest { result ->
                when (result) {
                    is NetworkResult.Loading -> {
                        // Exibe progresso
                    }
                    is NetworkResult.Success -> {
                        val board: KanbanBoardGraphQL = result.data
                        // Configura TabLayout e ViewPager2 para navegar entre as etapas do pipeline
                    }
                    is NetworkResult.Error -> {
                        Toast.makeText(this@RecruitmentKanbanActivity, result.message, Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    fun onQuickMoveCandidate(cardId: String, targetStageId: String) {
        viewModel.moveCandidate(cardId, targetStageId, jobId, companyId)
    }
}
