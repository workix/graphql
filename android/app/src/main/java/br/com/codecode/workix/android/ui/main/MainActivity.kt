package br.com.codecode.workix.android.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import br.com.codecode.workix.android.data.SessionManager
import br.com.codecode.workix.android.ui.analytics.ProfileAnalyticsActivity
import br.com.codecode.workix.android.ui.applications.MyApplicationsFragment
import br.com.codecode.workix.android.ui.auth.LoginActivity
import br.com.codecode.workix.android.ui.blog.BlogListFragment
import br.com.codecode.workix.android.ui.candidates.CandidatesListFragment
import br.com.codecode.workix.android.ui.chat.ChatListFragment
import br.com.codecode.workix.android.ui.events.EventsFragment
import br.com.codecode.workix.android.ui.groups.GroupsFragment
import br.com.codecode.workix.android.ui.home.HomeFragment
import br.com.codecode.workix.android.ui.interviews.InterviewsActivity
import br.com.codecode.workix.android.ui.jobs.JobsListFragment
import br.com.codecode.workix.android.ui.kanban.RecruitmentKanbanActivity
import br.com.codecode.workix.android.ui.learning.CoursesFragment
import br.com.codecode.workix.android.ui.network.ConnectionsFragment
import br.com.codecode.workix.android.ui.notifications.NotificationsFragment
import br.com.codecode.workix.android.ui.premium.PremiumPlansActivity
import br.com.codecode.workix.android.ui.social.SocialFeedFragment
import br.com.codecode.workix.android.ui.support.ContactActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

/**
 * Activity principal com BottomNavigationView e menu de opções com acesso a todo o ecossistema Workix.
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

        // Adiciona itens principais à barra de navegação inferior
        val menu = bottomNav.menu
        menu.add(0, MENU_HOME, 0, "Início")
        menu.add(0, MENU_JOBS, 1, "Vagas")
        menu.add(0, MENU_CANDIDATES, 2, "Candidatos")
        menu.add(0, MENU_FEED, 3, "Feed")
        menu.add(0, MENU_BLOG, 4, "Blog")

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
                MENU_FEED -> {
                    loadFragment(SocialFeedFragment())
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

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menu.add(Menu.NONE, MENU_CHAT, 1, "Mensagens & Chat")
        menu.add(Menu.NONE, MENU_NETWORK, 2, "Minha Rede & Conexões")
        menu.add(Menu.NONE, MENU_NOTIFICATIONS, 3, "Notificações")
        menu.add(Menu.NONE, MENU_GROUPS, 4, "Comunidades & Grupos")
        menu.add(Menu.NONE, MENU_EVENTS, 5, "Eventos & Webinars")
        menu.add(Menu.NONE, MENU_COURSES, 6, "Cursos & Aprendizado")
        menu.add(Menu.NONE, MENU_APPLICATIONS, 7, "Minhas Candidaturas")
        menu.add(Menu.NONE, MENU_KANBAN, 8, "Gestão de Vagas (Kanban)")
        menu.add(Menu.NONE, MENU_INTERVIEWS, 9, "Entrevistas Agendadas")
        menu.add(Menu.NONE, MENU_PREMIUM, 10, "Planos Premium")
        menu.add(Menu.NONE, MENU_ANALYTICS, 11, "Analytics de Perfil")
        menu.add(Menu.NONE, MENU_CONTACT, 12, "Suporte & Contato")
        menu.add(Menu.NONE, MENU_LOGOUT, 13, "Sair da Conta")
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            MENU_CHAT -> {
                loadFragment(ChatListFragment())
                true
            }
            MENU_NETWORK -> {
                loadFragment(ConnectionsFragment())
                true
            }
            MENU_NOTIFICATIONS -> {
                loadFragment(NotificationsFragment())
                true
            }
            MENU_GROUPS -> {
                loadFragment(GroupsFragment())
                true
            }
            MENU_EVENTS -> {
                loadFragment(EventsFragment())
                true
            }
            MENU_COURSES -> {
                loadFragment(CoursesFragment())
                true
            }
            MENU_APPLICATIONS -> {
                loadFragment(MyApplicationsFragment())
                true
            }
            MENU_KANBAN -> {
                startActivity(Intent(this, RecruitmentKanbanActivity::class.java))
                true
            }
            MENU_INTERVIEWS -> {
                startActivity(Intent(this, InterviewsActivity::class.java))
                true
            }
            MENU_PREMIUM -> {
                startActivity(Intent(this, PremiumPlansActivity::class.java))
                true
            }
            MENU_ANALYTICS -> {
                startActivity(Intent(this, ProfileAnalyticsActivity::class.java))
                true
            }
            MENU_CONTACT -> {
                startActivity(Intent(this, ContactActivity::class.java))
                true
            }
            MENU_LOGOUT -> {
                sessionManager.clearSession()
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(CONTAINER_ID, fragment)
            .commit()
    }

    companion object {
        private const val CONTAINER_ID = 1001
        private const val MENU_HOME = 1
        private const val MENU_JOBS = 2
        private const val MENU_CANDIDATES = 3
        private const val MENU_FEED = 4
        private const val MENU_BLOG = 5

        private const val MENU_CHAT = 101
        private const val MENU_NETWORK = 102
        private const val MENU_NOTIFICATIONS = 103
        private const val MENU_GROUPS = 104
        private const val MENU_EVENTS = 105
        private const val MENU_COURSES = 106
        private const val MENU_APPLICATIONS = 107
        private const val MENU_KANBAN = 108
        private const val MENU_INTERVIEWS = 109
        private const val MENU_PREMIUM = 110
        private const val MENU_ANALYTICS = 111
        private const val MENU_CONTACT = 112
        private const val MENU_LOGOUT = 113
    }
}
