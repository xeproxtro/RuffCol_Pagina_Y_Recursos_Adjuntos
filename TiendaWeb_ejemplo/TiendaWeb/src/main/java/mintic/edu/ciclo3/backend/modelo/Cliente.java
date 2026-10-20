/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package mintic.edu.ciclo3.backend.modelo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author Usuario
 */
@Entity
@Table(name = Cliente.TABLE_NAME)
public class Cliente {
    
    public static final String TABLE_NAME = "cliente";

    /*
	 * @id para identificar la llave primaria
	 * @@GeneratedValue(strategy = GenerationType.IDENTITY)
         se define el autoincremental	
	 * */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*@ManyToOne  hace referencia la relacion muchos a uno en este caso 
    muchos usuario tienen un tipo de documento
   * @JoinColumn  el campo que hace de referecia a la llave foranea
	 * */
    @ManyToOne
    @JoinColumn(name = "idTipoDocumento")
    private Tipodocumento idTipoDocumento;;

    /*@Column nombre de la columna , si el nombre en la base de datos del
    campo es igual a el de la variable no es necesario poner la anotacion
	 * */
    @Column(name = "numeroDocumento")
    private String numeroDocumento;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "email")
    private String email;

    public Cliente() {
    }

    public Cliente(Long id, Tipodocumento idTipoDocumento, String numeroDocumento, String nombre, String direccion, String telefono, String email) {
        this.id = id;
        this.idTipoDocumento = idTipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tipodocumento getIdTipoDocumento() {
        return idTipoDocumento;
    }

    public void setIdTipoDocumento(Tipodocumento idTipoDocumento) {
        this.idTipoDocumento = idTipoDocumento;
    }


    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    
}
