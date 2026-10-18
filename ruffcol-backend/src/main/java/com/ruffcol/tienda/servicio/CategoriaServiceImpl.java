package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.CategoriaDTO;
import com.ruffcol.tienda.exception.BadRequestException;
import com.ruffcol.tienda.exception.ResourceNotFoundException;
import com.ruffcol.tienda.modelo.Categoria;
import com.ruffcol.tienda.repositorio.CategoriaRepository;
import com.ruffcol.tienda.repositorio.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoriaServiceImpl implements CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;
    
    @Override
    public CategoriaDTO crear(CategoriaDTO categoriaDTO) {
        if (categoriaRepository.existsByNombre(categoriaDTO.getNombre())) {
            throw new BadRequestException("Ya existe una categoría con ese nombre");
        }
        
        Categoria categoria = new Categoria();
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());
        
        Categoria guardado = categoriaRepository.save(categoria);
        return convertirADTO(guardado);
    }
    
    @Override
    public CategoriaDTO obtenerPorId(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        return convertirADTO(categoria);
    }
    
    @Override
    public List<CategoriaDTO> obtenerTodos() {
        return categoriaRepository.findAll().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public CategoriaDTO actualizar(Integer id, CategoriaDTO categoriaDTO) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        
        if (!categoria.getNombre().equals(categoriaDTO.getNombre()) && 
            categoriaRepository.existsByNombre(categoriaDTO.getNombre())) {
            throw new BadRequestException("Ya existe una categoría con ese nombre");
        }
        
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());
        
        Categoria actualizado = categoriaRepository.save(categoria);
        return convertirADTO(actualizado);
    }
    
    @Override
    public void eliminar(Integer id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría", id);
        }

        // Verificar si hay productos asociados a esta categoría
        List<?> productos = productoRepository.findByCategoriaId(id);
        if (!productos.isEmpty()) {
            throw new BadRequestException("No se puede eliminar la categoría porque tiene productos asociados. Elimine o reasigne los productos primero.");
        }

        categoriaRepository.deleteById(id);
    }
    
    @Override
    public CategoriaDTO convertirADTO(Categoria categoria) {
        return new CategoriaDTO(
            categoria.getId(),
            categoria.getNombre(),
            categoria.getDescripcion()
        );
    }
}
