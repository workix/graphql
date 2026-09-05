package br.com.codecode.workix.android.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import br.com.codecode.workix.android.data.model.CandidateGraphQL
import br.com.codecode.workix.android.data.model.CandidateSearchData
import br.com.codecode.workix.android.data.model.CandidateSearchFilterInput
import br.com.codecode.workix.android.data.repository.CandidateRepository
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class CandidateViewModel(
    private val repository: CandidateRepository = CandidateRepository()
) : ViewModel() {

    private val _searchState = MutableStateFlow<NetworkResult<CandidateSearchData>?>(null)
    val searchState: StateFlow<NetworkResult<CandidateSearchData>?> = _searchState.asStateFlow()

    private val _filterState = MutableStateFlow(CandidateSearchFilterInput())
    val filterState: StateFlow<CandidateSearchFilterInput> = _filterState.asStateFlow()

    private val _updateStatusState = MutableStateFlow<NetworkResult<CandidateGraphQL>?>(null)
    val updateStatusState: StateFlow<NetworkResult<CandidateGraphQL>?> = _updateStatusState.asStateFlow()

    fun searchCandidates(
        query: String? = null,
        filter: CandidateSearchFilterInput = _filterState.value,
        page: Int = 1,
        limit: Int = 20
    ) {
        viewModelScope.launch {
            _searchState.value = NetworkResult.Loading
            _searchState.value = repository.searchCandidates(query, filter, page, limit)
        }
    }

    fun updateFilter(filter: CandidateSearchFilterInput) {
        _filterState.value = filter
        searchCandidates()
    }

    fun saveCareerStatus(
        candidateId: String,
        lookingForJob: Boolean,
        inCareerTransition: Boolean,
        careerTransitionTarget: String?,
        acceptsEntryLevel: Boolean
    ) {
        viewModelScope.launch {
            _updateStatusState.value = NetworkResult.Loading
            _updateStatusState.value = repository.updateCareerStatus(
                candidateId = candidateId,
                lookingForJob = lookingForJob,
                inCareerTransition = inCareerTransition,
                careerTransitionTarget = careerTransitionTarget,
                acceptsEntryLevel = acceptsEntryLevel
            )
        }
    }
}
