/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.view.fragment;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.android.adapter.JobAdapter;
import br.com.codecode.workix.android.tasks.AsyncResponse;
import br.com.codecode.workix.android.tasks.TaskDownloadJobs;
import br.com.codecode.workix.core.models.compat.Job;


public class JobsFragment extends BaseFragment {

    private TextView textView;

    private RecyclerView recyclerView;

    private ArrayList<Job> jobs;

    private SwipeRefreshLayout mySwipeRefreshLayout;

    private JobAdapter jobAdapter;

    public JobsFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {

        if (savedInstanceState != null) {

            jobs = (ArrayList<Job>) savedInstanceState.getSerializable("jobs");

        } else {

            jobs = new ArrayList<>();

        }

        View rootView = inflater.inflate(R.layout.fragment_jobs, container, false);

        doCastComponents(rootView);

        doCreateListeners();

        doConfigureAdapter();

        doLoadJobs();

        return rootView;
    }


    private void doConfigureAdapter() {

        RecyclerView.LayoutManager mLayoutManager = new GridLayoutManager(context, 2);

        recyclerView.setLayoutManager(mLayoutManager);

        recyclerView.setHasFixedSize(true);

        recyclerView.setItemAnimator(new DefaultItemAnimator());

        jobAdapter = new JobAdapter(context, jobs);

        recyclerView.setAdapter(jobAdapter);


    }

    @Override
    protected void doCastComponents(View rootView) {

        recyclerView = rootView.findViewById(R.id.recyclerViewJobs);

        mySwipeRefreshLayout = rootView.findViewById(R.id.swipeRefreshJobs);


    }


    @Override
    protected void doCreateListeners() {

        /*
         * Sets up a SwipeRefreshLayout.OnRefreshListener that is invoked when the user
         * performs a swipe-to-refresh gesture.
         */
        mySwipeRefreshLayout.setOnRefreshListener(
                new SwipeRefreshLayout.OnRefreshListener() {
                    @Override
                    public void onRefresh() {

                        Log.i("SWIPE Refresh", "onRefresh called from SwipeRefreshLayout");

                        // This method performs the actual data-refresh operation.
                        // The method calls setRefreshing(false) when it's finished.
                        mySwipeRefreshLayout.setRefreshing(true);

                        doLoadJobs();

                        mySwipeRefreshLayout.setRefreshing(false);

                    }
                }
        );


    }

    private void doLoadJobs() {

        Log.d("[DOWNLOAD-JOBS]", "Load Jobs from webservice");

        new TaskDownloadJobs(context, new AsyncResponse<ArrayList<Job>>() {

            @Override
            public void processFinish(@NonNull ArrayList<Job> output) {

                jobs = output;

                recyclerView.getAdapter().notifyDataSetChanged();
            }
        }).execute();

    }


    @Override
    public void onSaveInstanceState(Bundle outState) {

        super.onSaveInstanceState(outState);

        outState.putSerializable("jobs", jobs);


    }


}


