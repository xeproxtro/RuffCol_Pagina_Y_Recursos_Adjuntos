/**
 * request.js - Utilidad centralizada para peticiones HTTP usando XMLHttpRequest
 * API REST base: http://localhost:8094/
 */

const API_BASE_URL = 'http://localhost:8094';

/**
 * Realiza una petición HTTP usando XMLHttpRequest
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {string} endpoint - Endpoint de la API (ej: '/api/auth/login')
 * @param {object} data - Datos a enviar (opcional)
 * @param {string} token - Token JWT para autenticación (opcional)
 * @returns {Promise} Promise con la respuesta JSON
 */
function request(method, endpoint, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = API_BASE_URL + endpoint;

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';

        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                const error = xhr.response || { message: 'Error en la petición' };
                reject(new Error(error.message || `Error ${xhr.status}`));
            }
        };

        xhr.onerror = function() {
            reject(new Error('Error de red'));
        };

        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}

/**
 * Petición GET
 */
function get(endpoint, token = null) {
    return request('GET', endpoint, null, token);
}

/**
 * Petición POST
 */
function post(endpoint, data, token = null) {
    return request('POST', endpoint, data, token);
}

/**
 * Petición PUT
 */
function put(endpoint, data, token = null) {
    return request('PUT', endpoint, data, token);
}

/**
 * Petición DELETE
 */
function del(endpoint, token = null) {
    return request('DELETE', endpoint, null, token);
}

/**
 * Sube un FormData (multipart/form-data) usando XMLHttpRequest.
 * No se establece Content-Type manualmente para que el navegador agregue el boundary.
 * @param {string} method - 'POST' o 'PUT'
 * @param {string} endpoint - Endpoint de la API
 * @param {FormData} formData - Datos del formulario incluyendo archivos
 * @param {string} token - Token JWT (opcional)
 * @returns {Promise} Promise con la respuesta JSON
 */
function uploadFormData(method, endpoint, formData, token = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = API_BASE_URL + endpoint;

        xhr.open(method, url, true);
        xhr.responseType = 'json';

        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                const error = xhr.response || { message: 'Error en la petición' };
                reject(new Error(error.message || `Error ${xhr.status}`));
            }
        };

        xhr.onerror = function() {
            reject(new Error('Error de red'));
        };

        xhr.send(formData);
    });
}

/**
 * Obtiene el token JWT del localStorage
 */
function getToken() {
    return localStorage.getItem('jwtToken');
}

/**
 * Guarda el token JWT en localStorage
 */
function setToken(token) {
    localStorage.setItem('jwtToken', token);
}

/**
 * Elimina el token JWT del localStorage
 */
function removeToken() {
    localStorage.removeItem('jwtToken');
}

/**
 * Verifica si el usuario está autenticado
 */
function isAuthenticated() {
    return localStorage.getItem('jwtToken') !== null;
}

/**
 * Obtiene el rol del usuario autenticado
 */
function getUserRole() {
    return localStorage.getItem('userRole');
}

/**
 * Obtiene el ID del usuario autenticado
 */
function getUserId() {
    return localStorage.getItem('userId');
}

/**
 * Obtiene el username del usuario autenticado
 */
function getUsername() {
    return localStorage.getItem('userUsername');
}

/**
 * Cierra sesión del usuario
 */
function logout() {
    removeToken();
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUsername');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

/**
 * Guarda datos del usuario en localStorage
 */
function saveUserData(userData) {
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('userRole', userData.rol);
    localStorage.setItem('userName', userData.nombre);
    localStorage.setItem('userUsername', userData.username);
    localStorage.setItem('userEmail', userData.email || '');
}

// Exportar funciones para uso global
window.requestAPI = request;
window.get = get;
window.post = post;
window.put = put;
window.del = del;
window.uploadFormData = uploadFormData;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.isAuthenticated = isAuthenticated;
window.getUserRole = getUserRole;
window.getUserId = getUserId;
window.getUsername = getUsername;
window.logout = logout;
window.saveUserData = saveUserData;
