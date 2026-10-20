package mintic.edu.ciclo3.backend.controlador;

import java.util.List;
import mintic.edu.ciclo3.backend.modelo.Proveedor;
import mintic.edu.ciclo3.backend.servicio.ProveedorService;
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
@RequestMapping("/api/proveedor")
public class ProveedorController {
    
    @Autowired
    ProveedorService proveedorService;
    
    // Listar los usuarios
    @GetMapping("/list")
    public List<Proveedor> cargarProveedores(){
        return proveedorService.getProveedores();
    }

    @GetMapping("/list/{id}")
    public Proveedor buscarPorId(@PathVariable Integer id) {
        return proveedorService.buscarProveedor(id);
    }

    // Agregar un Proveedor
    @PostMapping("/")
    public Proveedor agregar(@RequestBody Proveedor proveedor) {
        return proveedorService.nuevoProveedor(proveedor);
    }
    
    // Actualizar un proveedor
    @PutMapping("/")
    public Proveedor actualizar(@RequestBody Proveedor proveedor) {
        return proveedorService.nuevoProveedor(proveedor);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Proveedor> eliminar(@PathVariable Integer id) {
    	Proveedor obj = proveedorService.buscarProveedor(id);
    	if(obj != null) {
        	proveedorService.borrarProveedor(id);
    	}else {
    		return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
		return new ResponseEntity<>(obj,HttpStatus.OK);
    }

}
