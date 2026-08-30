/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.tasks;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.gson.reflect.TypeToken;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.core.models.compat.Candidate;
import br.com.codecode.workix.util.GsonProvider;
import br.com.codecode.workix.util.VolleyProvider;


public class TaskCreateCandidate extends AsyncTask<Candidate, String, Candidate> {

    private AsyncResponse asyncResponse = null;

    private String url;

    private ProgressDialog dialog;

    private Context context;

    private String response;

    private Candidate c;


    private TaskCreateCandidate() {

        Log.d("DEBUG-TASK", "create TaskCreateCandidate");

    }

    private TaskCreateCandidate(Context context) {
        this();
        this.context = context;
    }

    public TaskCreateCandidate(Context context, AsyncResponse<Candidate> asyncResponse) {
        this(context);
        this.asyncResponse = asyncResponse;
    }

    @Override
    protected void onPreExecute() {

        super.onPreExecute();

        url = context.getResources().getString(R.string.server) + "save/candidate";

        Log.d("DEBUG-TASK", "server config -> " + url);

        dialog = new ProgressDialog(context);

        dialog.setTitle("Processando");

        dialog.setIndeterminate(true);

        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);

        dialog.setMessage("Iniciando a Tarefa Criar Novo Login");

        dialog.show();

    }

    @Override
    protected Candidate doInBackground(Candidate... params) throws RuntimeException {

        for (int x = 0; x < params.length; x++) {

            if (!(params[x] instanceof Serializable)) {

                throw new RuntimeException("Object of Param [" + x + "] MUST implements Serializable");
            }
        }


        try {

            VolleyProvider.getInstance(context).addToRequestQueue(new JsonObjectRequest(Request.Method.POST, url,
                    new JSONObject(GsonProvider.buildGson().toJson(params[0])), new Response.Listener<JSONObject>() {

                @Override
                public void onResponse(JSONObject response) {

                    publishProgress("Item recebido !");

                    c = GsonProvider.buildGson().fromJson(response.toString(), new TypeToken<Candidate>(){}.getType());

                }

            }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {
                    publishProgress("Cannot be Save Changes !");
                    c = c;
                }

            }));

        } catch (JSONException e) {
            e.printStackTrace();
        }


        publishProgress("Enviando Requisição para o Servidor");

        return c;

    }

    @Override
    protected void onProgressUpdate(String... values) {

        super.onProgressUpdate(values);

        dialog.setMessage(String.valueOf(values[0]));
    }


    @Override
    protected void onPostExecute(Candidate result) {

        dialog.setMessage("Tarefa Finalizada!");

        dialog.dismiss();

        asyncResponse.processFinish(result);

    }
}
