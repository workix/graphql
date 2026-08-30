/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.view.activity;

import android.app.Activity;
import android.content.Context;

/**
 * My Pattern Interface
 */
public interface MyPattern {

    /**
     * Cast Components From XML
     */
    void doCastComponents();

    /**
     * Create Listeners For Casted Components
     */
    void doCreateListeners();

    /**
     * Setup ToolBar
     */
    void setupToolBar();

    /**
     * Startup Configuration
     */
    void doConfigure();

    /**
     * Change Activity
     * @param context Context
     * @param clazz Class of Destiny Activity
     */
    void doChangeActivity(Context context, Class<? extends Activity> clazz);

}
