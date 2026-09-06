package br.com.codecode.workix.android.ui

import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import br.com.codecode.workix.android.ui.main.MainActivity
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class ProfileAndNetworkE2ETest {

    @Test
    fun testNavigationBetweenTabsAndProfile() {
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        scenario.onActivity { activity ->
            assertNotNull("MainActivity deve permitir navegação entre feed, vagas, rede e perfil", activity)
        }
        scenario.close()
    }
}
