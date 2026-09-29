package com.ruffcol.tienda.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CrearPedidoDTO {
    
    @NotNull(message = "Los detalles del pedido son obligatorios")
    @NotEmpty(message = "El pedido debe tener al menos un producto")
    @Valid
    private List<ItemPedidoDTO> items;
    
    public CrearPedidoDTO() {
    }
    
    public CrearPedidoDTO(List<ItemPedidoDTO> items) {
        this.items = items;
    }
    
    public List<ItemPedidoDTO> getItems() {
        return items;
    }
    
    public void setItems(List<ItemPedidoDTO> items) {
        this.items = items;
    }
}
