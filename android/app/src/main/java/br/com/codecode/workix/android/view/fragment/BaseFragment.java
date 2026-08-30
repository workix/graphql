/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.view.fragment;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.View;

import br.com.codecode.workix.core.models.compat.Candidate;
import br.com.codecode.workix.core.models.compat.Job;

public abstract class BaseFragment extends Fragment {

    protected Context context;

    protected Intent intent;

    protected Candidate candidate;

    protected Job selectedJob;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        doConfigure();

        doLoadExtras(intent);
    }


    protected abstract void doCastComponents(View rootView);

    protected abstract void doCreateListeners();

    private void doConfigure() {

        context = getContext();

        intent = getActivity().getIntent();

        setRetainInstance(true);

    }

    //TODO FIXME VERIFYME
    protected void doLoadExtras(Intent intent) {

        if (intent != null) {

            candidate = (Candidate) intent.getSerializableExtra("candidate");

            selectedJob = (Job) intent.getSerializableExtra("job");

        } else {
            throw new RuntimeException("Forbidden - Could not get Intent");
        }

    }

    public void doChangeActivity(Context context, Class clazz) {

        startActivity(new Intent(context, clazz)
                .putExtra("candidate", candidate)
                .putExtra("job", selectedJob));

    }


}
