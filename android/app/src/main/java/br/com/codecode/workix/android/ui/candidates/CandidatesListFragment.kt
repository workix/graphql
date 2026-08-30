package br.com.codecode.workix.android.ui.candidates

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment

/**
 * Fragmento nativo para listagem de candidatos e currículos.
 */
class CandidatesListFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return TextView(requireContext()).apply {
            text = "Lista de Candidatos e Currículos (Candidates)"
            textSize = 20f
            setPadding(32, 32, 32, 32)
        }
    }
}
