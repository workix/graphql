package br.com.codecode.workix.android.ui.learning

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
import br.com.codecode.workix.android.network.CourseDto
import br.com.codecode.workix.android.network.CourseLessonDto
import br.com.codecode.workix.android.network.LearningApiService
import br.com.codecode.workix.android.network.NetworkResult
import kotlinx.coroutines.launch

/**
 * Activity nativa Android para reprodução de videoaulas e conclusão de cursos.
 */
class LessonPlayerActivity : AppCompatActivity() {

    private var courseId: String = "1"
    private var lessonId: String = "1"
    private lateinit var progressBar: ProgressBar
    private lateinit var contentLayout: LinearLayout
    private lateinit var tvCourseTitle: TextView
    private lateinit var tvLessonTitle: TextView
    private lateinit var videoScreen: LinearLayout
    private lateinit var btnComplete: Button
    private lateinit var lessonsContainer: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        courseId = intent.getStringExtra("COURSE_ID") ?: "1"
        lessonId = intent.getStringExtra("LESSON_ID") ?: "1"

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

        tvCourseTitle = TextView(this).apply {
            textSize = 14f
            setTextColor(0xFF0284C7.toInt())
            setPadding(0, 0, 0, 4)
        }
        contentLayout.addView(tvCourseTitle)

        tvLessonTitle = TextView(this).apply {
            textSize = 20f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(tvLessonTitle)

        // Video Screen Placeholder
        videoScreen = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 40, 20, 40)
            setBackgroundColor(0xFF0F172A.toInt())
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 16)
            }
        }

        val playIcon = TextView(this).apply {
            text = "▶ Reproduzindo Videoaula"
            textSize = 16f
            setTextColor(0xFFFFFFFF.toInt())
        }
        videoScreen.addView(playIcon)
        contentLayout.addView(videoScreen)

        btnComplete = Button(this).apply {
            text = "Concluir Curso & Emitir Certificado"
            setOnClickListener { finishCourse() }
        }
        contentLayout.addView(btnComplete)

        val listHeader = TextView(this).apply {
            text = "Grade de Aulas"
            textSize = 16f
            setTextColor(0xFF0F172A.toInt())
            setPadding(0, 24, 0, 8)
        }
        contentLayout.addView(listHeader)

        lessonsContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        contentLayout.addView(lessonsContainer)

        scrollView.addView(contentLayout)
        rootLayout.addView(scrollView)
        setContentView(rootLayout)
    }

    private fun loadData() {
        progressBar.visibility = ProgressBar.VISIBLE

        lifecycleScope.launch {
            val courseRes = LearningApiService.getCourse(courseId)
            val lessonsRes = LearningApiService.getCourseLessons(courseId)

            progressBar.visibility = ProgressBar.GONE

            if (courseRes is NetworkResult.Success) {
                tvCourseTitle.text = "CURSO: ${courseRes.data.title.uppercase()}"
            }

            if (lessonsRes is NetworkResult.Success) {
                renderLessons(lessonsRes.data)
            }
        }
    }

    private fun renderLessons(lessons: List<CourseLessonDto>) {
        lessonsContainer.removeAllViews()
        val current = lessons.find { it.id == lessonId } ?: lessons.firstOrNull()
        tvLessonTitle.text = current?.title ?: "Aula do Curso"

        for (l in lessons) {
            val lBox = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                setPadding(12, 12, 12, 12)
                setBackgroundColor(if (l.id == lessonId) 0xFFE0F2FE.toInt() else 0xFFF8FAFC.toInt())
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 8)
                }
                setOnClickListener {
                    lessonId = l.id
                    loadData()
                }
            }

            val titleTv = TextView(this).apply {
                text = "${l.orderIndex}. ${l.title}"
                textSize = 13f
                setTextColor(0xFF0F172A.toInt())
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }
            val statusTv = TextView(this).apply {
                text = if (l.id == lessonId) "▶ Assistindo" else "✓ Disponível"
                textSize = 11f
                setTextColor(if (l.id == lessonId) 0xFF0284C7.toInt() else 0xFF16A34A.toInt())
            }

            lBox.addView(titleTv)
            lBox.addView(statusTv)
            lessonsContainer.addView(lBox)
        }
    }

    private fun finishCourse() {
        btnComplete.isEnabled = false
        btnComplete.text = "Emitindo Certificado..."

        lifecycleScope.launch {
            when (val res = LearningApiService.completeCourse(courseId)) {
                is NetworkResult.Success -> {
                    btnComplete.text = "✓ Certificado Emitido com Sucesso"
                    Toast.makeText(this@LessonPlayerActivity, "Parabéns! Certificado gerado e adicionado ao perfil.", Toast.LENGTH_LONG).show()
                }
                is NetworkResult.Error -> {
                    btnComplete.isEnabled = true
                    btnComplete.text = "Concluir Curso & Emitir Certificado"
                    Toast.makeText(this@LessonPlayerActivity, res.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        }
    }
}
