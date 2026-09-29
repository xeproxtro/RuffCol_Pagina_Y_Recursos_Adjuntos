package com.ruffcol.tienda.controlador;

import com.ruffcol.tienda.dto.CategoriaDTO;
import com.ruffcol.tienda.servicio.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "CRUD de categorías de productos")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;
    
    @GetMapping
    @Operation(summary = "Obtener todas las categorías", description = "Lista todas las categorías disponibles")
    public ResponseEntity<List<CategoriaDTO>> obtenerTodos() {
        List<CategoriaDTO> categorias = categoriaService.obtenerTodos();
        return ResponseEntity.ok(categorias);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID", description = "Obtiene una categoría específica por su ID")
    public ResponseEntity<CategoriaDTO> obtenerPorId(@PathVariable Integer id) {
        CategoriaDTO categoria = categoriaService.obtenerPorId(id);
        return ResponseEntity.ok(categoria);
    }
    
    @PostMapping
    @Operation(summary = "Crear nueva categoría", description = "Crea una nueva categoría (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<CategoriaDTO> crear(@Valid @RequestBody CategoriaDTO categoriaDTO) {
        CategoriaDTO categoria = categoriaService.crear(categoriaDTO);
        return new ResponseEntity<>(categoria, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoría", description = "Actualiza una categoría existente (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<CategoriaDTO> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CategoriaDTO categoriaDTO) {
        CategoriaDTO categoria = categoriaService.actualizar(id, categoriaDTO);
        return ResponseEntity.ok(categoria);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar categoría", description = "Elimina una categoría (Requiere rol ADMIN o SUPER_ADMIN)")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
