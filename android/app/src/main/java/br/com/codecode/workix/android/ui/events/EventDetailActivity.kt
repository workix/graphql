package br.com.codecode.workix.android.ui.events

import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.codecode.workix.android.network.EventAttendeeDto
import br.com.codecode.workix.android.network.EventDto
import br.com.codecode.workix.android.network.EventsApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para exibição de detalhes do evento e confirmação de presença (RSVP).
 */
class EventDetailActivity : AppCompatActivity() {

    private var eventId: String = "1"
    private lateinit var progressBar: ProgressBar
    private lateinit var contentLayout: LinearLayout
    private lateinit var tvTitle: TextView
    private lateinit var tvEventType: TextView
    private lateinit var tvDateTime: TextView
    private lateinit var tvLocation: TextView
    private lateinit var tvDescription: TextView
    private lateinit var btnRSVP: Button
    private lateinit var attendeesContainer: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        eventId = intent.getStringExtra("EVENT_ID") ?: "1"

        setupViews()
        loadData()
    }

    private fun setupViews() {
        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val scrollView = ScrollView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }

        contentLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        progressBar = ProgressBar(this)
        contentLayout.addView(progressBar)

        tvEventType = TextView(this).apply {
            text = "EVENTO ONLINE"
            textSize = 12f
            setTextColor(0xFF0284C7.toInt())
            setPadding(0, 0, 0, 4)
        }
        contentLayout.addView(tvEventType)

        tvTitle = TextView(this).apply {
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 8)
        }
        contentLayout.addView(tvTitle)

        tvDateTime = TextView(this).apply {
            textSize = 13f
            setTextColor(0xFF475569.toInt())
            setPadding(0, 0, 0, 4)
        }
        contentLayout.addView(tvDateTime)

        tvLocation = TextView(this).apply {
            textSize = 13f
            setTextColor(0xFF0284C7.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(tvLocation)

        btnRSVP = Button(this).apply {
            text = "Confirmar Presença (RSVP)"
            setOnClickListener { rsvp() }
        }
        contentLayout.addView(btnRSVP)

        val descHeader = TextView(this).apply {
            text = "Sobre o Evento"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 24, 0, 8)
        }
        contentLayout.addView(descHeader)

        tvDescription = TextView(this).apply {
            textSize = 14f
            setTextColor(0xFF334155.toInt())
            setPadding(0, 0, 0, 24)
        }
        contentLayout.addView(tvDescription)

        val attendeesHeader = TextView(this).apply {
            text = "Participantes Confirmados"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 8)
        }
        contentLayout.addView(attendeesHeader)

        attendeesContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(attendeesContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun loadData() {
        progressBar.visibility = ProgressBar.VISIBLE

        lifecycleScope.launch {
            val eventRes = EventsApiService.getEvent(eventId)
            val attendeesRes = EventsApiService.getEventAttendees(eventId)

            progressBar.visibility = ProgressBar.GONE

            if (eventRes is NetworkResult.Success) {
                renderEvent(eventRes.data)
            }

            if (attendeesRes is NetworkResult.Success) {
                renderAttendees(attendeesRes.data)
            }
        }
    }

    private fun renderEvent(ev: EventDto) {
        tvTitle.text = ev.title
        tvEventType.text = if (ev.eventType == "IN_PERSON") "EVENTO PRESENCIAL" else "WEBINAR ONLINE"
        tvDateTime.text = "Início: ${ev.startTime}"
        tvLocation.text = "Local / Link: ${ev.locationOrUrl ?: "A definir"}"
        tvDescription.text = ev.description ?: "Encontro profissional e de networking promovido pela comunidade Workix."
    }

    private fun renderAttendees(attendees: List<EventAttendeeDto>) {
        attendeesContainer.removeAllViews()
        if (attendees.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "Nenhum participante confirmado ainda."
                textSize = 13f
                setTextColor(0xFF64748B.toInt())
            }
            attendeesContainer.addView(emptyTv)
            return
        }

        for (att in attendees) {
            val attBox = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                setPadding(12, 10, 12, 10)
                setBackgroundColor(0xFFF1F5F9.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 8)
                }
            }

            val nameTv = TextView(this).apply {
                text = "Profissional #${att.userId}"
                textSize = 13f
                setTextColor(0xFF0F172A.toInt())
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }
            val statusTv = TextView(this).apply {
                text = "✓ Confirmado"
                textSize = 12f
                setTextColor(0xFF16A34A.toInt())
            }

            attBox.addView(nameTv)
            attBox.addView(statusTv)
            attendeesContainer.addView(attBox)
        }
    }

    private fun rsvp() {
        btnRSVP.isEnabled = false
        btnRSVP.text = "Confirmando..."

        lifecycleScope.launch {
            when (val res = EventsApiService.attendEvent(eventId, "1")) {
                is NetworkResult.Success -> {
                    btnRSVP.text = "✓ Presença Confirmada"
                    Toast.makeText(this@EventDetailActivity, "Presença confirmada com sucesso!", Toast.LENGTH_SHORT).show()
                    loadData()
                }
                is NetworkResult.Error -> {
                    btnRSVP.isEnabled = true
                    btnRSVP.text = "Confirmar Presença (RSVP)"
                    Toast.makeText(this@EventDetailActivity, res.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}
