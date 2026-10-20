/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package mintic.edu.ciclo3.backend.controlador;

import java.util.List;
import mintic.edu.ciclo3.backend.modelo.Cliente;
import mintic.edu.ciclo3.backend.modelo.Tipodocumento;
import mintic.edu.ciclo3.backend.repositorio.TipodocumentoRepositorio;
import mintic.edu.ciclo3.backend.servicio.ClienteService;
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

/**
 *
 * @author Usuario
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;    

    @Autowired
    private TipodocumentoRepositorio tipoDocumento;
    
    // Listar los Tipos de Documento
    @GetMapping("/tipoDocumento")
    public List<Tipodocumento> cargarTipo(){
        return tipoDocumento.findAll();
    }
        
    @GetMapping("/list")
    public List<Cliente> consultarTodo(){
        return (clienteService.getClientes());
    }
    
    @GetMapping("/list/{id}")
    public Cliente buscarPorId(@PathVariable Long id){
        return clienteService.getCliente(id);
    }

    @PostMapping("/")
    public ResponseEntity<Cliente> agregar(@RequestBody Cliente cliente){
        Cliente obj = clienteService.grabarCliente(cliente);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PutMapping("/")
    public ResponseEntity<Cliente> editar(@RequestBody Cliente cliente){
        Cliente obj = clienteService.getCliente(cliente.getId());
        if(obj != null){
            obj.setDireccion(cliente.getDireccion());
            obj.setEmail(cliente.getEmail());
            obj.setIdTipoDocumento(cliente.getIdTipoDocumento());
            obj.setNumeroDocumento(cliente.getNumeroDocumento());
            obj.setNombre(cliente.getNombre());
            obj.setTelefono(cliente.getTelefono());
            clienteService.grabarCliente(obj);
        }else{
            return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Cliente> eliminar(@PathVariable Long id){
        Cliente obj = clienteService.getCliente(id);
        if(obj != null){
            clienteService.delete(id);
        }else{
            return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
    
}
