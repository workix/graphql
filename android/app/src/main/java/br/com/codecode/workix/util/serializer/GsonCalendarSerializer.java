package br.com.codecode.workix.util.serializer;

import java.lang.reflect.Type;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class GsonCalendarSerializer implements JsonSerializer<Calendar> {

    @Override
    public JsonElement serialize(Calendar cal, Type typeOfSrc, JsonSerializationContext context) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSZ");
        return new JsonPrimitive(df.format(cal.getTimeInMillis()));
    }

}
