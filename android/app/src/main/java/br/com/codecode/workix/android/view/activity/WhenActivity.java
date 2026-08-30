/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.view.activity;

import android.os.Bundle;

import br.com.codecode.workix.android.R;

public class WhenActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_when);

    }

    @Override
    public void doCastComponents() {

    }

    @Override
    public void doCreateListeners() {

    }

    @Override
    public void onNetworkConnectionChanged(boolean isConnected) {

    }
}
