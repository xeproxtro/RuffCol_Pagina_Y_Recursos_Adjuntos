package com.ruffcol.tienda.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(max = 50, message = "El nombre de usuario no puede exceder 50 caracteres")
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Email(message = "El email debe ser válido")
    @Column(length = 100)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Column(nullable = false, length = 255)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCuenta estadoCuenta;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    // Constructor vacío para JPA
    public Usuario() {
        this.fechaRegistro = LocalDateTime.now();
    }
    
    // Constructor con campos
    public Usuario(String nombre, String username, String email, String password, Rol rol, EstadoCuenta estadoCuenta) {
        this();
        this.nombre = nombre;
        this.username = username;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.estadoCuenta = estadoCuenta;
    }
    
    // Getters y Setters
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
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
