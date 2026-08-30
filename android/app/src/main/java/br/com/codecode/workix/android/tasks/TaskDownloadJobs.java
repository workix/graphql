/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.tasks;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.gson.reflect.TypeToken;

import org.json.JSONObject;

import java.util.ArrayList;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.core.models.compat.Job;
import br.com.codecode.workix.util.GsonProvider;
import br.com.codecode.workix.util.VolleyProvider;


public class TaskDownloadJobs extends AsyncTask<Void, String, ArrayList<Job>> {

    public AsyncResponse delegate = null;

    private String url;

    private ArrayList<Job> jobs;

    private Context context;

    private TaskDownloadJobs() {
        Log.d("DEBUG-TASK", "create TaskDownloadJobs");
    }

    private TaskDownloadJobs(Context context) {
        this();
        this.context = context;
    }

    public TaskDownloadJobs(Context context, AsyncResponse<ArrayList<Job>> delegate) {
        this(context);
        this.delegate = delegate;
    }


    @Override
    protected void onPreExecute() {

        super.onPreExecute();

        url = context.getResources().getString(R.string.server) + "jobs";

        Log.d("DEBUG-TASK", "server config -> " + url);


    }


    @Override
    protected ArrayList<Job> doInBackground(Void... params) {

        String response = "";

            publishProgress("Enviando Requisição para o Servidor");

            //TODO FIXME Receive JSON

            JsonObjectRequest jsObjRequest = new JsonObjectRequest(Request.Method.GET, url, new JSONObject(), new Response.Listener<JSONObject>() {

                @Override
                public void onResponse(JSONObject response) {

                    publishProgress("Itens recebidos !");

                    //TODO FIXME Response Json

                    jobs = GsonProvider.buildGson().fromJson(response.toString(), new TypeToken<ArrayList<Job>>(){}.getType());

                }
            }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {

                    publishProgress("Falha ao Obter Resposta");

                    Log.e("Erro", error.getMessage());

                }
            });

                    // Access the RequestQueue through your singleton class.
                    VolleyProvider.getInstance(context).addToRequestQueue(jsObjRequest);


        return (jobs != null) ? jobs : new ArrayList<Job>();
    }


    @Override
    protected void onProgressUpdate(String... values) {

        super.onProgressUpdate(values);


    }


    @Override
    protected void onPostExecute(ArrayList<Job> result) {

        delegate.processFinish(result);

    }


}
