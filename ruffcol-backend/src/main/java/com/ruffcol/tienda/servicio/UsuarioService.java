package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.AuthDTO;
import com.ruffcol.tienda.dto.RegistroClienteDTO;
import com.ruffcol.tienda.dto.UsuarioDTO;
import com.ruffcol.tienda.modelo.Usuario;

import java.util.List;

public interface UsuarioService {
    
    UsuarioDTO registrarCliente(RegistroClienteDTO registroDTO);
    
    Usuario autenticar(AuthDTO authDTO);
    
    UsuarioDTO obtenerPorId(Integer id);
    
    UsuarioDTO obtenerPorEmail(String email);
    
    List<UsuarioDTO> obtenerTodos();
    
    List<UsuarioDTO> obtenerAdministradores();
    
    UsuarioDTO crearAdministrador(RegistroClienteDTO registroDTO);
    
    void eliminar(Integer id);
    
    UsuarioDTO convertirADTO(Usuario usuario);
}
