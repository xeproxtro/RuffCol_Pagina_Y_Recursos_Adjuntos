package com.ruffcol.tienda.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class ProductoDTO {
    
    private Integer id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    private String descripcion;
    
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal precio;
    
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    private String imagen; // Base64 string
    
    private Integer categoriaId;
    private String categoriaNombre;
    
    public ProductoDTO() {
    }
    
    public ProductoDTO(Integer id, String nombre, String descripcion, BigDecimal precio, Integer stock, String imagen, Integer categoriaId, String categoriaNombre) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
        this.categoriaId = categoriaId;
        this.categoriaNombre = categoriaNombre;
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
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public BigDecimal getPrecio() {
        return precio;
    }
    
    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    public String getImagen() {
        return imagen;
    }
    
    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
    
    public Integer getCategoriaId() {
        return categoriaId;
    }
    
    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }
    
    public String getCategoriaNombre() {
        return categoriaNombre;
    }
    
    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }
}
