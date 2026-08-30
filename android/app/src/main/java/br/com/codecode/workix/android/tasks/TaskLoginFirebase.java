/**
 * @author Felipe Rodrigues Michetti

 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.tasks;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.support.annotation.NonNull;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;

import org.json.JSONException;
import org.json.JSONObject;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.core.models.compat.Candidate;
import br.com.codecode.workix.core.models.compat.Token;
import br.com.codecode.workix.util.GsonProvider;
import br.com.codecode.workix.util.VolleyProvider;


public class TaskLoginFirebase extends AsyncTask<Token, String, Candidate> {

    private AsyncResponse asyncResponse = null;

    private Candidate candidate;

    private ProgressDialog dialog;

    private String url;

    private Context context;

    private TaskLoginFirebase() {
        Log.d("DEBUG-TASK", "create TaskLoginFirebase");
    }

    private TaskLoginFirebase(Context context) {
        this.context = context;
    }

    public TaskLoginFirebase(Context context, AsyncResponse<Candidate> asyncResponse) {
        this(context);
        this.asyncResponse = asyncResponse;
    }


    @Override
    protected void onPreExecute() {

        super.onPreExecute();

        url = context.getResources().getString(R.string.server) + "login/firebaselogin";

        Log.d("DEBUG-TASK", "server config -> " + url);

        dialog = new ProgressDialog(context);

        dialog.setTitle(context.getString(R.string.processing));

        dialog.setIndeterminate(true);

        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);

        dialog.setMessage("Starting Task Login on Firebase");

        dialog.show();


    }

    @Override
    protected Candidate doInBackground(Token... params) {

        for (int x = 0; x < params.length; x++) {
            if (params[x] == null)
                throw new RuntimeException("Unexpected Token at Param[" + x + "]");
        }

        try {

            publishProgress("Send Token to Server");

            VolleyProvider.getInstance(context).addToRequestQueue(new JsonObjectRequest(Request.Method.POST, url,
                    new JSONObject(GsonProvider.buildGson().toJson(params[0])), new Response.Listener<JSONObject>() {

                @Override
                public void onResponse(JSONObject response) {

                    Log.d("JSON", response.toString());

                    publishProgress("Objeto recebido");


                    try {

                        if (response.has("action") && response.isNull("action")) {

                            throw new RuntimeException("Server Response is Null or Empty");

                        } else if (response.has("action") && response.get("action").equals("rebuild")) {

                            Log.d("DEBUG", "Existent ID on Firebase");

                            Log.d("DEBUG", "Empty Object");

                            FirebaseAuth.getInstance().getCurrentUser().delete().addOnCompleteListener(new OnCompleteListener<Void>() {

                                @Override
                                public void onComplete(@NonNull Task<Void> task) {

                                    Toast.makeText(context, context.getString(R.string.delete_account_success), Toast.LENGTH_LONG).show();

                                    Toast.makeText(context, context.getString(R.string.repeat_register_operation), Toast.LENGTH_LONG).show();


                                }

                            }).addOnFailureListener(new OnFailureListener() {

                                @Override
                                public void onFailure(@NonNull Exception e) {

                                    Toast.makeText(context, context.getString(R.string.delete_account_failed), Toast.LENGTH_LONG).show();

                                    Toast.makeText(context, context.getString(R.string.could_not_authorize), Toast.LENGTH_LONG).show();
                                }
                            });


                        } else {

                            publishProgress("Creating Object");

                            candidate = GsonProvider.buildGson().fromJson(response.toString(),
                                    new TypeToken<Candidate>() {
                                    }.getType());

                        }

                    } catch (JSONException | JsonParseException e) {
                        e.printStackTrace();
                    }

                }

            }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {

                    candidate = null;

                    Log.e("Error", "Unexpected Response : " + error.getMessage());

                    error.printStackTrace();
                }

            }));

            publishProgress("Login Validated!");

            publishProgress("Enter...");


        } catch (JSONException e) {
            e.printStackTrace();
        }

        return candidate;
    }

    @Override
    protected void onProgressUpdate(String... values) {

        super.onProgressUpdate(values);

        dialog.setMessage(String.valueOf(values[0]));
    }


    @Override
    protected void onPostExecute(Candidate result) {

        dialog.setMessage(context.getString(R.string.process_finish));

        dialog.dismiss();

        asyncResponse.processFinish(result);

    }
}
