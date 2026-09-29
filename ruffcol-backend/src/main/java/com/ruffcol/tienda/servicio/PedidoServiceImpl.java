package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.CrearPedidoDTO;
import com.ruffcol.tienda.dto.DetallePedidoDTO;
import com.ruffcol.tienda.dto.ItemPedidoDTO;
import com.ruffcol.tienda.dto.PedidoDTO;
import com.ruffcol.tienda.exception.BadRequestException;
import com.ruffcol.tienda.exception.ResourceNotFoundException;
import com.ruffcol.tienda.modelo.*;
import com.ruffcol.tienda.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PedidoServiceImpl implements PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private DetallePedidoRepository detallePedidoRepository;
    
    @Override
    public PedidoDTO crearPedido(CrearPedidoDTO crearPedidoDTO, Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));
        
        Pedido pedido = new Pedido(usuario);
        
        for (ItemPedidoDTO item : crearPedidoDTO.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", item.getProductoId()));
            
            if (producto.getStock() < item.getCantidad()) {
                throw new BadRequestException("Stock insuficiente para el producto: " + producto.getNombre());
            }
            
            DetallePedido detalle = new DetallePedido();
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setProducto(producto);
            detalle.setPedido(pedido);
            
            pedido.addDetalle(detalle);
            
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);
        }
        
        pedido.actualizarTotal();
        Pedido guardado = pedidoRepository.save(pedido);
        
        return convertirADTO(guardado);
    }
    
    @Override
    public PedidoDTO obtenerPorId(Integer id) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
        return convertirADTO(pedido);
    }
    
    @Override
    public List<PedidoDTO> obtenerTodos() {
        return pedidoRepository.findAll().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<PedidoDTO> obtenerPorUsuario(Integer usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId).stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public PedidoDTO actualizarEstado(Integer id, String estado) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
        
        try {
            EstadoPedido nuevoEstado = EstadoPedido.valueOf(estado.toUpperCase());
            pedido.setEstado(nuevoEstado);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Estado de pedido inválido. Valores válidos: PENDIENTE, EN_CONFECCION, ENVIADO, ENTREGADO");
        }
        
        Pedido actualizado = pedidoRepository.save(pedido);
        return convertirADTO(actualizado);
    }
    
    @Override
    public void eliminar(Integer id) {
        if (!pedidoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pedido", id);
        }
        pedidoRepository.deleteById(id);
    }
    
    @Override
    public PedidoDTO convertirADTO(Pedido pedido) {
        List<DetallePedidoDTO> detallesDTO = pedido.getDetalles().stream()
            .map(detalle -> new DetallePedidoDTO(
                detalle.getId(),
                detalle.getCantidad(),
                detalle.getPrecioUnitario(),
                detalle.getProducto().getId(),
                detalle.getProducto().getNombre()
            ))
            .collect(Collectors.toList());
        
        return new PedidoDTO(
            pedido.getId(),
            pedido.getFechaPedido(),
            pedido.getEstado(),
            pedido.getTotal(),
            pedido.getUsuario().getId(),
            pedido.getUsuario().getNombre(),
            detallesDTO
        );
    }
}
