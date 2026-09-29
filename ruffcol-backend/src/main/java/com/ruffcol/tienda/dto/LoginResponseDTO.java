package com.ruffcol.tienda.dto;

public class LoginResponseDTO {
    
    private String token;
    private String tipo = "Bearer";
    private Integer userId;
    private String nombre;
    private String email;
    private String rol;
    
    public LoginResponseDTO() {
    }
    
    public LoginResponseDTO(String token, Integer userId, String nombre, String email, String rol) {
        this.token = token;
        this.userId = userId;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRol() {
        return rol;
    }
    
    public void setRol(String rol) {
        this.rol = rol;
    }
}
