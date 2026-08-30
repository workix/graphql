/**
 * @author Felipe Rodrigues Michetti

 * @see http://www.codecode.com.br
 * @see mailto:frmichetti@gmail.com
 */
package br.com.codecode.workix.android.tasks;

import android.support.annotation.NonNull;

public interface AsyncResponse<T> {

    void processFinish(@NonNull T output);
}
