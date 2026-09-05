package br.com.codecode.workix.android.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import br.com.codecode.workix.android.data.model.JobGraphQL
import br.com.codecode.workix.android.data.model.PaginatedListJobData
import br.com.codecode.workix.android.data.repository.JobRepository
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel responsável pelo estado reativo das telas de Vagas no Android.
 */
class JobViewModel(
    private val repository: JobRepository = JobRepository()
) : ViewModel() {

    private val _jobsState = MutableStateFlow<NetworkResult<PaginatedListJobData>>(NetworkResult.Loading)
    val jobsState: StateFlow<NetworkResult<PaginatedListJobData>> = _jobsState.asStateFlow()

    private val _selectedJobState = MutableStateFlow<NetworkResult<JobGraphQL>?>(null)
    val selectedJobState: StateFlow<NetworkResult<JobGraphQL>?> = _selectedJobState.asStateFlow()

    private val _applyState = MutableStateFlow<NetworkResult<Boolean>?>(null)
    val applyState: StateFlow<NetworkResult<Boolean>?> = _applyState.asStateFlow()

    private val _searchState = MutableStateFlow<NetworkResult<JobSearchData>?>(null)
    val searchState: StateFlow<NetworkResult<JobSearchData>?> = _searchState.asStateFlow()

    private val _filterState = MutableStateFlow(JobFilterInput())
    val filterState: StateFlow<JobFilterInput> = _filterState.asStateFlow()

    fun loadJobs(page: Int = 1, limit: Int = 10) {
        viewModelScope.launch {
            _jobsState.value = NetworkResult.Loading
            _jobsState.value = repository.getJobsPaginated(page, limit)
        }
    }

    fun searchJobs(
        filter: JobFilterInput = _filterState.value,
        page: Int = 1,
        limit: Int = 10
    ) {
        viewModelScope.launch {
            _searchState.value = NetworkResult.Loading
            _searchState.value = repository.searchJobs(filter, page, limit)
        }
    }

    fun updateKeyword(keyword: String?) {
        _filterState.value = _filterState.value.copy(keyword = keyword)
        searchJobs()
    }

    fun toggleCategory(category: String) {
        val currentCategories = _filterState.value.categories?.toMutableList() ?: mutableListOf()
        if (currentCategories.contains(category)) {
            currentCategories.remove(category)
        } else {
            currentCategories.add(category)
        }
        _filterState.value = _filterState.value.copy(categories = currentCategories)
        searchJobs()
    }

    fun setCategory(category: String?) {
        val list = if (category.isNullOrBlank()) null else listOf(category)
        _filterState.value = _filterState.value.copy(categories = list)
        searchJobs()
    }

    fun setEmploymentType(employmentType: String?) {
        _filterState.value = _filterState.value.copy(employmentType = employmentType)
        searchJobs()
    }

    fun clearFilters() {
        _filterState.value = JobFilterInput()
        searchJobs()
    }

    fun loadJobDetail(jobId: String) {
        viewModelScope.launch {
            _selectedJobState.value = NetworkResult.Loading
            _selectedJobState.value = repository.getJobById(jobId)
        }
    }

    fun applyToJob(jobId: String, candidateId: String = "1") {
        viewModelScope.launch {
            _applyState.value = NetworkResult.Loading
            _applyState.value = repository.subscribeInJob(jobId, candidateId)
        }
    }

    fun resetApplyState() {
        _applyState.value = null
    }
}
