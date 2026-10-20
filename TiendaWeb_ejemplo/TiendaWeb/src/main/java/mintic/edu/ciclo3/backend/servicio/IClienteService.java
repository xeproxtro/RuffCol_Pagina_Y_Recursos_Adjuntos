/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package mintic.edu.ciclo3.backend.servicio;

import java.util.List;
import mintic.edu.ciclo3.backend.modelo.Cliente;

/**
 *
 * @author Usuario
 */
public interface IClienteService {
    
    //Listar todos los Clientes
    List<Cliente> getClientes();

    // Buscar cliente por id
    public Cliente getCliente(Long id);
    
    // Guardar un cliente
    public Cliente grabarCliente(Cliente cliente);
    
    // Eliminar un cliente
    public void delete(Long id);
    
    
}
