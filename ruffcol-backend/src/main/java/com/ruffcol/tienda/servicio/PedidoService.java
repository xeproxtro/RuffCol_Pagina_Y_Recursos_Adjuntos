package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.CrearPedidoDTO;
import com.ruffcol.tienda.dto.PedidoDTO;

import java.util.List;

public interface PedidoService {
    
    PedidoDTO crearPedido(CrearPedidoDTO crearPedidoDTO, Integer usuarioId);
    
    PedidoDTO obtenerPorId(Integer id);
    
    List<PedidoDTO> obtenerTodos();
    
    List<PedidoDTO> obtenerPorUsuario(Integer usuarioId);
    
    PedidoDTO actualizarEstado(Integer id, String estado);
    
    void eliminar(Integer id);
    
    PedidoDTO convertirADTO(com.ruffcol.tienda.modelo.Pedido pedido);
}
