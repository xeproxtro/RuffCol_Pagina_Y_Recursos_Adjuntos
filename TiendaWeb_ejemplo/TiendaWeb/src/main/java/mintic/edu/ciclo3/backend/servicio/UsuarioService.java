package mintic.edu.ciclo3.backend.servicio;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import mintic.edu.ciclo3.backend.modelo.LoginDto;
import mintic.edu.ciclo3.backend.modelo.Tipodocumento;
import mintic.edu.ciclo3.backend.modelo.Usuario;
import mintic.edu.ciclo3.backend.modelo.UsuarioDto;
import mintic.edu.ciclo3.backend.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuarioService implements IUsuarioService{

    @Autowired
    UsuarioRepositorio usuarioRepositorio;
    
    @Override
    public List<Usuario> getUsuarios() {
        return usuarioRepositorio.findAll();
    }

    @Override
    public Usuario nuevoUsuario(UsuarioDto usuarioDto) {

        Usuario usuario = new Usuario();
        Tipodocumento td = new Tipodocumento();
        td.setId_tipodocumento(usuarioDto.getIdTipoDocumento());

        if (usuarioDto.getId() != null) {
            usuario.setId(usuarioDto.getId());
        }

        usuario.setIdTipoDocumento(td);
        usuario.setNumeroDocumento(usuarioDto.getNumeroDocumento());
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setNombreUsuario(usuarioDto.getNombreUsuario());
        usuario.setPassword(usuarioDto.getPassword());
        usuario.setEmail(usuarioDto.getEmail());
        return usuarioRepositorio.save(usuario);
    }

    @Override
    public Usuario buscarUsuario(Long id) {
        Usuario usuario = null;
        usuario = usuarioRepositorio.findById(id).orElse(null);
        if (usuario == null) {
            return null;
        }
        return usuario;
    }

    @Override
    public int borrarUsuario(Long id) {
        usuarioRepositorio.deleteById(id);
        return 1;
    }
    
    @Override
    public int login(LoginDto usuarioDto) {
        int u = usuarioRepositorio.findByNombreUsuarioAndPassword(usuarioDto.getNombreUsuario(), usuarioDto.getPassword());
        return u;
    }

    @Override
    public ResponseEntity<?> ingresar(LoginDto usuarioDto) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuario = null;
        try {
            usuario = usuarioRepositorio.findByNameAndPassword(usuarioDto.getNombreUsuario(), usuarioDto.getPassword());
            if (usuario == null) {
                response.put("Usuario", null);
                response.put("Mensaje", "Alerta:Usuario o Password incorrectos");
                response.put("statusCode", HttpStatus.NOT_FOUND.value());
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            } else {
                response.put("Usuario", usuario);
                response.put("Mensaje", "Datos correctos");
                response.put("statusCode", HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        } catch (Exception e) {
            response.put("Usuario", null);
            response.put("Mensaje", "Ha ocurrido un error");
            response.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
