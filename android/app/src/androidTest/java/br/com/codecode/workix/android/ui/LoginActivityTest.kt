package br.com.codecode.workix.android.ui

import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import br.com.codecode.workix.android.R
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

    @Test
    fun testLoginValidationAndInteraction() {
        val scenario = ActivityScenario.launch(LoginActivity::class.java)
        
        onView(withId(R.id.email)).check(matches(isDisplayed()))
        onView(withId(R.id.password)).check(matches(isDisplayed()))
        onView(withId(R.id.btn_login)).check(matches(isDisplayed()))

        onView(withId(R.id.email)).perform(typeText("candidato@workix.com"), closeSoftKeyboard())
        onView(withId(R.id.password)).perform(typeText("SenhaForte123!"), closeSoftKeyboard())

        onView(withId(R.id.btn_login)).perform(click())

        scenario.close()
    }
}
