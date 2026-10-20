package mintic.edu.ciclo3.backend.controlador;

import java.util.List;
import mintic.edu.ciclo3.backend.modelo.LoginDto;
import mintic.edu.ciclo3.backend.modelo.Tipodocumento;
import mintic.edu.ciclo3.backend.modelo.Usuario;
import mintic.edu.ciclo3.backend.modelo.UsuarioDto;
import mintic.edu.ciclo3.backend.repositorio.TipodocumentoRepositorio;
import mintic.edu.ciclo3.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/usuarios")
public class UsuarioController {
    /*
	 * inyectamos el la iterface del servicio para acceder 
           a los metodos del negocio
	 **/
    @Autowired
    UsuarioService usuarioService;
    
    @Autowired
    TipodocumentoRepositorio tipoDocumento;
    
    // Listar los Tipos de Documento
    @GetMapping("/tipoDocumento")
    public List<Tipodocumento> cargarTipo(){
        return tipoDocumento.findAll();
    }
    // Listar los usuarios
    @GetMapping("/list")
    public List<Usuario> cargarUsuarios(){
        return usuarioService.getUsuarios();
    }
    
    // Buscar por Id
    @GetMapping("/list/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarUsuario(id);
    }
        
    // Agregar un Usuario
    @PostMapping("/")
    public Usuario agregar(@RequestBody UsuarioDto usuarioDto) {
        return usuarioService.nuevoUsuario(usuarioDto);
    }
    
    // Actualizar el Usuario
    @PutMapping("/")
    public Usuario editar(@RequestBody UsuarioDto usuarioDto) {
        return usuarioService.nuevoUsuario(usuarioDto);
    }
    
    // Eliminar el Usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> eliminar(@PathVariable Long id) {
    	Usuario obj = usuarioService.buscarUsuario(id);
    	if(obj != null) {
        	usuarioService.borrarUsuario(id);
    	}else {
    		return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
		return new ResponseEntity<>(obj,HttpStatus.OK);
    }

	/*
	 * @CrossOrigin indica desde que sitios se van a realizar peticiones
	 */
//	@CrossOrigin(origins = { "http://localhost:8010" })
	@PostMapping("/loginclient") // ruta del servicio desde el front deben direccionar a esta ruta
	public int login(@RequestBody LoginDto usuario) {
		int responseLogin = usuarioService.login(usuario);
		return responseLogin;
	}

	@PostMapping("/login") // ruta del servicio desde el front deben direccionar a esta ruta
	public ResponseEntity<?> loginCliente(@RequestBody LoginDto usuario) {
		return usuarioService.ingresar(usuario);
	}
    
}
