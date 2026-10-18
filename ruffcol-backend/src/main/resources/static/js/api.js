// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';

// Función auxiliar para hacer peticiones fetch públicas (sin autenticación)
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Añadir headers por defecto
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la petición');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en fetchAPI:', error);
        throw error;
    }
}

// Función auxiliar para hacer peticiones fetch autorizadas (con JWT)
async function fetchAutorizado(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Añadir headers por defecto
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    // Añadir token JWT si está disponible
    const token = localStorage.getItem('jwtToken');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, config);
        
        // Manejar errores de autenticación
        if (response.status === 401 || response.status === 403) {
            console.error('Error de autenticación:', response.status);
            logout();
            window.location.href = 'login.html';
            throw new Error('Sesión expirada o no autorizado');
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la petición');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en fetchAutorizado:', error);
        throw error;
    }
}

// Funciones de autenticación
async function registerCliente(nombre, username, email, password) {
    const data = {
        nombre,
        username,
        email,
        password,
    };

    return await fetchAPI('/auth/register-cliente', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function login(username, password) {
    const data = {
        username,
        password,
    };

    const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    // Guardar información de autenticación con JWT
    localStorage.setItem('jwtToken', response.token);
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('userRole', response.rol);
    localStorage.setItem('userName', response.nombre);
    localStorage.setItem('userUsername', response.username);
    localStorage.setItem('userEmail', response.email);

    // Actualizar contador del carrito del usuario
    actualizarContadorCarrito();

    return response;
}

function logout() {
    // Limpiar carrito del usuario actual
    const carritoKey = getCarritoKey();
    localStorage.removeItem(carritoKey);

    // Limpiar datos de autenticación
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUsername');
    localStorage.removeItem('userEmail');

    window.location.href = 'index.html';
}

function isAuthenticated() {
    return localStorage.getItem('jwtToken') !== null;
}

function getUserRole() {
    return localStorage.getItem('userRole');
}

function getUserId() {
    return localStorage.getItem('userId');
}

// Funciones de categorías
async function getCategorias() {
    return await fetchAPI('/categorias');
}

async function getCategoria(id) {
    return await fetchAPI(`/categorias/${id}`);
}

async function createCategoria(categoriaData) {
    return await fetchAutorizado('/categorias', {
        method: 'POST',
        body: JSON.stringify(categoriaData),
    });
}

async function updateCategoria(id, categoriaData) {
    return await fetchAutorizado(`/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoriaData),
    });
}

async function deleteCategoria(id) {
    return await fetchAutorizado(`/categorias/${id}`, {
        method: 'DELETE',
    });
}

// Funciones de productos
async function getProductos() {
    return await fetchAPI('/productos');
}

async function getProducto(id) {
    return await fetchAPI(`/productos/${id}`);
}

async function getProductosByCategoria(categoriaId) {
    return await fetchAPI(`/productos/categoria/${categoriaId}`);
}

async function createProducto(productoData) {
    return await fetchAutorizado('/productos', {
        method: 'POST',
        body: JSON.stringify(productoData),
    });
}

async function updateProducto(id, productoData) {
    return await fetchAutorizado(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productoData),
    });
}

async function deleteProducto(id) {
    return await fetchAutorizado(`/productos/${id}`, {
        method: 'DELETE',
    });
}

// Funciones de pedidos
async function createPedido(items) {
    const data = {
        items: items,
    };

    const url = `${API_BASE_URL}/pedidos`;
    const token = localStorage.getItem('jwtToken');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
}

async function getMisPedidos() {
    return await fetchAutorizado('/pedidos/mis-pedidos');
}

async function getPedidos() {
    return await fetchAutorizado('/pedidos');
}

async function getPedido(id) {
    return await fetchAutorizado(`/pedidos/${id}`);
}

async function updatePedidoEstado(id, estado) {
    return await fetchAutorizado(`/pedidos/${id}/estado?estado=${estado}`, {
        method: 'PUT',
    });
}

async function deletePedido(id) {
    return await fetchAutorizado(`/pedidos/${id}`, {
        method: 'DELETE',
    });
}

// Funciones de super admin
async function crearAdministrador(adminData) {
    return await fetchAutorizado('/superadmin/crear-admin', {
        method: 'POST',
        body: JSON.stringify(adminData),
    });
}

async function obtenerAdministradores() {
    return await fetchAutorizado('/superadmin/administradores');
}

// Función para verificar autenticación y redirigir si es necesario
function requireAuth() {
    if (!isAuthenticated()) {
        // Guardar la URL actual para redirigir después del login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Función para verificar rol específico
function requireRole(rolRequerido) {
    if (!isAuthenticated()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return false;
    }
    
    const rolActual = getUserRole();
    if (rolActual !== rolRequerido && rolActual !== 'SUPER_ADMIN') {
        alert('No tienes permisos para acceder a esta sección');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Función para redirigir después del login
function redirectAfterLogin() {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
    } else {
        window.location.href = 'index.html';
    }
}

// Funciones de utilidad para el carrito
function getCarritoKey() {
    const userId = localStorage.getItem('userId');
    return userId ? `carrito_${userId}` : 'carrito_guest';
}

function getCarrito() {
    const carritoKey = getCarritoKey();
    const carrito = localStorage.getItem(carritoKey);
    return carrito ? JSON.parse(carrito) : [];
}

function saveCarrito(carrito) {
    const carritoKey = getCarritoKey();
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
}

function agregarAlCarrito(producto, cantidad = 1) {
    const carrito = getCarrito();

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.productoId === producto.id);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            imagen: producto.imagen,
        });
    }

    saveCarrito(carrito);
    actualizarContadorCarrito();
}

function eliminarDelCarrito(productoId) {
    let carrito = getCarrito();
    carrito = carrito.filter(item => item.productoId !== productoId);
    saveCarrito(carrito);
    actualizarContadorCarrito();
}

function actualizarCantidadCarrito(productoId, nuevaCantidad) {
    const carrito = getCarrito();
    const item = carrito.find(item => item.productoId === productoId);
    
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            item.cantidad = nuevaCantidad;
            saveCarrito(carrito);
        }
    }
}

function vaciarCarrito() {
    const carritoKey = getCarritoKey();
    localStorage.removeItem(carritoKey);
    actualizarContadorCarrito();
}

function clearCarrito() {
    const carritoKey = getCarritoKey();
    localStorage.removeItem(carritoKey);
    actualizarContadorCarrito();
}

function calcularTotalCarrito() {
    const carrito = getCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function actualizarContadorCarrito() {
    const carrito = getCarrito();
    const contador = carrito.reduce((total, item) => total + item.cantidad, 0);
    const contadorElement = document.getElementById('carrito-contador');
    
    if (contadorElement) {
        contadorElement.textContent = contador;
        contadorElement.style.display = contador > 0 ? 'inline' : 'none';
    }
}

// Inicializar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Si hay usuario autenticado, cargar su carrito
    if (isAuthenticated()) {
        actualizarContadorCarrito();
    } else {
        // Si no hay usuario, limpiar el contador
        const contadorElement = document.getElementById('carrito-contador');
        if (contadorElement) {
            contadorElement.style.display = 'none';
        }
    }
});
