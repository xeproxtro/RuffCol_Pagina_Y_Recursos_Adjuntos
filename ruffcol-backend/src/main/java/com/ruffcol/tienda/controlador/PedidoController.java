package com.ruffcol.tienda.controlador;

import com.ruffcol.tienda.dto.CrearPedidoDTO;
import com.ruffcol.tienda.dto.PedidoDTO;
import com.ruffcol.tienda.servicio.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos", description = "Gestión de pedidos de clientes")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    @PostMapping
    @Operation(summary = "Crear nuevo pedido", description = "Crea un nuevo pedido con los items del carrito (Requiere autenticación)")
    public ResponseEntity<PedidoDTO> crearPedido(
            @Valid @RequestBody CrearPedidoDTO crearPedidoDTO,
            HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        PedidoDTO pedido = pedidoService.crearPedido(crearPedidoDTO, userId);
        return new ResponseEntity<>(pedido, HttpStatus.CREATED);
    }
    
    @GetMapping("/mis-pedidos")
    @Operation(summary = "Obtener mis pedidos", description = "Lista todos los pedidos del usuario autenticado")
    public ResponseEntity<List<PedidoDTO>> obtenerMisPedidos(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        List<PedidoDTO> pedidos = pedidoService.obtenerPorUsuario(userId);
        return ResponseEntity.ok(pedidos);
    }
    
    @GetMapping
    @Operation(summary = "Obtener todos los pedidos", description = "Lista todos los pedidos del sistema (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<List<PedidoDTO>> obtenerTodos() {
        List<PedidoDTO> pedidos = pedidoService.obtenerTodos();
        return ResponseEntity.ok(pedidos);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener pedido por ID", description = "Obtiene un pedido específico por su ID")
    public ResponseEntity<PedidoDTO> obtenerPorId(@PathVariable Integer id) {
        PedidoDTO pedido = pedidoService.obtenerPorId(id);
        return ResponseEntity.ok(pedido);
    }
    
    @PutMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado del pedido", description = "Actualiza el estado de un pedido (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<PedidoDTO> actualizarEstado(
            @PathVariable Integer id,
            @RequestParam String estado) {
        PedidoDTO pedido = pedidoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(pedido);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar pedido", description = "Elimina un pedido (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        pedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
