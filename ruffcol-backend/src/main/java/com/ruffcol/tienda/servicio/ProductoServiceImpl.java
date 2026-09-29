package com.ruffcol.tienda.servicio;

import com.ruffcol.tienda.dto.ProductoDTO;
import com.ruffcol.tienda.exception.BadRequestException;
import com.ruffcol.tienda.exception.ResourceNotFoundException;
import com.ruffcol.tienda.modelo.Categoria;
import com.ruffcol.tienda.modelo.Producto;
import com.ruffcol.tienda.repositorio.CategoriaRepository;
import com.ruffcol.tienda.repositorio.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Override
    public ProductoDTO crear(ProductoDTO productoDTO) {
        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", productoDTO.getCategoriaId()));
        
        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());
        producto.setImagenUrl(productoDTO.getImagenUrl());
        producto.setCategoria(categoria);
        
        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }
    
    @Override
    public ProductoDTO crearConImagen(String nombre, String descripcion, BigDecimal precio, Integer stock, Integer categoriaId, MultipartFile imagen) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", categoriaId));
        
        String imagenUrl = "";
        if (imagen != null && !imagen.isEmpty()) {
            imagenUrl = fileStorageService.storeFile(imagen);
        }
        
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setImagenUrl(imagenUrl);
        producto.setCategoria(categoria);
        
        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }
    
    @Override
    public ProductoDTO actualizarConImagen(Integer id, String nombre, String descripcion, BigDecimal precio, Integer stock, Integer categoriaId, MultipartFile imagen) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        
        Categoria categoria = categoriaRepository.findById(categoriaId)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", categoriaId));
        
        // Eliminar imagen anterior si se sube una nueva
        if (imagen != null && !imagen.isEmpty() && producto.getImagenUrl() != null) {
            fileStorageService.deleteFile(producto.getImagenUrl());
        }
        
        String imagenUrl = producto.getImagenUrl();
        if (imagen != null && !imagen.isEmpty()) {
            imagenUrl = fileStorageService.storeFile(imagen);
        }
        
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setImagenUrl(imagenUrl);
        producto.setCategoria(categoria);
        
        Producto actualizado = productoRepository.save(producto);
        return convertirADTO(actualizado);
    }
    
    @Override
    public ProductoDTO obtenerPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        return convertirADTO(producto);
    }
    
    @Override
    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductoDTO> obtenerPorCategoria(Integer categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId).stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public ProductoDTO actualizar(Integer id, ProductoDTO productoDTO) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        
        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", productoDTO.getCategoriaId()));
        
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());
        producto.setImagenUrl(productoDTO.getImagenUrl());
        producto.setCategoria(categoria);
        
        Producto actualizado = productoRepository.save(producto);
        return convertirADTO(actualizado);
    }
    
    @Override
    public void eliminar(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", id);
        }
        productoRepository.deleteById(id);
    }
    
    @Override
    public ProductoDTO convertirADTO(Producto producto) {
        return new ProductoDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getStock(),
            producto.getImagenUrl(),
            producto.getCategoria().getId(),
            producto.getCategoria().getNombre()
        );
    }
}
