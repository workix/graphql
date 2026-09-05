package br.com.codecode.workix.android.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import br.com.codecode.workix.android.data.model.KanbanBoardGraphQL
import br.com.codecode.workix.android.data.model.KanbanCardGraphQL
import br.com.codecode.workix.android.data.repository.KanbanRepository
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class KanbanViewModel(
    private val repository: KanbanRepository = KanbanRepository()
) : ViewModel() {

    private val _boardState = MutableStateFlow<NetworkResult<KanbanBoardGraphQL>>(NetworkResult.Loading)
    val boardState: StateFlow<NetworkResult<KanbanBoardGraphQL>> = _boardState.asStateFlow()

    private val _moveCardState = MutableStateFlow<NetworkResult<KanbanCardGraphQL>?>(null)
    val moveCardState: StateFlow<NetworkResult<KanbanCardGraphQL>?> = _moveCardState.asStateFlow()

    fun loadBoard(jobId: String, companyId: String) {
        viewModelScope.launch {
            _boardState.value = NetworkResult.Loading
            _boardState.value = repository.getBoard(jobId, companyId)
        }
    }

    fun moveCandidate(cardId: String, targetStageId: String, jobId: String, companyId: String) {
        viewModelScope.launch {
            _moveCardState.value = NetworkResult.Loading
            val result = repository.moveCard(cardId, targetStageId)
            _moveCardState.value = result
            if (result is NetworkResult.Success) {
                loadBoard(jobId, companyId)
            }
        }
    }
}
