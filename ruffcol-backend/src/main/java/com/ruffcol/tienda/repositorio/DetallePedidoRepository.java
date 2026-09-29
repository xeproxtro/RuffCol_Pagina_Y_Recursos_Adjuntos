package com.ruffcol.tienda.repositorio;

import com.ruffcol.tienda.modelo.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {
    
    List<DetallePedido> findByPedidoId(Integer pedidoId);
}
