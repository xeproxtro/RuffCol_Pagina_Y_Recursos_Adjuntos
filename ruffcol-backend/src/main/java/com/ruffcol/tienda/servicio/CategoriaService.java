package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.CategoriaDTO;

import java.util.List;

public interface CategoriaService {
    
    CategoriaDTO crear(CategoriaDTO categoriaDTO);
    
    CategoriaDTO obtenerPorId(Integer id);
    
    List<CategoriaDTO> obtenerTodos();
    
    CategoriaDTO actualizar(Integer id, CategoriaDTO categoriaDTO);
    
    void eliminar(Integer id);
    
    CategoriaDTO convertirADTO(com.ruffcol.tienda.modelo.Categoria categoria);
}
