package mintic.edu.ciclo3.backend.servicio;

import java.util.List;
import mintic.edu.ciclo3.backend.modelo.Proveedor;


public interface IProveedorService {

    // Listar los Proveedores
    List<Proveedor> getProveedores();

    // Crear y Grabar un proveedor
    Proveedor nuevoProveedor(Proveedor proveedor);

    // Buscar un proveedor por el id
    Proveedor buscarProveedor(Integer id);
    
    // Eliminar un Proveedor
    void borrarProveedor(Integer id);
    
}
