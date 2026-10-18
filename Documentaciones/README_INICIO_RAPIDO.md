# Ruffcol E-commerce - Inicio Rápido

## 🚀 ¿Qué es Ruffcol?

Sistema de e-commerce para tienda de ropa y accesorios para mascotas.

- **Backend**: Spring Boot (Java)
- **Frontend**: HTML/CSS/JavaScript
- **Base de Datos**: H2 (persistente)
- **Autenticación**: JWT (7 días de validez)

---

## ⚡ Inicio Rápido

### 1. Ejecutar el proyecto

```bash
cd ruffcol-backend
mvn spring-boot:run
```

### 2. Acceder a la aplicación

- **Tienda**: http://localhost:8080
- **Swagger (API Docs)**: http://localhost:8080/swagger-ui.html
- **Consola H2**: http://localhost:8080/h2-console

### 3. Usuarios de prueba

| Rol | Username | Password |
|-----|----------|----------|
| Super Admin | superadmin | admin123 |
| Cliente | Cliente_Prueba | Waos123_cliente |
| Admin | Admin_Principal | D4Clt//waos//tf2? |

---

## 📁 Estructura Básica

```
ruffcol-backend/
├── src/main/java/com/ruffcol/tienda/
│   ├── config/          # Configuraciones (JWT, Seguridad, CORS)
│   ├── controlador/     # Endpoints API REST
│   ├── dto/            # Objetos de transferencia de datos
│   ├── modelo/         # Entidades (Usuario, Producto, Pedido, etc.)
│   ├── repositorio/    # Acceso a datos (JPA)
│   └── servicio/       # Lógica de negocio
├── src/main/resources/
│   ├── static/         # Frontend (HTML, CSS, JS)
│   └── application.properties # Configuración
└── data/               # Base de datos H2 (persistente)
```

---

## 🔐 Flujo de Autenticación

1. **Registro**: Cliente se registra → Sistema crea usuario con contraseña encriptada
2. **Login**: Usuario ingresa → Sistema valida credenciales → Genera token JWT (7 días)
3. **Petición**: Frontend envía token en header `Authorization: Bearer {token}`
4. **Validación**: Filtro JWT valida token → Si es válido, permite acceso

---

## 🌐 Endpoints Principales

### Autenticación
- `POST /api/auth/register-cliente` - Registrar cliente
- `POST /api/auth/login` - Iniciar sesión

### Categorías
- `GET /api/categorias` - Listar categorías (público)
- `POST /api/categorias` - Crear categoría (ADMIN/SUPER_ADMIN)
- `DELETE /api/categorias/{id}` - Eliminar categoría (ADMIN/SUPER_ADMIN)

### Productos
- `GET /api/productos` - Listar productos (público)
- `POST /api/productos` - Crear producto (ADMIN/SUPER_ADMIN)
- `DELETE /api/productos/{id}` - Eliminar producto (ADMIN/SUPER_ADMIN)

### Pedidos
- `POST /api/pedidos` - Crear pedido (autenticado)
- `GET /api/pedidos/mis-pedidos` - Mis pedidos (autenticado)
- `GET /api/pedidos` - Todos los pedidos (ADMIN/SUPER_ADMIN)

---

## 🗄️ Base de Datos

### Configuración
- **Motor**: H2 Database (archivo persistente)
- **Ubicación**: `./data/ruffcol_db`
- **Usuario**: `sa`
- **Contraseña**: (vacía)

### Tablas
- `usuario` - Usuarios del sistema
- `categoria` - Categorías de productos
- `producto` - Productos
- `pedido` - Pedidos
- `detalle_pedido` - Detalles de pedidos

### Datos Iniciales
- 1 Super Admin
- 1 Cliente de prueba
- 1 Admin Principal
- 2 Categorías (Ropa y Vestidos, Arneses y Correas)

---

## 🎨 Frontend

### Páginas
- **index.html** - Catálogo de productos
- **login.html** - Login
- **registro.html** - Registro de clientes
- **carrito.html** - Carrito de compras
- **admin-dashboard.html** - Panel de administración
- **superadmin-dashboard.html** - Panel de super admin
- **pedidos-en-construccion.html** - Página informativa

### Funcionalidades
- Carrito persistente en localStorage
- Filtrado por categoría y búsqueda
- Subida de imágenes de productos
- Gestión completa de categorías y productos
- Vista de pedidos para administradores

---

## ⚙️ Configuración Importante

### application.properties

```properties
# Base de datos persistente (no se borra al reiniciar)
spring.datasource.url=jdbc:h2:file:./data/ruffcol_db

# Token JWT válido por 7 días
jwt.expiration=604800000

# Subida de imágenes hasta 10MB
spring.servlet.multipart.max-file-size=10MB

# CORS permite localhost:8080 y localhost:3000
cors.allowed.origins=http://localhost:8080,http://localhost:3000
```

---

## 🔧 Problemas Comunes

### 1. "Sesión expirada"
- **Solución**: Cerrar sesión y volver a iniciar sesión (token ahora dura 7 días)

### 2. "Forbidden" al crear pedido
- **Solución**: Verificar que en `SecurityConfig.java` `/api/pedidos` use `.authenticated()`

### 3. Datos se borran al reiniciar
- **Solución**: Verificar que use `jdbc:h2:file:./data/ruffcol_db` (no `mem:`)

### 4. Puerto 8080 en uso
- **Solución**: Cambiar en `application.properties`: `server.port=8081`

---

## 📚 Documentación Completa

Para información detallada de cada archivo, método y configuración, ver:
- **DOCUMENTACION_COMPLETA.md** - Documentación técnica completa

---

## 🛠️ Requisitos

- Java 17+
- Maven 3.6+
- Navegador web moderno

---

## 📝 Notas

- Los datos persisten en archivo H2 (no se borran al reiniciar)
- El carrito se guarda en localStorage del navegador
- Las imágenes se guardan en el directorio `uploads/`
- El sistema de pedidos está en construcción (muestra página informativa)

---

**Versión**: 1.0.0
**Última actualización**: Octubre 2026
