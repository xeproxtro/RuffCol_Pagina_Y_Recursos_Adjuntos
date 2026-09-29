package com.ruffcol.tienda.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, Object fieldValue) {
        super(String.format("%s no encontrado con valor: %s", resourceName, fieldValue));
    }
}
