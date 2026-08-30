package br.com.codecode.workix.android.view.activity;


import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.NavigationView;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import br.com.codecode.workix.android.R;
import br.com.codecode.workix.android.view.fragment.FragmentDrawer;
import br.com.codecode.workix.android.view.fragment.JobsFragment;

public class NewMain extends BaseActivity
        implements NavigationView.OnNavigationItemSelectedListener, FragmentDrawer.FragmentDrawerListener {

    protected int fragmentId;

    private FloatingActionButton fab;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_new_main);

        doCastComponents();

        doCreateListeners();

        setupToolBar();

        Toolbar toolbar = findViewById(R.id.toolbar);

        setSupportActionBar(toolbar);

        toolbar.setTitle(getString(R.string.app_name));


        DrawerLayout drawer = findViewById(R.id.drawer_layout);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);

        drawer.setDrawerListener(toggle);

        toggle.syncState();

        NavigationView navigationView = findViewById(R.id.nav_view);

        navigationView.setNavigationItemSelectedListener(this);


    }

    @Override
    public void onBackPressed() {

        DrawerLayout drawer = findViewById(R.id.drawer_layout);

        if (drawer.isDrawerOpen(GravityCompat.START)) {

            drawer.closeDrawer(GravityCompat.START);

        } else {

            super.onBackPressed();
        }
    }


    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {

        switch (item.getItemId()) {

            case R.id.nav_jobs: {

                Toast.makeText(this, "Clicou em Jobs ", Toast.LENGTH_SHORT).show();

                displayView(0);
            }
            case R.id.nav_curriculum: {

            }
            case R.id.nav_selectiveProcesses: {

            }
            case R.id.nav_manage: {

            }
            case R.id.nav_share: {

            }
            case R.id.nav_bug: {

            }

        }

        DrawerLayout drawer = findViewById(R.id.drawer_layout);

        drawer.closeDrawer(GravityCompat.START);

        return true;
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


        }
    }

    @Override
    public void onDrawerItemSelected(View view, int position) {

        displayView(position);

        fragmentId = position;

    }

    @Override
    public void onNetworkConnectionChanged(boolean isConnected) {
        //  showSnack((CoordinatorLayout) findViewById(R.id.newMainCoordLayout), isConnected);
    }

    @Override
    public void doCreateListeners() {

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });
    }

    @Override
    public void doCastComponents() {

        super.doCastComponents();

        fab = findViewById(R.id.fab);
    }
}
