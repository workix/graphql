package br.com.codecode.workix.android.ui.interviews

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.NetworkResult
import br.com.codecode.workix.android.viewmodel.InterviewViewModel
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class InterviewsActivity : AppCompatActivity() {

    private val viewModel: InterviewViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val candidateId = intent.getStringExtra("EXTRA_CANDIDATE_ID") ?: "1"
        viewModel.loadCandidateInterviews(candidateId)

        lifecycleScope.launch {
            viewModel.interviewsState.collectLatest { result ->
                when (result) {
                    is NetworkResult.Loading -> {
                        // Exibe estado de carregamento
                    }
                    is NetworkResult.Success -> {
                        val interviewsList = result.data
                        // Popula RecyclerView com lista de entrevistas
                    }
                    is NetworkResult.Error -> {
                        Toast.makeText(this@InterviewsActivity, result.message, Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    fun onConfirmInterview(interviewId: String, candidateId: String) {
        viewModel.respondToInterview(
            interviewId = interviewId,
            status = "CONFIRMED",
            candidateFeedback = "Presença confirmada pelo app Android",
            candidateIdToReload = candidateId
        )
    }

    fun onRejectInterview(interviewId: String, candidateId: String) {
        viewModel.respondToInterview(
            interviewId = interviewId,
            status = "REJECTED",
            candidateFeedback = "Recusado pelo app Android",
            candidateIdToReload = candidateId
        )
    }

    fun onRescheduleInterview(interviewId: String, reason: String, candidateId: String) {
        viewModel.respondToInterview(
            interviewId = interviewId,
            status = "RESCHEDULE_REQUESTED",
            rescheduleReason = reason,
            candidateIdToReload = candidateId
        )
    }
}
