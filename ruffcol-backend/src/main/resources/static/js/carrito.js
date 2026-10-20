/**
 * carrito.js - Funciones para gestión del carrito de compras
 */

/**
 * Obtiene la clave del carrito según el usuario
 */
function getCarritoKey() {
    const userId = getUserId();
    return userId ? `carrito_${userId}` : 'carrito_guest';
}

/**
 * Obtiene el carrito del localStorage
 */
function getCarrito() {
    const carritoKey = getCarritoKey();
    const carrito = localStorage.getItem(carritoKey);
    return carrito ? JSON.parse(carrito) : [];
}

/**
 * Guarda el carrito en localStorage
 */
function saveCarrito(carrito) {
    const carritoKey = getCarritoKey();
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
}

/**
 * Agrega un producto al carrito
 */
function agregarAlCarrito(producto, cantidad = 1) {
    const carrito = getCarrito();

    const itemExistente = carrito.find(item => item.productoId === producto.id);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            imagen: producto.imagen
        });
    }

    saveCarrito(carrito);
    actualizarContadorCarrito();
}

/**
 * Elimina un producto del carrito
 */
function eliminarDelCarrito(productoId) {
    let carrito = getCarrito();
    carrito = carrito.filter(item => item.productoId !== productoId);
    saveCarrito(carrito);
    actualizarContadorCarrito();
}

/**
 * Actualiza la cantidad de un producto en el carrito
 */
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

/**
 * Vacía el carrito
 */
function clearCarrito() {
    const carritoKey = getCarritoKey();
    localStorage.removeItem(carritoKey);
    actualizarContadorCarrito();
}

/**
 * Calcula el total del carrito
 */
function calcularTotalCarrito() {
    const carrito = getCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

/**
 * Actualiza el contador del carrito en la UI
 */
function actualizarContadorCarrito() {
    const carrito = getCarrito();
    const contador = carrito.reduce((total, item) => total + item.cantidad, 0);
    const contadorElement = document.getElementById('carrito-contador');

    if (contadorElement) {
        contadorElement.textContent = contador;
        contadorElement.style.display = contador > 0 ? 'inline' : 'none';
    }
}

// Exportar funciones
window.getCarrito = getCarrito;
window.saveCarrito = saveCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.actualizarCantidadCarrito = actualizarCantidadCarrito;
window.clearCarrito = clearCarrito;
window.calcularTotalCarrito = calcularTotalCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;
