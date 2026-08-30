package br.com.codecode.workix.android.ui.jobs

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment

/**
 * Fragmento nativo para listagem e busca de vagas de emprego.
 */
class JobsListFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return TextView(requireContext()).apply {
            text = "Lista de Vagas Disponíveis (Jobs)"
            textSize = 20f
            setPadding(32, 32, 32, 32)
        }
    }
}
