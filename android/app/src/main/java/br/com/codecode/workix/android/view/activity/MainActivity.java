/**
 * @author Felipe Rodrigues Michetti
 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.view.activity;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.CoordinatorLayout;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.iid.FirebaseInstanceId;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.android.view.fragment.FragmentDrawer;
import br.com.codecode.workix.android.view.fragment.JobsFragment;
import br.com.codecode.workix.core.models.compat.Job;


public class MainActivity extends BaseActivity implements FragmentDrawer.FragmentDrawerListener {

    private static String TAG = MainActivity.class.getSimpleName();

    private FragmentDrawer drawerFragment;

    private ImageView imageView;

    private TextView textView;

    private boolean permission;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        doCastComponents();

        doCreateListeners();

        setupToolBar();

    }

    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {

        super.onPostCreate(savedInstanceState);

        doPrepareItems();

        doSetFragment();

        doShowInfo();


    }

    private void doPrepareItems() {

        if (selectedJob == null) {

            selectedJob = new Job();
        }

    }

    //TODO FIXME show info personal data
    private void doShowInfo() {

        if (firebaseUser != null) {

            Log.i("INFO - USER", ((firebaseUser.getDisplayName() != null) ? firebaseUser.getDisplayName() : ""));

            Log.i("INFO - USER", ((firebaseUser.getEmail() != null) ? firebaseUser.getEmail() : ""));

            Log.i("INFO - USER", ((firebaseUser.getProviderId() != null) ? firebaseUser.getProviderId() : ""));

            Log.i("INFO - USER", ((firebaseUser.getPhotoUrl() != null) ? firebaseUser.getPhotoUrl().toString() : ""));
        }


        if (firebaseUser.getEmail() != null) {

            textView.append(firebaseUser.getEmail());

        }

        String refreshedToken = FirebaseInstanceId.getInstance().getToken();

        Log.i(TAG, "[Refreshed token] \n" + refreshedToken);


    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        super.onOptionsItemSelected(item);

        int id = item.getItemId();

        if (id == R.id.action_settings) {

            doChangeActivity(context, OptionsActivity.class);

        }

        if (id == R.id.action_personal_data) {

            doChangeActivity(context, CandidateActivity.class);
        }

        if (id == R.id.action_contact_developer) {

            Intent i = new Intent(Intent.ACTION_SEND);

            i.setType("message/rfc822");

            i.putExtra(Intent.EXTRA_EMAIL, new String[]{"frmichetti@gmail.com"});

            i.putExtra(Intent.EXTRA_SUBJECT, getString(R.string.app_name));

            i.putExtra(Intent.EXTRA_TEXT, "Contato App Workix");

            try {

                startActivity(Intent.createChooser(i, getString(R.string.send_mail_to_developer)));

            } catch (android.content.ActivityNotFoundException ex) {

                Toast.makeText(context, getString(R.string.no_email_client_installed), Toast.LENGTH_SHORT).show();
            }

        }


        return true;
    }

    /**
     * For GPS Access
     *
     * @param context
     * @param activity
     */
    private void checkPermissions(Context context, Activity activity) {

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            if (ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACCESS_FINE_LOCATION)) {


            } else {

                ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 0);
            }

        } else {

            Toast.makeText(context, getString(R.string.permission_granted), Toast.LENGTH_LONG).show();

            permission = true;

        }


    }

    @Override
    public void onDrawerItemSelected(View view, int position) {

        displayView(position);

        fragmentId = position;

    }

    private void displayView(int position) {

        Fragment fragment = null;

        String title = getString(R.string.app_name);

        switch (position) {

            case 0:
                fragment = new JobsFragment();
                title = getString(R.string.title_jobs);
                break;
            case 1:
                fragment = new JobsFragment();
                title = getString(R.string.title_jobs);
                break;
            case 2:
                fragment = new JobsFragment();
                title = getString(R.string.title_jobs);
                break;

            case 3:
                fragment = new JobsFragment();
                title = getString(R.string.title_jobs);
                break;
            default:
                break;
        }

        if (fragment != null) {

            FragmentManager fragmentManager = getSupportFragmentManager();

            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

            fragmentTransaction.replace(R.id.container_body, fragment);

            fragmentTransaction.commit();

            actionBar.setSubtitle(title);
        }
    }


    @Override
    public void doCreateListeners() {
    }


    private void doSetFragment() {

        drawerFragment = (FragmentDrawer)
                getSupportFragmentManager().findFragmentById(R.id.fragment_navigation_drawer);

        drawerFragment.setUp(R.id.fragment_navigation_drawer,
                (DrawerLayout) findViewById(R.id.drawer_layout), toolbar);

        drawerFragment.setDrawerListener(this);

        // display the first navigation drawer view on app launch
        displayView(fragmentId);
    }

    @Override
    public void doCastComponents() {

        super.doCastComponents();

        imageView = findViewById(R.id.imageViewAccountImage);

        textView = findViewById(R.id.textViewTitle);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {

        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        switch (requestCode) {

            case 0: {

                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    Toast.makeText(context, getString(R.string.permission_accepted), Toast.LENGTH_LONG).show();

                    permission = true;

                } else {

                    Toast.makeText(context, getString(R.string.permission_not_accepted), Toast.LENGTH_LONG).show();

                    permission = false;

                }
                return;
            }
        }
    }

    @Override
    public void onNetworkConnectionChanged(boolean isConnected) {

        showSnack((CoordinatorLayout) findViewById(R.id.coordLayoutMain), isConnected);
    }

}


