package com.ruffcol.tienda.repositorio;

import com.ruffcol.tienda.modelo.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    
    List<Producto> findByCategoriaId(Integer categoriaId);
    
    @Query("SELECT p FROM Producto p WHERE p.categoria.id = :categoriaId AND p.stock > 0")
    List<Producto> findByCategoriaIdAndStockGreaterThanZero(@Param("categoriaId") Integer categoriaId);
    
    @Query("SELECT p FROM Producto p WHERE p.stock > 0")
    List<Producto> findByStockGreaterThanZero();
    
    @Query("SELECT p FROM Producto p WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Producto> buscarPorNombre(@Param("nombre") String nombre);
}
