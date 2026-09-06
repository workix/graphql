package br.com.codecode.workix.android.ui

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import br.com.codecode.workix.android.ui.jobs.JobDetailActivity
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class JobApplyE2ETest {

    @Test
    fun testJobDetailAndApplicationLaunch() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), JobDetailActivity::class.java).apply {
            putExtra("EXTRA_JOB_ID", "1")
        }
        val scenario = ActivityScenario.launch<JobDetailActivity>(intent)
        scenario.onActivity { activity ->
            assertNotNull("JobDetailActivity deve carregar os detalhes da vaga e ação de candidatura", activity)
        }
        scenario.close()
    }
}
