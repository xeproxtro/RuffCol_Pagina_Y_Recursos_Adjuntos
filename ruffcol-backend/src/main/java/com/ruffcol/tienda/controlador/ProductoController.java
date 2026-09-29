package com.ruffcol.tienda.controlador;

import com.ruffcol.tienda.dto.ProductoDTO;
import com.ruffcol.tienda.servicio.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "CRUD de productos con soporte de imágenes")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    @Operation(summary = "Obtener todos los productos", description = "Lista todos los productos disponibles")
    public ResponseEntity<List<ProductoDTO>> obtenerTodos() {
        List<ProductoDTO> productos = productoService.obtenerTodos();
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID", description = "Obtiene un producto específico por su ID")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Integer id) {
        ProductoDTO producto = productoService.obtenerPorId(id);
        return ResponseEntity.ok(producto);
    }
    
    @GetMapping("/categoria/{idCategoria}")
    @Operation(summary = "Obtener productos por categoría", description = "Lista todos los productos de una categoría específica")
    public ResponseEntity<List<ProductoDTO>> obtenerPorCategoria(@PathVariable Integer idCategoria) {
        List<ProductoDTO> productos = productoService.obtenerPorCategoria(idCategoria);
        return ResponseEntity.ok(productos);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Crear nuevo producto con imagen", description = "Crea un nuevo producto con imagen (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<ProductoDTO> crearConImagen(
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("precio") java.math.BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen,
            HttpServletRequest request) {
        
        ProductoDTO producto = productoService.crearConImagen(nombre, descripcion, precio, stock, categoriaId, imagen);
        return new ResponseEntity<>(producto, HttpStatus.CREATED);
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo producto sin imagen", description = "Crea un nuevo producto sin imagen (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody ProductoDTO productoDTO) {
        ProductoDTO producto = productoService.crear(productoDTO);
        return new ResponseEntity<>(producto, HttpStatus.CREATED);
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Actualizar producto con imagen", description = "Actualiza un producto existente con imagen (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<ProductoDTO> actualizarConImagen(
            @PathVariable Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("precio") java.math.BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        
        ProductoDTO producto = productoService.actualizarConImagen(id, nombre, descripcion, precio, stock, categoriaId, imagen);
        return ResponseEntity.ok(producto);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto sin imagen", description = "Actualiza un producto existente sin imagen (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<ProductoDTO> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProductoDTO productoDTO) {
        ProductoDTO producto = productoService.actualizar(id, productoDTO);
        return ResponseEntity.ok(producto);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto", description = "Elimina un producto (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
