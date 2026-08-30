package br.com.codecode.workix.android.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment

/**
 * Fragmento nativo para a tela inicial / Destaques da plataforma.
 */
class HomeFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return TextView(requireContext()).apply {
            text = "Bem-vindo ao Workix! (Início)"
            textSize = 20f
            setPadding(32, 32, 32, 32)
        }
    }
}
