
package mintic.edu.ciclo3.backend.repositorio;


import mintic.edu.ciclo3.backend.modelo.Tipodocumento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipodocumentoRepositorio extends JpaRepository<Tipodocumento, Long>{
    
}
