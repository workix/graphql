package br.com.codecode.workix.android.ui.learning

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
import br.com.codecode.workix.android.network.CourseDto
import br.com.codecode.workix.android.network.LearningApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Fragment nativo Android para catálogo de cursos do Workix Learning.
 */
class CoursesFragment : Fragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var coursesContainer: LinearLayout

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
            text = "Workix Learning — Cursos"
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(headerText)

        progressBar = ProgressBar(context)
        contentLayout.addView(progressBar)

        coursesContainer = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(coursesContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)

        loadCourses()

        return rootLayout
    }

    private fun loadCourses() {
        progressBar.visibility = View.VISIBLE

        viewLifecycleOwner.lifecycleScope.launch {
            val list = mutableListOf<CourseDto>()
            for (id in 1..3) {
                val res = LearningApiService.getCourse(id.toString())
                if (res is NetworkResult.Success) {
                    list.add(res.data)
                }
            }

            progressBar.visibility = View.GONE
            renderCourses(list)
        }
    }

    private fun renderCourses(courses: List<CourseDto>) {
        coursesContainer.removeAllViews()
        val context = requireContext()

        for (c in courses) {
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

            val badgeTv = TextView(context).apply {
                text = "★ Certificado Incluso"
                textSize = 11f
                setTextColor(0xFF0284C7.toInt())
            }
            val titleTv = TextView(context).apply {
                text = c.title
                textSize = 15f
                setTextColor(0xFF0F172A.toInt())
                setPadding(0, 2, 0, 4)
            }
            val descTv = TextView(context).apply {
                text = c.description ?: "Curso de especialização profissional."
                textSize = 12f
                setTextColor(0xFF64748B.toInt())
                setPadding(0, 0, 0, 10)
            }
            val btnView = Button(context).apply {
                text = "Iniciar Curso"
                setOnClickListener {
                    val intent = Intent(context, LessonPlayerActivity::class.java).apply {
                        putExtra("COURSE_ID", c.id)
                        putExtra("LESSON_ID", "1")
                    }
                    startActivity(intent)
                }
            }

            card.addView(badgeTv)
            card.addView(titleTv)
            card.addView(descTv)
            card.addView(btnView)
            coursesContainer.addView(card)
        }
    }
}
