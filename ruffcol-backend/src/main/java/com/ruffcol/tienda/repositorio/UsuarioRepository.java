package com.ruffcol.tienda.repositorio;

import com.ruffcol.tienda.modelo.Usuario;
import com.ruffcol.tienda.modelo.EstadoCuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<Usuario> findByEstadoCuenta(EstadoCuenta estadoCuenta);
    
    List<Usuario> findByRol(com.ruffcol.tienda.modelo.Rol rol);
}
