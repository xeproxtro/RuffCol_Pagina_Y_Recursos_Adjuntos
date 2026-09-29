package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.AuthDTO;
import com.ruffcol.tienda.dto.RegistroClienteDTO;
import com.ruffcol.tienda.dto.UsuarioDTO;
import com.ruffcol.tienda.exception.BadRequestException;
import com.ruffcol.tienda.exception.ResourceNotFoundException;
import com.ruffcol.tienda.exception.UnauthorizedException;
import com.ruffcol.tienda.modelo.EstadoCuenta;
import com.ruffcol.tienda.modelo.Rol;
import com.ruffcol.tienda.modelo.Usuario;
import com.ruffcol.tienda.repositorio.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public UsuarioDTO registrarCliente(RegistroClienteDTO registroDTO) {
        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNombre(registroDTO.getNombre());
        usuario.setEmail(registroDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));
        usuario.setRol(Rol.CLIENTE);
        usuario.setEstadoCuenta(EstadoCuenta.ACTIVO);
        
        Usuario guardado = usuarioRepository.save(usuario);
        return convertirADTO(guardado);
    }
    
    @Override
    public UsuarioDTO crearAdministrador(RegistroClienteDTO registroDTO) {
        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNombre(registroDTO.getNombre());
        usuario.setEmail(registroDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));
        usuario.setRol(Rol.ADMIN);
        usuario.setEstadoCuenta(EstadoCuenta.ACTIVO);
        
        Usuario guardado = usuarioRepository.save(usuario);
        return convertirADTO(guardado);
    }
    
    @Override
    public Usuario autenticar(AuthDTO authDTO) {
        Usuario usuario = usuarioRepository.findByEmail(authDTO.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));
        
        if (!passwordEncoder.matches(authDTO.getPassword(), usuario.getPassword())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }
        
        if (usuario.getEstadoCuenta() != EstadoCuenta.ACTIVO) {
            throw new UnauthorizedException("La cuenta no está activa. Estado: " + usuario.getEstadoCuenta());
        }
        
        return usuario;
    }
    
    @Override
    public UsuarioDTO obtenerPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return convertirADTO(usuario);
    }
    
    @Override
    public UsuarioDTO obtenerPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario con email: " + email));
        return convertirADTO(usuario);
    }
    
    @Override
    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<UsuarioDTO> obtenerAdministradores() {
        return usuarioRepository.findByRol(Rol.ADMIN).stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public void eliminar(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", id);
        }
        usuarioRepository.deleteById(id);
    }
    
    @Override
    public UsuarioDTO convertirADTO(Usuario usuario) {
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getRol(),
            usuario.getEstadoCuenta(),
            usuario.getFechaRegistro()
        );
    }
}
