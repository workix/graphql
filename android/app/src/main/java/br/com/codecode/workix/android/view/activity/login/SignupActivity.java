/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.view.activity.login;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.Snackbar;
import android.support.v7.app.ActionBar;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.iid.FirebaseInstanceId;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.android.tasks.AsyncResponse;
import br.com.codecode.workix.android.tasks.TaskCreateUser;
import br.com.codecode.workix.android.util.ConnectivityReceiver;
import br.com.codecode.workix.android.view.activity.CandidateActivity;
import br.com.codecode.workix.core.models.compat.User;


public class SignupActivity extends BaseActivity {

    private ActionBar actionBar;

    private EditText editTextEmail, editTextPassword;

    private Button btnSignIn, btnSignUp, btnResetPassword;

    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_signup);

        doCastComponents();

        doCreateListeners();

    }

    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {

        super.onPostCreate(savedInstanceState);

        doConfigure();

        doCheckConnection();

        //TODO REMOVEME
        editTextEmail.setText("");

        //TODO REMOVEME
        editTextPassword.setText("");
    }

    @Override
    protected void onResume() {

        super.onResume();

        progressBar.setVisibility(View.GONE);

    }

    @Override
    public void doCastComponents() {

        Toolbar toolbar = findViewById(R.id.toolbar_dark);

        setSupportActionBar(toolbar);

        btnSignIn = findViewById(R.id.google_sign_in_button);

        btnSignUp = findViewById(R.id.sign_up_button);

        editTextEmail = findViewById(R.id.email);

        editTextPassword = findViewById(R.id.password);

        progressBar = findViewById(R.id.progressBar);

        btnResetPassword = findViewById(R.id.btn_reset_password);
    }

    @Override
    public void doCreateListeners() {

        btnResetPassword.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                Bundle b = new Bundle();

                b.putString(editTextEmail.getText().toString(),"email");

                doChangeActivity(context,ResetPasswordActivity.class,b);

            }
        });

        btnSignIn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                finish();
            }
        });

        btnSignUp.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                String email = editTextEmail.getText().toString().trim();

                String password = editTextPassword.getText().toString().trim();

                if (TextUtils.isEmpty(email)) {

                    showToast(context, getString(R.string.enter_email_address), Toast.LENGTH_SHORT);

                    return;
                }

                if (TextUtils.isEmpty(password)) {

                    showToast(context, getString(R.string.enter_password), Toast.LENGTH_SHORT);

                    return;
                }

                if (password.length() < 6) {

                    showToast(context, getString(R.string.minimum_password), Toast.LENGTH_SHORT);

                    return;
                }

                if (doCheckConnection()) {

                    progressBar.setVisibility(View.VISIBLE);

                    //create fireUser
                    firebaseAuth.createUserWithEmailAndPassword(email, password)
                            .addOnCompleteListener(SignupActivity.this, new OnCompleteListener<AuthResult>() {

                                @Override
                                public void onComplete(@NonNull Task<AuthResult> task) {

                                    progressBar.setVisibility(View.GONE);

                                    /* If sign in fails, display a message to the fireUser. If sign in succeeds
                                     the firebaseAuth state listener will be notified and logic to handle the
                                     signed in fireUser can be handled in the listener.*/
                                    if (!task.isSuccessful()) {

                                        showToast(context, getString(R.string.auth_error) + task.getException(),
                                                Toast.LENGTH_LONG);

                                        Log.d("DEBUG-LOGIN", getString(R.string.auth_error) + task.getException().toString());


                                    } else {

                                        FirebaseUser fireUser = firebaseAuth.getCurrentUser();

                                        final User user = new User();

                                        user.setFirebaseUUID(fireUser.getUid());

                                        user.setEmail(fireUser.getEmail());

                                        user.setFirebaseMessageToken(FirebaseInstanceId.getInstance().getToken());

                                        new TaskCreateUser(context, new AsyncResponse<User>() {

                                            @Override
                                            public void processFinish(@NonNull User output) {

                                                if(output == null) throw new RuntimeException("Forbidden - User is Null");

                                                startActivity(new Intent(context, CandidateActivity.class)
                                                            .putExtra("user", output));

                                                finish();




                                            }
                                        }).execute(user);

                                    }
                                }
                            }).addOnFailureListener(new OnFailureListener() {

                        @Override
                        public void onFailure(@NonNull Exception e) {

                            showToast(context, "Não foi Possível cadastrar o usuário", Toast.LENGTH_SHORT);

                            Log.e("ERROR LOGIN", e.getMessage());

                        }
                    });

                } else {

                    showSnack(doCheckConnection());

                }


            }
        });
    }

    @Override
    public void setupToolBar() {

    }

    @Override
    public void doConfigure() {

        context = this;

        actionBar = getSupportActionBar();

        actionBar.setDisplayHomeAsUpEnabled(true);

        actionBar.setTitle(R.string.app_name);

        actionBar.setSubtitle(R.string.register);

        if(bundle != null){
            editTextEmail.setText(bundle.getString("email"));
        }

    }

    @Override
    public void doChangeActivity(Context context, Class clazz) {
        startActivity(new Intent(context,clazz));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        int id = item.getItemId();

        if (id == android.R.id.home) {

            finish();

        }

        return super.onOptionsItemSelected(item);
    }

    // Method to manually check connection status
    private boolean doCheckConnection() {

        boolean isConnected = ConnectivityReceiver.isConnected(context);

        return isConnected;
    }

    // Showing the status in Snackbar
    private void showSnack(boolean isConnected) {

        String message;

        int color;

        if (isConnected) {

            message = getString(R.string.connected_on_internet);

            color = Color.GREEN;

        } else {

            message = getString(R.string.not_connected_on_internet);

            color = Color.RED;
        }

        Snackbar snackbar = Snackbar
                .make(findViewById(R.id.coordlayoutsignup), message, Snackbar.LENGTH_LONG);

        View sbView = snackbar.getView();

        TextView textView = sbView.findViewById(android.support.design.R.id.snackbar_text);

        textView.setTextColor(color);

        snackbar.show();

    }


    /**
     * Callback will be triggered when there is change in
     * network connection
     */
    @Override
    public void onNetworkConnectionChanged(boolean isConnected) {

        showSnack(isConnected);
    }

}
