package mintic.edu.ciclo3.backend.servicio;

import java.util.List;
import mintic.edu.ciclo3.backend.modelo.LoginDto;
import mintic.edu.ciclo3.backend.modelo.Usuario;
import mintic.edu.ciclo3.backend.modelo.UsuarioDto;
import org.springframework.http.ResponseEntity;

public interface IUsuarioService {

    List<Usuario> getUsuarios();

    Usuario nuevoUsuario(UsuarioDto usuarioDto);

    Usuario buscarUsuario(Long id);

    int borrarUsuario(Long id);

    int login(LoginDto usuarioDto);

    ResponseEntity<?> ingresar(LoginDto usuarioDto);
    
}
