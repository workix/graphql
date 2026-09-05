package br.com.codecode.workix.android.ui

import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import br.com.codecode.workix.android.ui.auth.LoginActivity
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class LoginActivityTest {

    @Test
    fun testLoginActivityLaunch() {
        val scenario = ActivityScenario.launch(LoginActivity::class.java)
        scenario.onActivity { activity ->
            assertNotNull("LoginActivity deve inicializar com sucesso", activity)
        }
        scenario.close()
    }
}
