package br.com.codecode.workix.android.ui.events

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.EventDto
import br.com.codecode.workix.android.network.EventsApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Fragment nativo Android para listagem de eventos e webinars profissionais.
 */
class EventsFragment : Fragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var eventsContainer: LinearLayout

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val context = requireContext()

        val rootLayout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val scrollView = ScrollView(context).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }

        val contentLayout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        val headerText = TextView(context).apply {
            text = "Eventos e Webinars"
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(headerText)

        progressBar = ProgressBar(context)
        contentLayout.addView(progressBar)

        eventsContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(eventsContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)

        loadEvents()

        return rootLayout
    }

    private fun loadEvents() {
        progressBar.visibility = View.VISIBLE

        viewLifecycleOwner.lifecycleScope.launch {
            val list = mutableListOf<EventDto>()
            for (id in 1..3) {
                val res = EventsApiService.getEvent(id.toString())
                if (res is NetworkResult.Success) {
                    list.add(res.data)
                }
            }

            progressBar.visibility = View.GONE
            renderEvents(list)
        }
    }

    private fun renderEvents(events: List<EventDto>) {
        eventsContainer.removeAllViews()
        val context = requireContext()

        for (ev in events) {
            val card = LinearLayout(context).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(16, 16, 16, 16)
                setBackgroundColor(0xFFF8FAFC.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 12)
                }
            }

            val typeBadge = TextView(context).apply {
                text = if (ev.eventType == "IN_PERSON") "PRESENCIAL" else "ONLINE"
                textSize = 11f
                setTextColor(if (ev.eventType == "IN_PERSON") 0xFF16A34A.toInt() else 0xFF0284C7.toInt())
            }
            val titleTv = TextView(context).apply {
                text = ev.title
                textSize = 15f
                setTextColor(0xFF0F172A.toInt())
                setPadding(0, 2, 0, 4)
            }
            val dateTv = TextView(context).apply {
                text = "Data: ${ev.startTime}"
                textSize = 12f
                setTextColor(0xFF64748B.toInt())
                setPadding(0, 0, 0, 10)
            }
            val btnView = Button(context).apply {
                text = "Ver Detalhes & RSVP"
                setOnClickListener {
                    val intent = Intent(context, EventDetailActivity::class.java).apply {
                        putExtra("EVENT_ID", ev.id)
                    }
                    startActivity(intent)
                }
            }

            card.addView(typeBadge)
            card.addView(titleTv)
            card.addView(dateTv)
            card.addView(btnView)
            eventsContainer.addView(card)
        }
    }
}
