package com.ruffcol.tienda.dto;

import com.ruffcol.tienda.modelo.EstadoCuenta;
import com.ruffcol.tienda.modelo.Rol;

import java.time.LocalDateTime;

public class UsuarioDTO {
    
    private Integer id;
    private String nombre;
    private String email;
    private Rol rol;
    private EstadoCuenta estadoCuenta;
    private LocalDateTime fechaRegistro;
    
    public UsuarioDTO() {
    }
    
    public UsuarioDTO(Integer id, String nombre, String email, Rol rol, EstadoCuenta estadoCuenta, LocalDateTime fechaRegistro) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.estadoCuenta = estadoCuenta;
        this.fechaRegistro = fechaRegistro;
    }
    
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
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
    
    public Rol getRol() {
        return rol;
    }
    
    public void setRol(Rol rol) {
        this.rol = rol;
    }
    
    public EstadoCuenta getEstadoCuenta() {
        return estadoCuenta;
    }
    
    public void setEstadoCuenta(EstadoCuenta estadoCuenta) {
        this.estadoCuenta = estadoCuenta;
    }
    
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}
