package br.com.codecode.workix.core.interfaces;


/**
 * Markup Interface for Traceable Entities
 * 
 * @author felipe
 * @since 1.0
 * @version 1.0
 */
public interface Traceable {

    /**
     * Must Be Called on JPA {@link PrePersist} Event
     */

    /*

    default void prepareToPersist() {
	insertTimeStamp();
	generateUUID();
    }
    */

    /**
     * Insert Time Stamp
     */
    void insertTimeStamp();

    /**
     * Generate UUID
     */
    void generateUUID();

    /**
     * Must be Called on JPA {@link PreUpdate} Event
     */
    void updateTimeStamp();

}
