/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.tasks;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.support.annotation.NonNull;
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
import br.com.codecode.workix.core.models.compat.User;
import br.com.codecode.workix.util.GsonProvider;
import br.com.codecode.workix.util.VolleyProvider;

public class TaskCreateUser extends AsyncTask<User, String, User> {

    private AsyncResponse asyncResponse = null;

    private String url;

    private ProgressDialog dialog;

    private Context context;

    private String response;

    private User u;


    private TaskCreateUser() {

        Log.d("DEBUG-TASK", "create TaskCreateUser");

    }

    private TaskCreateUser(Context context) {
        this();
        this.context = context;
    }

    public TaskCreateUser(Context context, AsyncResponse<User> asyncResponse) {
        this(context);
        this.asyncResponse = asyncResponse;
    }

    @Override
    protected void onPreExecute() {

        super.onPreExecute();

        url = context.getResources().getString(R.string.server) + "save/user";

        Log.d("DEBUG-TASK", "server config -> " + url);

        dialog = new ProgressDialog(context);

        dialog.setTitle(context.getString(R.string.processing));

        dialog.setIndeterminate(true);

        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);

        dialog.setMessage("Iniciando a Tarefa Criar Novo Login");

        dialog.show();

    }

    /**
     *
     * @param params User
     * @return A new User
     * @throws RuntimeException if Not Passivate Capable
     */
    @Override
    protected User doInBackground(@NonNull User... params) throws RuntimeException {

        for (int x = 0; x < params.length; x++) {

            if (!(params[x] instanceof Serializable)) {

                throw new RuntimeException("Object of Param [" + x + "] MUST implements Serializable");
            }
        }

                publishProgress("Enviando Requisição para o Servidor");

        try {

            VolleyProvider.getInstance(context).addToRequestQueue(new JsonObjectRequest(Request.Method.POST, url,
                    new JSONObject(GsonProvider.buildGson().toJson(params[0])), new Response.Listener<JSONObject>() {

                @Override
                public void onResponse(JSONObject response) {

                    publishProgress("Item received !");

                    u = GsonProvider.buildGson().fromJson(response.toString(), new TypeToken<User>(){}.getType());

                }

            }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {

                    u = null;

                    error.printStackTrace();
                }


            }));

        } catch (JSONException e) {

            e.printStackTrace();

        }


        return u;
    }

    @Override
    protected void onProgressUpdate(String... values) {

        super.onProgressUpdate(values);

        dialog.setMessage(String.valueOf(values[0]));
    }


    @Override
    protected void onPostExecute(User result) {

        dialog.setMessage(context.getString(R.string.process_finish));

        dialog.dismiss();

        asyncResponse.processFinish(result);

    }
}
