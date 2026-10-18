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
import java.util.Base64;
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
        
        // Convertir base64 a bytes si existe imagen
        if (productoDTO.getImagen() != null && !productoDTO.getImagen().isEmpty()) {
            producto.setImagen(Base64.getDecoder().decode(productoDTO.getImagen()));
        }
        
        producto.setCategoria(categoria);

        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }
    
    @Override
    public ProductoDTO crearConImagen(String nombre, String descripcion, BigDecimal precio, Integer stock, Integer categoriaId, MultipartFile imagen) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", categoriaId));

        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);

        // Convertir MultipartFile a bytes (BLOB)
        if (imagen != null && !imagen.isEmpty()) {
            try {
                producto.setImagen(imagen.getBytes());
            } catch (Exception e) {
                throw new BadRequestException("Error al procesar la imagen: " + e.getMessage());
            }
        }

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

        // Actualizar imagen si se proporciona una nueva
        if (imagen != null && !imagen.isEmpty()) {
            try {
                producto.setImagen(imagen.getBytes());
            } catch (Exception e) {
                throw new BadRequestException("Error al procesar la imagen: " + e.getMessage());
            }
        }

        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
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

        // Actualizar imagen si se proporciona
        if (productoDTO.getImagen() != null && !productoDTO.getImagen().isEmpty()) {
            producto.setImagen(Base64.getDecoder().decode(productoDTO.getImagen()));
        }

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
        String imagenBase64 = null;
        if (producto.getImagen() != null && producto.getImagen().length > 0) {
            imagenBase64 = Base64.getEncoder().encodeToString(producto.getImagen());
        }

        return new ProductoDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getStock(),
            imagenBase64,
            producto.getCategoria().getId(),
            producto.getCategoria().getNombre()
        );
    }
}
