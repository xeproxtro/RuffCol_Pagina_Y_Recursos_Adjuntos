package com.ruffcol.tienda.controlador;

import com.ruffcol.tienda.dto.RegistroClienteDTO;
import com.ruffcol.tienda.dto.UsuarioDTO;
import com.ruffcol.tienda.servicio.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin")
@Tag(name = "Super Admin", description = "Endpoints exclusivos para Super Administradores")
public class SuperAdminController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/crear-admin")
    @Operation(summary = "Crear administrador directamente", description = "Crea un nuevo administrador con estado ACTIVO (Solo SUPER_ADMIN)")
    public ResponseEntity<UsuarioDTO> crearAdministrador(@Valid @RequestBody RegistroClienteDTO registroDTO) {
        UsuarioDTO usuarioDTO = usuarioService.crearAdministrador(registroDTO);
        return new ResponseEntity<>(usuarioDTO, HttpStatus.CREATED);
    }
    
    @GetMapping("/administradores")
    @Operation(summary = "Obtener administradores activos", description = "Lista todos los administradores con estado ACTIVO")
    public ResponseEntity<List<UsuarioDTO>> obtenerAdministradores() {
        List<UsuarioDTO> administradores = usuarioService.obtenerAdministradores();
        return ResponseEntity.ok(administradores);
    }
}
