package br.com.codecode.workix.android.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import br.com.codecode.workix.android.data.model.InterviewGraphQL
import br.com.codecode.workix.android.data.repository.InterviewRepository
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class InterviewViewModel(
    private val repository: InterviewRepository = InterviewRepository()
) : ViewModel() {

    private val _interviewsState = MutableStateFlow<NetworkResult<List<InterviewGraphQL>>>(NetworkResult.Loading)
    val interviewsState: StateFlow<NetworkResult<List<InterviewGraphQL>>> = _interviewsState.asStateFlow()

    private val _responseState = MutableStateFlow<NetworkResult<InterviewGraphQL>?>(null)
    val responseState: StateFlow<NetworkResult<InterviewGraphQL>?> = _responseState.asStateFlow()

    fun loadCandidateInterviews(candidateId: String) {
        viewModelScope.launch {
            _interviewsState.value = NetworkResult.Loading
            _interviewsState.value = repository.listByCandidate(candidateId)
        }
    }

    fun respondToInterview(
        interviewId: String,
        status: String,
        rescheduleReason: String? = null,
        candidateFeedback: String? = null,
        candidateIdToReload: String? = null
    ) {
        viewModelScope.launch {
            _responseState.value = NetworkResult.Loading
            val result = repository.respondInterview(
                interviewId = interviewId,
                status = status,
                rescheduleReason = rescheduleReason,
                candidateFeedback = candidateFeedback
            )
            _responseState.value = result
            if (result is NetworkResult.Success && candidateIdToReload != null) {
                loadCandidateInterviews(candidateIdToReload)
            }
        }
    }
}
