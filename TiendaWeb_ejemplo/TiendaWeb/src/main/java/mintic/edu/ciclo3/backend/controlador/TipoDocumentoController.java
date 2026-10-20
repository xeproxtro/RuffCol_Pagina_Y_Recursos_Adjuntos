package mintic.edu.ciclo3.backend.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mintic.edu.ciclo3.backend.modelo.Tipodocumento;
import mintic.edu.ciclo3.backend.repositorio.TipodocumentoRepositorio;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/tipodocumento")
public class TipoDocumentoController {
	
    @Autowired
    private TipodocumentoRepositorio tipoDocumento;	
    
    // Listar los Tipos de Documento
    @GetMapping("/list")
    public List<Tipodocumento> cargarTipo(){
        return tipoDocumento.findAll();
    }

}
