package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.ProductoDTO;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProductoService {
    
    ProductoDTO crear(ProductoDTO productoDTO);
    
    ProductoDTO crearConImagen(String nombre, String descripcion, BigDecimal precio, Integer stock, Integer categoriaId, MultipartFile imagen);
    
    ProductoDTO actualizarConImagen(Integer id, String nombre, String descripcion, BigDecimal precio, Integer stock, Integer categoriaId, MultipartFile imagen);
    
    ProductoDTO obtenerPorId(Integer id);
    
    List<ProductoDTO> obtenerTodos();
    
    List<ProductoDTO> obtenerPorCategoria(Integer categoriaId);
    
    ProductoDTO actualizar(Integer id, ProductoDTO productoDTO);
    
    void eliminar(Integer id);
    
    ProductoDTO convertirADTO(com.ruffcol.tienda.modelo.Producto producto);
}
