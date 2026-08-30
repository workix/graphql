package br.com.codecode.workix.android.ui.main

import android.content.Intent
import android.os.Bundle
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import br.com.codecode.workix.android.data.SessionManager
import br.com.codecode.workix.android.ui.auth.LoginActivity
import br.com.codecode.workix.android.ui.blog.BlogListFragment
import br.com.codecode.workix.android.ui.candidates.CandidatesListFragment
import br.com.codecode.workix.android.ui.home.HomeFragment
import br.com.codecode.workix.android.ui.jobs.JobsListFragment
import com.google.android.material.bottomnavigation.BottomNavigationView

/**
 * Activity principal com BottomNavigationView para alternar entre os fragmentos principais.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager
    private lateinit var container: FrameLayout
    private lateinit var bottomNav: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sessionManager = SessionManager.getInstance(this)

        if (!sessionManager.isLoggedIn()) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }

        setupViews()

        val rootLayout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            addView(container, android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f
            ))
            addView(bottomNav)
        }
        setContentView(rootLayout)

        if (savedInstanceState == null) {
            loadFragment(HomeFragment())
        }
    }

    private fun setupViews() {
        container = FrameLayout(this).apply { id = CONTAINER_ID }
        bottomNav = BottomNavigationView(this)

        // Adiciona itens dinamicamente à barra de navegação inferior
        val menu = bottomNav.menu
        menu.add(0, MENU_HOME, 0, "Início")
        menu.add(0, MENU_JOBS, 1, "Vagas")
        menu.add(0, MENU_CANDIDATES, 2, "Candidatos")
        menu.add(0, MENU_BLOG, 3, "Blog")

        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                MENU_HOME -> {
                    loadFragment(HomeFragment())
                    true
                }
                MENU_JOBS -> {
                    loadFragment(JobsListFragment())
                    true
                }
                MENU_CANDIDATES -> {
                    loadFragment(CandidatesListFragment())
                    true
                }
                MENU_BLOG -> {
                    loadFragment(BlogListFragment())
                    true
                }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(CONTAINER_ID, fragment)
            .commit()
    }

    companion object {
        private const val CONTAINER_ID = 1001
        private const val MENU_HOME = 1
        private const val MENU_JOBS = 2
        private const val MENU_CANDIDATES = 3
        private const val MENU_BLOG = 4
    }
}
