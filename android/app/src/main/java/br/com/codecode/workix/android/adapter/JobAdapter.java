package br.com.codecode.workix.android.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.core.models.compat.Job;


/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 * <p>
 * Created on 10/25/16.
 */
public class JobAdapter extends RecyclerView.Adapter<JobAdapter.MyViewHolder> {

    private Context context;

    private ArrayList<Job> jobs;


    public JobAdapter(Context context, ArrayList<Job> jobs) {
        this.context = context;
        this.jobs = jobs;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.job_card, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(final MyViewHolder holder, int position) {

        Job job = jobs.get(position);

        holder.title.setText(job.getTitle());

        holder.employeer.setText(job.getCompany().getName());

        holder.minPayment.setText(String.valueOf(job.getMinPayment()));


    }

    @Override
    public int getItemCount() {
        return jobs.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {

        public TextView title, employeer, minPayment;

        public MyViewHolder(View view) {

            super(view);

            title = view.findViewById(R.id.title);

           // minPayment = (TextView) view.findViewById(R.id.minPayment);

            //employeer = (TextView) view.findViewById(R.id.employeer);


        }

    }


}



