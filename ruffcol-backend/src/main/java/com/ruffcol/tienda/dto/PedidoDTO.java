package com.ruffcol.tienda.dto;

import com.ruffcol.tienda.modelo.EstadoPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {
    
    private Integer id;
    private LocalDateTime fechaPedido;
    private EstadoPedido estado;
    private BigDecimal total;
    private Integer usuarioId;
    private String usuarioNombre;
    private List<DetallePedidoDTO> detalles;
    
    public PedidoDTO() {
    }
    
    public PedidoDTO(Integer id, LocalDateTime fechaPedido, EstadoPedido estado, BigDecimal total, Integer usuarioId, String usuarioNombre, List<DetallePedidoDTO> detalles) {
        this.id = id;
        this.fechaPedido = fechaPedido;
        this.estado = estado;
        this.total = total;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.detalles = detalles;
    }
    
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }
    
    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }
    
    public EstadoPedido getEstado() {
        return estado;
    }
    
    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public Integer getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public String getUsuarioNombre() {
        return usuarioNombre;
    }
    
    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }
    
    public List<DetallePedidoDTO> getDetalles() {
        return detalles;
    }
    
    public void setDetalles(List<DetallePedidoDTO> detalles) {
        this.detalles = detalles;
    }
}
