package com.ruffcol.tienda.controlador;

import com.ruffcol.tienda.config.JWTUtil;
import com.ruffcol.tienda.dto.AuthDTO;
import com.ruffcol.tienda.dto.LoginResponseDTO;
import com.ruffcol.tienda.dto.RegistroClienteDTO;
import com.ruffcol.tienda.dto.UsuarioDTO;
import com.ruffcol.tienda.modelo.Usuario;
import com.ruffcol.tienda.servicio.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints para registro y autenticación de usuarios")
public class AuthController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private JWTUtil jwtUtil;
    
    @PostMapping("/register-cliente")
    @Operation(summary = "Registrar nuevo cliente", description = "Registra un nuevo usuario con rol CLIENTE y estado ACTIVO")
    public ResponseEntity<UsuarioDTO> registrarCliente(@Valid @RequestBody RegistroClienteDTO registroDTO) {
        UsuarioDTO usuarioDTO = usuarioService.registrarCliente(registroDTO);
        return new ResponseEntity<>(usuarioDTO, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario con email y contraseña y retorna token JWT")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody AuthDTO authDTO) {
        Usuario usuario = usuarioService.autenticar(authDTO);
        
        // Generar token JWT
        String token = jwtUtil.generateToken(usuario.getId(), usuario.getEmail(), usuario.getRol().name());
        
        LoginResponseDTO response = new LoginResponseDTO(
            token,
            usuario.getId(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getRol().name()
        );
        
        return ResponseEntity.ok(response);
    }
}
