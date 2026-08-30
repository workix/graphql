
package br.com.codecode.workix.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import br.com.codecode.workix.util.deserializer.GsonCalendarDeserializer;
import br.com.codecode.workix.util.deserializer.GsonDateDeserializer;
import br.com.codecode.workix.util.serializer.GsonCalendarSerializer;
import br.com.codecode.workix.util.serializer.GsonDateSerializer;


/**
 * Gson Singleton Provider
 * 
 * @since 1.1
 * @version 1.0
 * @author felipe
 */
public class GsonProvider {

    private static GsonProvider instance;

    private GsonProvider(){}

    private static synchronized GsonProvider getInstance() {

	if (instance == null) {
	    instance = new GsonProvider();
	}

	return instance;
    }

    /**
     * Generate a Custom Gson <br>
     * <em> attempt for DateFormat</em>
     * 
     * @return a New Gson
     */
    public static Gson buildGson() {

	getInstance();

	return new GsonBuilder()

		.setPrettyPrinting()

		.setDateFormat(new SimpleDateFormat().toPattern())

		.enableComplexMapKeySerialization()
		
		.registerTypeAdapter(Date.class, new GsonDateSerializer())

		.registerTypeAdapter(Date.class, new GsonDateDeserializer())

		.registerTypeAdapter(Calendar.class, new GsonCalendarSerializer())
		
		.registerTypeAdapter(Calendar.class, new GsonCalendarDeserializer())

		.create();
    }

}
