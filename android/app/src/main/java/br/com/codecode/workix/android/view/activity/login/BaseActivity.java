package br.com.codecode.workix.android.view.activity.login;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.widget.EditText;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;

import br.com.codecode.workix.android.util.ConnectivityReceiver;
import br.com.codecode.workix.android.view.activity.MyPattern;

/**
 * @author Felipe Rodrigues Michetti
 *
 * Created on 11/25/16.
 */
abstract class BaseActivity extends AppCompatActivity implements MyPattern,
        ConnectivityReceiver.ConnectivityReceiverListener{

    protected FirebaseAuth firebaseAuth;

    protected Context context;

    protected Bundle bundle;

    protected EditText editTextEmail;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        firebaseAuth = FirebaseAuth.getInstance();

        if(getIntent().hasExtra("bundle")){
            bundle = getIntent().getExtras().getBundle("bundle");
        }
    }

    @Override
    protected void onResume() {

        super.onResume();

        // register connection status listener
        this.setConnectivityListener(this);
    }


    @Override
    public void doChangeActivity(Context context, Class<? extends Activity> clazz){}

    /**
     * Change Activity Method
     * @param context Context
     * @param clazz Destiny Activity Class
     * @param bundle Bundle for Recover , named "bundle"
     */
    protected final void doChangeActivity(@NonNull Context context, @NonNull Class<? extends Activity> clazz, @Nullable Bundle bundle){
        startActivity(new Intent(context,clazz).putExtra("bundle",bundle));
    }

    private final void setConnectivityListener(ConnectivityReceiver.ConnectivityReceiverListener listener) {
        ConnectivityReceiver.connectivityReceiverListener = listener;
    }

    // Method to manually check connection status
    protected final boolean doCheckConnection(Context context) {
        return ConnectivityReceiver.isConnected(context);
    }

    /**
     * Show Toast Message
     * @param context Context
     * @param message Message to Show
     * @param duration {@link Toast#LENGTH_SHORT} or {@link Toast#LENGTH_LONG}
     */
    protected final void showToast(Context context, String message, int duration){
        Toast.makeText(context,message,duration).show();
    }

}
